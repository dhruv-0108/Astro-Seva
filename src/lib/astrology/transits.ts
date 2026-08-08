import swisseph from './swisseph';
import { jdToLocalDate } from './panchanga';

export interface SaturnTransit {
  type: 'નાની પનોતી' | 'સાડાસાતી' | 'સામાન્ય ગોચર'; // Dhaiya, Sadesati, or Standard
  saturnSign: number; // 0 to 11
  saturnSignFormatted: string; // Gujarati name
  saturnHouse: number; // 1 to 12 from natal Moon
  sadesatiPhase?: 1 | 2 | 3; // 1=First (12th), 2=Middle (1st), 3=Final (2nd)
  startDate: Date;
  endDate: Date;
  paya: 'સોનુ' | 'ચાંદી' | 'તાંબુ' | 'લોખંડ'; // Gold, Silver, Copper, Iron
  status: 'Completed' | 'Active' | 'Upcoming';
}

const RASHI_NAMES_GU = [
  'મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'
];

// Helper to get Saturn sign at a Julian Date
function getSaturnSign(jd: number): number {
  const res = swisseph.swe_calc_ut(jd, swisseph.SE_SATURN, swisseph.SEFLG_SIDEREAL);
  let long = res.longitude;
  if (long < 0) long += 360;
  return Math.floor(long / 30) % 12;
}

// Helper to get Moon sign at a Julian Date
function getMoonSign(jd: number): number {
  const res = swisseph.swe_calc_ut(jd, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL);
  let long = res.longitude;
  if (long < 0) long += 360;
  return Math.floor(long / 30) % 12;
}

// Calculate the transit Paya (Metal) based on transit Moon relative to natal Moon
function calculatePaya(transitMoonSign: number, natalMoonSign: number): 'સોનુ' | 'ચાંદી' | 'તાંબુ' | 'લોખંડ' {
  const house = ((transitMoonSign - natalMoonSign + 12) % 12) + 1;
  if (house === 1 || house === 6 || house === 11) return 'સોનુ'; // Swarna
  if (house === 2 || house === 5 || house === 9) return 'ચાંદી'; // Rajat
  if (house === 3 || house === 7 || house === 10) return 'તાંબુ'; // Tamra
  return 'લોખંડ'; // Loha
}

// Main transit generator for a 100-year span since birth
export function calculateSaturnTransits(
  birthJd: number,
  natalMoonSign: number,
  timezoneOffset: number,
  targetDate: Date = new Date()
): SaturnTransit[] {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const transits: SaturnTransit[] = [];
  const spanDays = 100 * 365.25;
  const endJd = birthJd + spanDays;
  const targetMs = targetDate.getTime();

  let currentJd = birthJd;
  let currentSign = getSaturnSign(currentJd);
  let transitStartJd = birthJd;

  const step = 15; // 15-day steps for fast scanning

  while (currentJd < endJd) {
    const nextJd = currentJd + step;
    const nextSign = getSaturnSign(nextJd);

    if (nextSign !== currentSign) {
      let low = currentJd;
      let high = nextJd;
      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        if (getSaturnSign(mid) === currentSign) {
          low = mid;
        } else {
          high = mid;
        }
      }
      const entryJd = (low + high) / 2;

      const startDate = jdToLocalDate(transitStartJd, timezoneOffset);
      const endDate = jdToLocalDate(entryJd, timezoneOffset);
      
      const entryMoon = getMoonSign(entryJd);
      const paya = calculatePaya(entryMoon, natalMoonSign);

      const saturnHouse = ((currentSign - natalMoonSign + 12) % 12) + 1;
      
      let type: 'નાની પનોતી' | 'સાડાસાતી' | 'સામાન્ય ગોચર' = 'સામાન્ય ગોચર';
      let sadesatiPhase: 1 | 2 | 3 | undefined = undefined;

      if (saturnHouse === 12) {
        type = 'સાડાસાતી';
        sadesatiPhase = 1;
      } else if (saturnHouse === 1) {
        type = 'સાડાસાતી';
        sadesatiPhase = 2;
      } else if (saturnHouse === 2) {
        type = 'સાડાસાતી';
        sadesatiPhase = 3;
      } else if (saturnHouse === 4 || saturnHouse === 8) {
        type = 'નાની પનોતી';
      }

      if (type !== 'સામાન્ય ગોચર') {
        const startMs = startDate.getTime();
        const endMs = endDate.getTime();
        let status: 'Completed' | 'Active' | 'Upcoming' = 'Completed';
        if (targetMs >= startMs && targetMs <= endMs) {
          status = 'Active';
        } else if (targetMs < startMs) {
          status = 'Upcoming';
        }

        transits.push({
          type,
          saturnSign: currentSign,
          saturnSignFormatted: RASHI_NAMES_GU[currentSign],
          saturnHouse,
          sadesatiPhase,
          startDate,
          endDate,
          paya,
          status,
        });
      }

      currentSign = nextSign;
      transitStartJd = entryJd;
    }

    currentJd = nextJd;
  }

  // Handle final incomplete transit segment
  const startDate = jdToLocalDate(transitStartJd, timezoneOffset);
  const endDate = jdToLocalDate(endJd, timezoneOffset);
  const saturnHouse = ((currentSign - natalMoonSign + 12) % 12) + 1;
  let type: 'નાની પનોતી' | 'સાડાસાતી' | 'સામાન્ય ગોચર' = 'સામાન્ય ગોચર';
  let sadesatiPhase: 1 | 2 | 3 | undefined = undefined;

  if (saturnHouse === 12) {
    type = 'સાડાસાતી';
    sadesatiPhase = 1;
  } else if (saturnHouse === 1) {
    type = 'સાડાસાતી';
    sadesatiPhase = 2;
  } else if (saturnHouse === 2) {
    type = 'સાડાસાતી';
    sadesatiPhase = 3;
  } else if (saturnHouse === 4 || saturnHouse === 8) {
    type = 'નાની પનોતી';
  }
  
  if (type !== 'સામાન્ય ગોચર') {
    const entryMoon = getMoonSign(transitStartJd);
    const paya = calculatePaya(entryMoon, natalMoonSign);
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    let status: 'Completed' | 'Active' | 'Upcoming' = 'Completed';
    if (targetMs >= startMs && targetMs <= endMs) {
      status = 'Active';
    } else if (targetMs < startMs) {
      status = 'Upcoming';
    }

    transits.push({
      type,
      saturnSign: currentSign,
      saturnSignFormatted: RASHI_NAMES_GU[currentSign],
      saturnHouse,
      sadesatiPhase,
      startDate,
      endDate,
      paya,
      status,
    });
  }

  return transits;
}
