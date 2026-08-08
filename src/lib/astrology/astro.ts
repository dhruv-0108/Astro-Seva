import swisseph from './swisseph';

export interface PlanetPosition {
  name: string;
  longitude: number; // 0 to 360
  latitude: number;
  distance: number;
  speed: number;
  sign: number; // 0 to 11 (Aries to Pisces)
  degree: number; // 0 to 30 within the sign
  isRetrograde: boolean;
}

export interface AstrologicalData {
  jd: number;
  ayanamsa: number;
  planets: Record<string, PlanetPosition>;
  houses: number[]; // 12 house cusps (sidereal)
  ascendant: number; // sidereal ascendant
  mc: number; // sidereal midheaven
}

// Convert local date time components to UTC Julian Date
export function getJulianDate(
  year: number,
  month: number, // 1-indexed
  day: number,
  hour: number,
  minute: number,
  second: number,
  timezoneOffsetHours: number
): number {
  // Create a UTC timestamp assuming the local components are UTC
  const localUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
  // Subtract timezone offset to get the actual UTC time
  const actualUtcMs = localUtcMs - timezoneOffsetHours * 60 * 60 * 1000;
  const actualUtcDate = new Date(actualUtcMs);

  const y = actualUtcDate.getUTCFullYear();
  const m = actualUtcDate.getUTCMonth() + 1; // 1-indexed
  const d = actualUtcDate.getUTCDate();
  const h = actualUtcDate.getUTCHours() + actualUtcDate.getUTCMinutes() / 60 + actualUtcDate.getUTCSeconds() / 3600;

  return swisseph.swe_julday(y, m, d, h, swisseph.SE_GREG_CAL);
}

// Main calculator function
export function calculateAstrologicalData(
  year: number,
  month: number, // 1-indexed
  day: number,
  hour: number,
  minute: number,
  second: number,
  lat: number,
  lng: number,
  timezoneOffset: number
): AstrologicalData {
  const jd = getJulianDate(year, month, day, hour, minute, second, timezoneOffset);

  // Set sidereal mode to Lahiri
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  // Get Ayanamsa
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);

  // Calculate houses (Placidus system 'P')
  // geolat, geolon, hsys
  const houseResult = swisseph.swe_houses(jd, lat, lng, 'P');

  // Convert tropical house cusps to sidereal
  const siderealHouses = houseResult.house.map((h: number) => {
    let sid = h - ayanamsa;
    if (sid < 0) sid += 360;
    return sid;
  });

  let siderealAsc = houseResult.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;

  let siderealMc = houseResult.mc - ayanamsa;
  if (siderealMc < 0) siderealMc += 360;

  // Calculate planets
  const planetIds = {
    Sun: swisseph.SE_SUN,
    Moon: swisseph.SE_MOON,
    Mars: swisseph.SE_MARS,
    Mercury: swisseph.SE_MERCURY,
    Jupiter: swisseph.SE_JUPITER,
    Venus: swisseph.SE_VENUS,
    Saturn: swisseph.SE_SATURN,
    Rahu: swisseph.SE_MEAN_NODE, // Mean Node
  };

  const flag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;
  const planets: Record<string, PlanetPosition> = {};

  for (const [name, id] of Object.entries(planetIds)) {
    const res = swisseph.swe_calc_ut(jd, id, flag);
    
    let long = res.longitude;
    if (long < 0) long += 360;
    
    const sign = Math.floor(long / 30);
    const degree = long % 30;
    const isRetrograde = res.longitudeSpeed < 0;

    planets[name] = {
      name,
      longitude: long,
      latitude: res.latitude,
      distance: res.distance,
      speed: res.longitudeSpeed,
      sign,
      degree,
      isRetrograde,
    };
  }

  // Calculate Ketu (exactly 180 degrees from Rahu)
  const rahu = planets['Rahu'];
  let ketuLong = (rahu.longitude + 180) % 360;
  if (ketuLong < 0) ketuLong += 360;
  
  const ketuSign = Math.floor(ketuLong / 30);
  const ketuDegree = ketuLong % 30;

  planets['Ketu'] = {
    name: 'Ketu',
    longitude: ketuLong,
    latitude: -rahu.latitude, // opposite latitude
    distance: rahu.distance,
    speed: rahu.speed,
    sign: ketuSign,
    degree: ketuDegree,
    isRetrograde: rahu.isRetrograde,
  };

  return {
    jd,
    ayanamsa,
    planets,
    houses: siderealHouses,
    ascendant: siderealAsc,
    mc: siderealMc,
  };
}

