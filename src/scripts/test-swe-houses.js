const swisseph = require('swisseph');

const jd = swisseph.swe_julday(1974, 2, 1, 22.866667, swisseph.SE_GREG_CAL);

// Calculate Ayanamsa
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
console.log("Ayanamsa:", ayanamsa);

// Calculate houses (with sidereal mode set)
const resultSidereal = swisseph.swe_houses(jd, 21.1702, 72.8311, 'P');
console.log("Sidereal Ascendant (after setting sid_mode):", resultSidereal.ascendant);

// Set sidereal mode off (by setting it to a tropical mode or clearing, wait, let's see. In C we can just clear SEFLG_SIDEREAL, but for swe_houses, does it even look at sidmode?)
// Let's see: in Swiss Ephemeris, swe_houses does NOT subtract Ayanamsa automatically in standard C unless you use swe_houses_ex or subtract manually. Let's see if the value 268.10 is tropical or sidereal.
// Let's compute tropical ascendant manually or see.
// In C, tropical ascendant is computed by swe_houses.
// Let's calculate the difference if we subtract Ayanamsa:
// If 268.10 is tropical, then sidereal would be 268.10 - 23.495 = 244.605 (which is Sagittarius 4.6 deg).
// Wait, in our materials image 1, for Feb 2, 1974 at 04:22 AM in Surat:
// Ishtaghati = 52:40:30, Lagna = Meena (Pisces).
// Pisces is sign 11 (330 to 360 deg).
// But our result Sidereal Ascendant is 268.10 (Sagittarius).
// Why is there a difference?
// Let's check: the birth time is Feb 2, 1974 at 04:22 AM IST.
// In UTC, this is Feb 1, 1974 at 22:52:00 UTC (04:22 - 5:30).
// Wait! Let's double check if we calculated the Julian Date correctly.
// Let's write a script to check what is the Ascendant for this time.
// Let's print both tropical and see.
const resultTropical = swisseph.swe_houses_armc(jd, 21.1702, 72.8311, 'P'); // wait, let's see if swe_houses_armc exists or how we calculate it.
