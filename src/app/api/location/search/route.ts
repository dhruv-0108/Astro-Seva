import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface LocationResult {
  display_name: string;
  full_name: string;
  name: string;
  subdistrict?: string;
  district?: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  type: string;
  code?: string;
}

// In-memory cache for fast responsive search (1 hour TTL)
const searchCache = new Map<string, { data: LocationResult[]; timestamp: number }>();
const CACHE_TTL = 3600 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryStr = searchParams.get('q');

    if (!queryStr || queryStr.trim().length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const q = queryStr.trim().toLowerCase();

    // Check cache
    const cached = searchCache.get(q);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, results: cached.data });
    }

    // Prepare multi-source fetchers with official server User-Agent headers
    const customHeaders = {
      'User-Agent': 'Astro-Seva-VedicAstrology/1.0 (https://astro-seva-mocha.vercel.app; contact@astro-seva.com)',
      'Accept-Language': 'en-US,en;q=0.9,gu;q=0.8,hi;q=0.7',
    };

    const nomUrlGeneral = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}&countrycodes=in&addressdetails=1&extratags=1&namedetails=1&limit=15`;

    const nomUrlVillage = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      `${q} village India`
    )}&addressdetails=1&extratags=1&limit=10`;

    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      q
    )}&lat=20.5937&lon=78.9629&zoom=4&limit=15`;

    const [nomGenRes, nomVilRes, photonRes] = await Promise.allSettled([
      fetch(nomUrlGeneral, { headers: customHeaders }).then((r) => r.json()),
      fetch(nomUrlVillage, { headers: customHeaders }).then((r) => r.json()),
      fetch(photonUrl, { headers: customHeaders }).then((r) => r.json()),
    ]);

    const nomGenData = nomGenRes.status === 'fulfilled' && Array.isArray(nomGenRes.value) ? nomGenRes.value : [];
    const nomVilData = nomVilRes.status === 'fulfilled' && Array.isArray(nomVilRes.value) ? nomVilRes.value : [];
    const photonFeatures =
      photonRes.status === 'fulfilled' && photonRes.value?.features ? photonRes.value.features : [];

    const results: LocationResult[] = [];
    const seenCoords = new Set<string>();

    // Helper to process Nominatim items
    const processNomItem = (item: any) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) return;

      const coordKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
      if (seenCoords.has(coordKey)) return;
      seenCoords.add(coordKey);

      const addr = item.address || {};
      const villageName =
        addr.village ||
        addr.town ||
        addr.city ||
        addr.hamlet ||
        addr.suburb ||
        addr.locality ||
        addr.neighbourhood ||
        addr.county ||
        item.name;

      const subdistrict =
        addr.tehsil ||
        addr.taluk ||
        addr.subdistrict ||
        addr.sub_district ||
        addr.block ||
        addr.county ||
        addr.state_district;

      const district = addr.district || addr.state_district || addr.county;
      const state = addr.state;
      const country = addr.country || 'India';
      const postcode = addr.postcode || item.extratags?.postcode || item.extratags?.ref || '';

      // Build clean hierarchical label to distinguish duplicate village names
      const mainPlace = villageName || item.display_name.split(',')[0];
      const hierarchyParts = [
        mainPlace,
        subdistrict && subdistrict !== mainPlace ? `${subdistrict} Taluka` : null,
        district && district !== mainPlace ? `${district} Dist` : null,
        state,
        country,
      ].filter(Boolean);

      // Remove duplicate parts
      const cleanDisplay = Array.from(new Set(hierarchyParts)).join(', ');

      const placeType = addr.village || addr.hamlet
        ? 'Village'
        : addr.town
        ? 'Town'
        : addr.city
        ? 'City'
        : addr.suburb
        ? 'Locality'
        : 'Location';

      results.push({
        display_name: cleanDisplay,
        full_name: item.display_name,
        name: mainPlace,
        subdistrict: subdistrict || '',
        district: district || '',
        state: state || '',
        country: country,
        lat: lat,
        lon: lon,
        type: placeType,
        code: postcode || item.place_id ? `OSM-${item.place_id}` : undefined,
      });
    };

    // Process all Nominatim General & Village results
    nomGenData.forEach(processNomItem);
    nomVilData.forEach(processNomItem);

    // Helper to process Photon features
    photonFeatures.forEach((feat: any) => {
      const props = feat.properties || {};
      const coords = feat.geometry?.coordinates || [0, 0];
      const lon = coords[0];
      const lat = coords[1];

      if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) return;

      const coordKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
      if (seenCoords.has(coordKey)) return;
      seenCoords.add(coordKey);

      const mainPlace = props.name || props.city || props.town || props.village || props.district;
      const subdistrict = props.district || props.county;
      const district = props.county || props.district || props.city;
      const state = props.state;
      const country = props.country || 'India';

      const hierarchyParts = [
        mainPlace,
        subdistrict && subdistrict !== mainPlace ? subdistrict : null,
        district && district !== mainPlace ? district : null,
        state,
        country,
      ].filter(Boolean);

      const cleanDisplay = Array.from(new Set(hierarchyParts)).join(', ');

      const placeType =
        props.osm_value === 'village' || props.type === 'village'
          ? 'Village'
          : props.osm_value === 'town' || props.type === 'town'
          ? 'Town'
          : props.type === 'city'
          ? 'City'
          : 'Location';

      results.push({
        display_name: cleanDisplay,
        full_name: `${cleanDisplay} ${props.postcode ? `(${props.postcode})` : ''}`,
        name: mainPlace,
        subdistrict: subdistrict || '',
        district: district || '',
        state: state || '',
        country: country,
        lat: lat,
        lon: lon,
        type: placeType,
        code: props.postcode || (props.osm_id ? `OSM-${props.osm_id}` : undefined),
      });
    });

    // Save to in-memory cache
    if (results.length > 0) {
      searchCache.set(q, { data: results, timestamp: Date.now() });
    }

    return NextResponse.json(
      { success: true, results },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error: any) {
    console.error('Location search API error:', error);
    return NextResponse.json({ success: false, results: [], error: error.message }, { status: 500 });
  }
}
