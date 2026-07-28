import { load, Constants } from '@fusionstrings/swiss-eph';

let ephInstance: any = null;
let initPromise: Promise<any> | null = null;

export async function getSwisseph() {
  if (ephInstance) return wrapper;
  if (!initPromise) {
    initPromise = load().then((instance) => {
      ephInstance = instance;
      return wrapper;
    });
  }
  return initPromise;
}

// Synchronous wrapper functions that access the loaded instance
export const wrapper = {
  // Constants
  SE_GREG_CAL: Constants.SE_GREG_CAL,
  SE_SIDM_LAHIRI: Constants.SE_SIDM_LAHIRI,
  SE_SUN: Constants.SE_SUN,
  SE_MOON: Constants.SE_MOON,
  SE_MARS: Constants.SE_MARS,
  SE_MERCURY: Constants.SE_MERCURY,
  SE_JUPITER: Constants.SE_JUPITER,
  SE_VENUS: Constants.SE_VENUS,
  SE_SATURN: Constants.SE_SATURN,
  SE_MEAN_NODE: Constants.SE_MEAN_NODE,
  SEFLG_SIDEREAL: Constants.SEFLG_SIDEREAL,
  SEFLG_SPEED: Constants.SEFLG_SPEED,
  SE_TRUE_NODE: Constants.SE_TRUE_NODE,

  swe_julday(y: number, m: number, d: number, h: number, cal: number): number {
    if (!ephInstance) throw new Error("Swiss Ephemeris WASM not loaded. Call getSwisseph() first.");
    return ephInstance.swe_julday(y, m, d, h, cal);
  },

  swe_set_sid_mode(sid_mode: number, t0: number, ayan_t0: number): void {
    if (!ephInstance) throw new Error("Swiss Ephemeris WASM not loaded. Call getSwisseph() first.");
    ephInstance.swe_set_sid_mode(sid_mode, t0, ayan_t0);
  },

  swe_get_ayanamsa_ut(jd: number): number {
    if (!ephInstance) throw new Error("Swiss Ephemeris WASM not loaded. Call getSwisseph() first.");
    return ephInstance.swe_get_ayanamsa_ut(jd);
  },

  swe_houses(jd: number, lat: number, lng: number, hsys: string) {
    if (!ephInstance) throw new Error("Swiss Ephemeris WASM not loaded. Call getSwisseph() first.");
    const hsysCode = hsys.charCodeAt(0);
    const { cusps, ascmc } = ephInstance.swe_houses(jd, lat, lng, hsysCode);
    return {
      house: Array.from(cusps.slice(1, 13)) as number[], // convertFloat64Array to normal array
      ascendant: ascmc[0],
      mc: ascmc[1]
    };
  },

  swe_calc_ut(jd: number, id: number, flag: number) {
    if (!ephInstance) throw new Error("Swiss Ephemeris WASM not loaded. Call getSwisseph() first.");
    const { xx, error } = ephInstance.swe_calc_ut(jd, id, flag);
    if (error) {
      console.warn(`swe_calc_ut warning for id ${id}:`, error);
    }
    return {
      longitude: xx[0],
      latitude: xx[1],
      distance: xx[2],
      longitudeSpeed: xx[3],
      latitudeSpeed: xx[4],
      distanceSpeed: xx[5]
    };
  },

  swe_revjul(jd: number, cal: number) {
    if (!ephInstance) throw new Error("Swiss Ephemeris WASM not loaded. Call getSwisseph() first.");
    return ephInstance.swe_revjul(jd, cal);
  }
};

export default wrapper;
