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
  score?: number;
}

// In-memory server cache for responsive search (1 hour TTL)
const searchCache = new Map<string, { data: LocationResult[]; timestamp: number }>();
const CACHE_TTL = 3600 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryStr = searchParams.get('q');

    if (!queryStr || queryStr.trim().length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const rawInput = queryStr.trim();
    const cacheKey = rawInput.toLowerCase();

    // Check in-memory server cache
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, results: cached.data });
    }

    // 1. Clean stop-words (gaam, gam, village, vistar, taluka, dist, etc.)
    const cleaned = rawInput
      .toLowerCase()
      .replace(/\b(gaam|gam|village|vistar|taluka|taluk|tehsil|dist|district)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const tokens = cleaned.split(' ').filter((t) => t.length >= 2);
    const mainToken = tokens[0] || cleaned;
    const contextTokens = tokens.slice(1);

    const customHeaders = {
      'User-Agent': 'Astro-Seva-VedicAstrology/1.0 (https://astro-seva-mocha.vercel.app; contact@astro-seva.com)',
      'Accept-Language': 'en-US,en;q=0.9,gu;q=0.8,hi;q=0.7',
    };

    // 2. Prepare Parallel Multi-Strategy Queries
    const fetchUrls: string[] = [
      // Direct freeform India search
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&countrycodes=in&addressdetails=1&extratags=1&namedetails=1&limit=15`,
    ];

    if (contextTokens.length > 0) {
      // Structured token search (mainToken + context e.g. Gola Olpad / Shuklatirth Bharuch)
      fetchUrls.push(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mainToken)}+${encodeURIComponent(
          contextTokens.join('+')
        )}&countrycodes=in&addressdetails=1&extratags=1&limit=15`
      );
      fetchUrls.push(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          mainToken
        )}&county=${encodeURIComponent(contextTokens.join(' '))}&countrycodes=in&addressdetails=1&extratags=1&limit=15`
      );
    }

    // Main token village search
    fetchUrls.push(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        mainToken
      )}+village+India&addressdetails=1&extratags=1&limit=15`
    );

    // Photon API geocoder query with India lat/lon bias
    fetchUrls.push(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(cleaned)}&lat=20.5937&lon=78.9629&zoom=4&limit=15`
    );

    const responses = await Promise.allSettled(
      fetchUrls.map((url) => fetch(url, { headers: customHeaders }).then((r) => r.json()))
    );

    const results: LocationResult[] = [];
    const seenCoords = new Set<string>();

    for (const res of responses) {
      if (res.status !== 'fulfilled' || !res.value) continue;
      const items = Array.isArray(res.value) ? res.value : res.value.features || [];

      for (const item of items) {
        const isPhoton = Boolean(item.properties);
        const props = isPhoton ? item.properties : item.address || {};
        const coords = isPhoton ? item.geometry?.coordinates || [0, 0] : [item.lon, item.lat];
        const lon = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);

        if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) continue;
        const coordKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
        if (seenCoords.has(coordKey)) continue;
        seenCoords.add(coordKey);

        const rawName = isPhoton ? props.name : item.name;

        // Clean place name extraction (prioritize village/suburb/hamlet/town/locality tags)
        const villageCandidate =
          props.village ||
          props.suburb ||
          props.hamlet ||
          props.town ||
          props.city ||
          props.locality ||
          props.county ||
          rawName;

        const cleanVillageName = (villageCandidate || '')
          .replace(/^(Primary Health Centre|PHC|Hospital|Gram Panchayat|Post Office|Temple|Ashram),?\s*/i, '')
          .trim();

        const mainPlace = cleanVillageName || rawName || 'Location';

        const subdistrict = (props.tehsil || props.taluk || props.subdistrict || props.sub_district || props.block || props.county || '')
          .replace(/\s*(taluka|taluk|tehsil|block)\s*/gi, '')
          .trim();

        const district = (props.district || props.state_district || props.county || '')
          .replace(/\s*(district|dist)\s*/gi, '')
          .trim();

        const state = props.state || '';
        const country = props.country || 'India';
        const postcode = props.postcode || item.extratags?.postcode || '';

        // Form clean hierarchical label (avoiding duplicate "Taluka Taluka" suffixes)
        const hierarchyParts = [
          mainPlace,
          subdistrict && subdistrict.toLowerCase() !== mainPlace.toLowerCase() ? `${subdistrict} Taluka` : null,
          district && district.toLowerCase() !== mainPlace.toLowerCase() && district.toLowerCase() !== subdistrict.toLowerCase()
            ? `${district} Dist`
            : null,
          state,
          country,
        ].filter(Boolean);

        const cleanDisplay = Array.from(new Set(hierarchyParts)).join(', ');

        const placeType =
          props.village || props.suburb || props.hamlet || props.osm_value === 'village'
            ? 'Village'
            : props.town || props.osm_value === 'town'
            ? 'Town'
            : props.city || props.type === 'city'
            ? 'City'
            : 'Location';

        // Multi-Token Relevance Scoring
        const fullSearchBlob = `${mainPlace} ${subdistrict} ${district} ${state} ${country} ${item.display_name || ''}`.toLowerCase();
        let score = 0;

        tokens.forEach((token) => {
          if (fullSearchBlob.includes(token)) {
            score += 25;
          }
        });
        if (mainPlace.toLowerCase().startsWith(mainToken)) score += 30;
        if (placeType === 'Village') score += 15;

        results.push({
          display_name: cleanDisplay,
          full_name: item.display_name || cleanDisplay,
          name: mainPlace,
          subdistrict: subdistrict ? `${subdistrict} Taluka` : '',
          district: district ? `${district} Dist` : '',
          state: state,
          country: country,
          lat: lat,
          lon: lon,
          type: placeType,
          code: postcode || (item.place_id ? `OSM-${item.place_id}` : undefined),
          score: score,
        });
      }
    }

    // Sort by relevance score descending
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Save to in-memory server cache
    if (results.length > 0) {
      searchCache.set(cacheKey, { data: results, timestamp: Date.now() });
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
