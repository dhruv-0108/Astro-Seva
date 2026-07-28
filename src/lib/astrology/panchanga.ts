import swisseph from './swisseph';

export interface PanchangaElement {
  name: string;
  value: number; // index
  formatted: string; // Gujarati name
  startTime: Date;
  endTime: Date;
}

export interface PanchangaData {
  tithi: PanchangaElement;
  nakshatra: PanchangaElement;
  yoga: PanchangaElement;
  karana: PanchangaElement;
  rashi: PanchangaElement;
}

export const TITHI_NAMES = [
  'સુદ એકમ (Prathama)', 'સુદ બીજ (Dwitiya)', 'સુદ ત્રીજ (Tritiya)', 'સુદ ચોથ (Chaturthi)', 'સુદ પાંચમ (Panchami)',
  'સુદ છઠ (Shashthi)', 'સુદ સાતમ (Saptami)', 'સુદ આઠમ (Ashtami)', 'સુદ નોમ (Navami)', 'સુદ દશમ (Dashami)',
  'સુદ અગિયારસ (Ekadashi)', 'સુદ બારસ (Dwadashi)', 'સુદ તેરસ (Trayodashi)', 'સુદ ચૌદસ (Chaturdashi)', 'પૂનમ (Purnima)',
  'વદ એકમ (Prathama)', 'વદ બીજ (Dwitiya)', 'વદ ત્રીજ (Tritiya)', 'વદ ચોથ (Chaturthi)', 'વદ પાંચમ (Panchami)',
  'વદ છઠ (Shashthi)', 'વદ સાતમ (Saptami)', 'વદ આઠમ (Ashtami)', 'વદ નોમ (Navami)', 'વદ દશમ (Dashami)',
  'વદ અગિયારસ (Ekadashi)', 'વદ બારસ (Dwadashi)', 'વદ તેરસ (Trayodashi)', 'વદ ચૌદસ (Chaturdashi)', 'અમાસ (Amavasya)'
];

export const NAKSHATRA_NAMES = [
  'અશ્વિની', 'ભરણી', 'કૃતિકા', 'રોહિણી', 'મૃગશીર્ષ', 'આર્દ્રા',
  'પુનર્વસુ', 'પુષ્ય', 'આશ્લેષા', 'મઘા', 'પૂર્વા ફાલ્ગુની', 'ઉત્તરા ફાલ્ગુની',
  'હસ્ત', 'ચિત્રા', 'સ્વાતિ', 'વિશાખા', 'અનુરાધા', 'જ્યેષ્ઠા',
  'મૂળ', 'પૂર્વાષાઢા', 'ઉત્તરાષાઢા', 'શ્રવણ', 'ધનિષ્ઠા', 'શતભિષા',
  'પૂર્વ ભાદ્રપદ', 'ઉત્તર ભાદ્રપદ', 'રેવતી'
];

export const YOGA_NAMES = [
  'વિષ્કંભ', 'પ્રીતિ', 'આયુષ્માન', 'સૌભાગ્ય', 'શોભન', 'અતિગંડ',
  'સુકર્મા', 'ધૃતિ', 'શૂલ', 'ગંડ', 'વૃદ્ધિ', 'ધ્રુવ',
  'વ્યાઘાત', 'હર્ષણ', 'વજ્ર', 'સિદ્ધિ', 'વ્યતીપાત', 'વરીયાન',
  'પરિઘ', 'શિવ', 'સિદ્ધ', 'સાધ્ય', 'શુભ', 'શુક્લ',
  'બ્રહ્મ', 'ઐન્દ્ર', 'વૈધૃતિ'
];

export const KARANA_NAMES = [
  'કિંસ્તુઘ્ન', 'બવ', 'બાલવ', 'કૌલવ', 'તૈતિલ', 'ગર', 'વણિજ', 'વિષ્ટિ',
  'શકુનિ', 'ચતુષ્પાદ', 'નાગ'
];

export const RASHI_NAMES = [
  'મેષ (Aries)', 'વૃષભ (Taurus)', 'મિથુન (Gemini)', 'કર્ક (Cancer)',
  'સિંહ (Leo)', 'કન્યા (Virgo)', 'તુલા (Libra)', 'વૃશ્ચિક (Scorpio)',
  'ધન (Sagittarius)', 'મકર (Capricorn)', 'કુંભ (Aquarius)', 'મીન (Pisces)'
];

// Helper to convert Julian Date back to Date object using timezone offset
export function jdToLocalDate(jd: number, timezoneOffsetHours: number): Date {
  const dateObj = swisseph.swe_revjul(jd, swisseph.SE_GREG_CAL);
  const utcMs = Date.UTC(
    dateObj.year,
    dateObj.month - 1,
    dateObj.day,
    Math.floor(dateObj.hour),
    Math.floor((dateObj.hour % 1) * 60),
    Math.floor((((dateObj.hour % 1) * 60) % 1) * 60)
  );
  // Add timezone offset to get local time
  return new Date(utcMs + timezoneOffsetHours * 60 * 60 * 1000);
}

