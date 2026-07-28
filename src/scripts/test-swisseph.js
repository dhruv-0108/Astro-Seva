const swisseph = require('swisseph');

console.log("Swiss Ephemeris loaded successfully!");
console.log("Available swisseph functions:", Object.keys(swisseph).filter(k => typeof swisseph[k] === 'function').slice(0, 10));

// Test Julian Date calculation
// swe_julday(year, month, day, hour, gregflag)
const year = 1974;
const month = 2;
const day = 2;
const hour = 4.366667; // 4h 22m in decimal hours (in UTC: 4:22 AM IST = Oct 1, wait, IST is UTC + 5:30)
// For Feb 2, 1974 at 04:22:00 AM IST:
// UTC = 04:22 - 5:30 = Feb 1, 1974 at 22:52:00
const jd = swisseph.swe_julday(1974, 2, 1, 22.866667, swisseph.SE_GREG_CAL);
console.log("Julian Date for Feb 1, 1974 22:52:00 UTC:", jd);

// Set Ayanamsa: Lahiri is SE_SIDM_LAHIRI
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

// Get Ayanamsa value
const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
console.log("Ayanamsa value (degrees):", ayanamsa);
console.log("Ayanamsa formatted:", Math.floor(ayanamsa), "deg", Math.floor((ayanamsa % 1) * 60), "min", Math.floor((((ayanamsa % 1) * 60) % 1) * 60), "sec");