export interface CurrentGocharPlanet {
  name: string;
  longitude: number;
  sign: number;
  degree: number;
  nakshatraIdx: number;
  pada: number;
  isRetrograde: boolean;
  transitHouseFromLagna: number;
  transitHouseFromMoon: number;
}

export interface CurrentGocharData {
  calculatedAt: string;
  jd: number;
  ayanamsa: number;
  planets: Record<string, CurrentGocharPlanet>;
}

export function calculateCurrentGochar(
  natalAscendant: number,
  natalMoonSign: number,
  currentDate: Date = new Date(),
  timezoneOffsetHours: number = 5.5
): CurrentGocharData {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1;
  const day = currentDate.getUTCDate();
  const hour = currentDate.getUTCHours() + currentDate.getUTCMinutes() / 60 + currentDate.getUTCSeconds() / 3600;

  const jd = swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);

  const planetIds = {
    Sun: swisseph.SE_SUN,
    Moon: swisseph.SE_MOON,
    Mars: swisseph.SE_MARS,
    Mercury: swisseph.SE_MERCURY,
    Jupiter: swisseph.SE_JUPITER,
    Venus: swisseph.SE_VENUS,
    Saturn: swisseph.SE_SATURN,
    Rahu: swisseph.SE_MEAN_NODE,
  };

  const flag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;
  const planets: Record<string, CurrentGocharPlanet> = {};
  const natalLagnaSign = Math.floor(natalAscendant / 30) % 12;

  for (const [name, id] of Object.entries(planetIds)) {
    const res = swisseph.swe_calc_ut(jd, id, flag);
    let long = res.longitude;
    if (long < 0) long += 360;

    const sign = Math.floor(long / 30) % 12;
    const degree = long % 30;
    const isRetrograde = res.longitudeSpeed < 0;

    const nakshatraIdx = Math.floor(long / (360 / 27)) % 27;
    const pada = Math.floor((long % (360 / 27)) / (360 / 108)) + 1;

    const transitHouseFromLagna = ((sign - natalLagnaSign + 12) % 12) + 1;
    const transitHouseFromMoon = ((sign - natalMoonSign + 12) % 12) + 1;

    planets[name] = {
      name,
      longitude: long,
      sign,
      degree,
      nakshatraIdx,
      pada,
      isRetrograde,
      transitHouseFromLagna,
      transitHouseFromMoon,
    };
  }

  // Calculate Ketu (180° from Rahu)
  const rahu = planets['Rahu'];
  let ketuLong = (rahu.longitude + 180) % 360;
  if (ketuLong < 0) ketuLong += 360;
  const ketuSign = Math.floor(ketuLong / 30) % 12;
  const ketuDegree = ketuLong % 30;
  const ketuNakshatraIdx = Math.floor(ketuLong / (360 / 27)) % 27;
  const ketuPada = Math.floor((ketuLong % (360 / 27)) / (360 / 108)) + 1;

  planets['Ketu'] = {
    name: 'Ketu',
    longitude: ketuLong,
    sign: ketuSign,
    degree: ketuDegree,
    nakshatraIdx: ketuNakshatraIdx,
    pada: ketuPada,
    isRetrograde: rahu.isRetrograde,
    transitHouseFromLagna: ((ketuSign - natalLagnaSign + 12) % 12) + 1,
    transitHouseFromMoon: ((ketuSign - natalMoonSign + 12) % 12) + 1,
  };

  return {
    calculatedAt: currentDate.toISOString(),
    jd,
    ayanamsa,
    planets,
  };
}

