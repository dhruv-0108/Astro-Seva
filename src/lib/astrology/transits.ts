import swisseph from './swisseph';
import { jdToLocalDate } from './panchanga';

export interface SaturnTransit {
  type: 'નાની પનોતી' | 'સાડાસાતી' | 'સામાન્ય ગોચર'; // Dhaiya, Sadesati, or Standard
  saturnSign: number; // 0 to 11
  saturnSignFormatted: string; // Gujarati name
  startDate: Date;
  endDate: Date;
  paya: 'સોનુ' | 'ચાંદી' | 'તાંબુ' | 'લોખંડ'; // Gold, Silver, Copper, Iron
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
  // House distance (1-indexed)
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
  timezoneOffset: number
): SaturnTransit[] {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const transits: SaturnTransit[] = [];
  const spanDays = 100 * 365.25;
  const endJd = birthJd + spanDays;

  let currentJd = birthJd;
  let currentSign = getSaturnSign(currentJd);
  let transitStartJd = birthJd;

  const step = 15; // 15-day steps for fast scanning

  while (currentJd < endJd) {
    const nextJd = currentJd + step;
    const nextSign = getSaturnSign(nextJd);

    if (nextSign !== currentSign) {
      // Find the exact entry time using binary search
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

      // Determine details for the period [transitStartJd, entryJd]
      const startDate = jdToLocalDate(transitStartJd, timezoneOffset);
      const endDate = jdToLocalDate(entryJd, timezoneOffset);
      
      // Calculate transit Moon sign at the moment of entry
      const entryMoon = getMoonSign(entryJd);
      const paya = calculatePaya(entryMoon, natalMoonSign);

      // Determine if this transit is Sadesati or Dhaiya (Panoti)
      // House distance of Saturn from natal Moon (1-indexed)
      const saturnHouse = ((currentSign - natalMoonSign + 12) % 12) + 1;
      
      let type: 'નાની પનોતી' | 'સાડાસાતી' | 'સામાન્ય ગોચર' = 'સામાન્ય ગોચર';
      if (saturnHouse === 12 || saturnHouse === 1 || saturnHouse === 2) {
        type = 'સાડાસાતી';
      } else if (saturnHouse === 4 || saturnHouse === 8) {
        type = 'નાની પનોતી';
      }

      // Filter and only save active Sadesati and Dhaiya periods, or we can save all.
      // The user wants Sadesati/Panoti analysis (as shown in image 5), which lists all Sadesati and Panoti transits.
      if (type !== 'સામાન્ય ગોચર') {
        transits.push({
          type,
          saturnSign: currentSign,
          saturnSignFormatted: RASHI_NAMES_GU[currentSign],
          startDate,
          endDate,
          paya,
        });
      }

      // Reset for the next sign
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
  if (saturnHouse === 12 || saturnHouse === 1 || saturnHouse === 2) {
    type = 'સાડાસાતી';
  } else if (saturnHouse === 4 || saturnHouse === 8) {
    type = 'નાની પનોતી';
  }
  
  if (type !== 'સામાન્ય ગોચર') {
    const entryMoon = getMoonSign(transitStartJd);
    const paya = calculatePaya(entryMoon, natalMoonSign);
    transits.push({
      type,
      saturnSign: currentSign,
      saturnSignFormatted: RASHI_NAMES_GU[currentSign],
      startDate,
      endDate,
      paya,
    });
  }

  return transits;
}
