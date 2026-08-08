import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/admin';
import { calculateAstrologicalData, calculateCurrentGochar } from '../../../lib/astrology/astro';
import { calculatePanchanga } from '../../../lib/astrology/panchanga';
import { calculateVimshottari, getCurrentDashaChain } from '../../../lib/astrology/dashas';
import { calculateSaturnTransits } from '../../../lib/astrology/transits';
import { calculateShubhashubh } from '../../../lib/astrology/shubhashubh';
import { calculateVargaSign } from '../../../lib/astrology/vargas';
import { calculateBphsPlanetaryStrengths } from '../../../lib/astrology/shadbala';
import { getSwisseph } from '../../../lib/astrology/swisseph';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
    }

    const docRef = adminDb.collection('submissions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Submission record not found' }, { status: 404 });
    }

    const data = docSnap.data();
    if (!data) {
      return NextResponse.json({ error: 'Empty record data' }, { status: 500 });
    }

    const { date, time, lat, lng, tzOffset } = data.birthDetails;
    const [yearStr, monthStr, dayStr] = date.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    const timeParts = time.split(':');
    const hour = parseInt(timeParts[0]);
    const min = parseInt(timeParts[1]);
    const sec = timeParts[2] ? parseInt(timeParts[2]) : 0;

    await getSwisseph();
    const astro = calculateAstrologicalData(year, month, day, hour, min, sec, lat, lng, tzOffset);
    const birthDateObj = new Date(year, month - 1, day, hour, min, sec);
    const lagnaSignIndex = Math.floor(astro.ascendant / 30);

    const panchanga = calculatePanchanga(astro.jd, tzOffset);
    const dasha = calculateVimshottari(astro.planets.Moon.longitude, birthDateObj);
    const currentDashaChain = getCurrentDashaChain(astro.planets.Moon.longitude, birthDateObj, new Date());
    const transits = calculateSaturnTransits(astro.jd, astro.planets.Moon.sign, tzOffset, new Date());
    const shubha = calculateShubhashubh(birthDateObj, lagnaSignIndex);
    const currentGochar = calculateCurrentGochar(astro.ascendant, astro.planets.Moon.sign, new Date(), tzOffset);
    const bphsStrengths = calculateBphsPlanetaryStrengths(astro.planets, astro.ascendant);

    // Navamsha (D9) placements
    const d9Placements: Record<string, { sign: number; isRetrograde: boolean }> = {};
    for (const [pname, pobj] of Object.entries(astro.planets)) {
      d9Placements[pname] = {
        sign: calculateVargaSign(pobj.longitude, 'D9'),
        isRetrograde: pobj.isRetrograde,
      };
    }
    const d9Lagna = calculateVargaSign(astro.ascendant, 'D9');

    // Cusp placements
    const cuspPlacements: Record<string, { sign: number; isRetrograde: boolean }> = {};
    for (const [pname, pobj] of Object.entries(astro.planets)) {
      let pCuspSign = pobj.sign;
      for (let h = 0; h < 11; h++) {
        if (pobj.longitude >= astro.houses[h] && pobj.longitude < astro.houses[h + 1]) {
          pCuspSign = h;
          break;
        }
      }
      cuspPlacements[pname] = {
        sign: pCuspSign,
        isRetrograde: pobj.isRetrograde,
      };
    }

    return NextResponse.json(
      {
        success: true,
        client: data,
        astro,
        panchanga,
        dasha,
        currentDashaChain,
        transits,
        shubha,
        lagnaSignIndex,
        d9Lagna,
        d9Placements,
        cuspPlacements,
        currentGochar,
        bphsStrengths,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {

    console.error('Kundli API Calculation error:', error);
    return NextResponse.json({ error: error.message || 'Calculation failed' }, { status: 500 });
  }
}
