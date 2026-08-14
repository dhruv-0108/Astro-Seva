import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/admin';
import { calculateAstrologicalData, calculateCurrentGochar } from '../../../lib/astrology/astro';
import { calculatePanchanga } from '../../../lib/astrology/panchanga';
import { calculateVimshottari, getCurrentDashaChain } from '../../../lib/astrology/dashas';
import { calculateSaturnTransits } from '../../../lib/astrology/transits';
import { calculateShubhashubh } from '../../../lib/astrology/shubhashubh';
import { calculateVargaSign, VargaName } from '../../../lib/astrology/vargas';
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

    // Compute all 16 Shodashavarga Divisional Charts
    const vargaNames: VargaName[] = [
      'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
    ];
    const vargasData: Record<string, { lagnaSign: number; placements: Record<string, { sign: number; isRetrograde: boolean }> }> = {};

    for (const v of vargaNames) {
      const vLagna = calculateVargaSign(astro.ascendant, v);
      const vPlacements: Record<string, { sign: number; isRetrograde: boolean }> = {};
      for (const [pname, pobj] of Object.entries(astro.planets)) {
        vPlacements[pname] = {
          sign: calculateVargaSign(pobj.longitude, v),
          isRetrograde: pobj.isRetrograde,
        };
      }
      vargasData[v] = {
        lagnaSign: vLagna,
        placements: vPlacements,
      };
    }

    const d9Lagna = vargasData['D9'].lagnaSign;
    const d9Placements = vargasData['D9'].placements;

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
        vargasData,
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