// Get Planet sidereal longitude helper
function getSiderealLong(jd: number, planetId: number): number {
  const flag = swisseph.SEFLG_SIDEREAL;
  const res = swisseph.swe_calc_ut(jd, planetId, flag);
  let long = res.longitude;
  if (long < 0) long += 360;
  return long;
}

// Calculation formulas
export function getTithiIdx(jd: number): number {
  const moon = getSiderealLong(jd, swisseph.SE_MOON);
  const sun = getSiderealLong(jd, swisseph.SE_SUN);
  const diff = (moon - sun + 360) % 360;
  return Math.floor(diff / 12) % 30;
}

export function getNakshatraIdx(jd: number): number {
  const moon = getSiderealLong(jd, swisseph.SE_MOON);
  return Math.floor(moon / (360 / 27)) % 27;
}

export function getYogaIdx(jd: number): number {
  const moon = getSiderealLong(jd, swisseph.SE_MOON);
  const sun = getSiderealLong(jd, swisseph.SE_SUN);
  const sum = (sun + moon + 360) % 360;
  return Math.floor(sum / (360 / 27)) % 27;
}

export function getKaranaIdx(jd: number): number {
  const moon = getSiderealLong(jd, swisseph.SE_MOON);
  const sun = getSiderealLong(jd, swisseph.SE_SUN);
  const diff = (moon - sun + 360) % 360;
  const halfTithi = Math.floor(diff / 6) % 60;
  
  if (halfTithi === 0) return 0; // Kintughna
  if (halfTithi >= 57) {
    return 7 + (halfTithi - 57); // 57=Shakuni, 58=Chatuspada, 59=Naga
  }
  return 1 + ((halfTithi - 1) % 7); // Bava to Vishti recurring
}

export function getRashiIdx(jd: number): number {
  const moon = getSiderealLong(jd, swisseph.SE_MOON);
  return Math.floor(moon / 30) % 12;
}

// Scans backward and forward in time to find transition boundaries
function findTransition(
  jd: number,
  getValue: (j: number) => number,
  birthValue: number,
  timezoneOffset: number
): { startTime: Date; endTime: Date } {
  const step = 0.04; // 1 hour steps
  
  // Find start boundary (scan backward)
  let startJd = jd;
  while (getValue(startJd) === birthValue) {
    startJd -= step;
  }
  // Binary search for exact start transition
  let low = startJd;
  let high = startJd + step;
  for (let i = 0; i < 15; i++) {
    const mid = (low + high) / 2;
    if (getValue(mid) === birthValue) {
      high = mid;
    } else {
      low = mid;
    }
  }
  const exactStartJd = (low + high) / 2;

  // Find end boundary (scan forward)
  let endJd = jd;
  while (getValue(endJd) === birthValue) {
    endJd += step;
  }
  // Binary search for exact end transition
  low = endJd - step;
  high = endJd;
  for (let i = 0; i < 15; i++) {
    const mid = (low + high) / 2;
    if (getValue(mid) === birthValue) {
      low = mid;
    } else {
      high = mid;
    }
  }
  const exactEndJd = (low + high) / 2;

  return {
    startTime: jdToLocalDate(exactStartJd, timezoneOffset),
    endTime: jdToLocalDate(exactEndJd, timezoneOffset),
  };
}

export function calculatePanchanga(
  jd: number,
  timezoneOffset: number
): PanchangaData {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const tithiVal = getTithiIdx(jd);
  const tithiTrans = findTransition(jd, getTithiIdx, tithiVal, timezoneOffset);

  const nakshatraVal = getNakshatraIdx(jd);
  const nakshatraTrans = findTransition(jd, getNakshatraIdx, nakshatraVal, timezoneOffset);

  const yogaVal = getYogaIdx(jd);
  const yogaTrans = findTransition(jd, getYogaIdx, yogaVal, timezoneOffset);

  const karanaVal = getKaranaIdx(jd);
  const karanaTrans = findTransition(jd, getKaranaIdx, karanaVal, timezoneOffset);

  const rashiVal = getRashiIdx(jd);
  const rashiTrans = findTransition(jd, getRashiIdx, rashiVal, timezoneOffset);

  return {
    tithi: {
      name: 'Tithi',
      value: tithiVal,
      formatted: TITHI_NAMES[tithiVal],
      startTime: tithiTrans.startTime,
      endTime: tithiTrans.endTime,
    },
    nakshatra: {
      name: 'Nakshatra',
      value: nakshatraVal,
      formatted: NAKSHATRA_NAMES[nakshatraVal],
      startTime: nakshatraTrans.startTime,
      endTime: nakshatraTrans.endTime,
    },
    yoga: {
      name: 'Yoga',
      value: yogaVal,
      formatted: YOGA_NAMES[yogaVal],
      startTime: yogaTrans.startTime,
      endTime: yogaTrans.endTime,
    },
    karana: {
      name: 'Karana',
      value: karanaVal,
      formatted: KARANA_NAMES[karanaVal],
      startTime: karanaTrans.startTime,
      endTime: karanaTrans.endTime,
    },
    rashi: {
      name: 'Rashi',
      value: rashiVal,
      formatted: RASHI_NAMES[rashiVal],
      startTime: rashiTrans.startTime,
      endTime: rashiTrans.endTime,
    },
  };
}
