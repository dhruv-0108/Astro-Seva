const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const lat = 21.2;
const lng = 72.8333;

console.log("Checking every minute from 03:20 to 03:40 AM IST on Feb 2, 1974:");

for (let m = 20; m <= 40; m++) {
  let hourIST = 3 + m/60;
  let hourUTC = hourIST - 5.5;
  let d = 2;
  if (hourUTC < 0) {
    hourUTC += 24;
    d = 1;
  }
  const jd = swisseph.swe_julday(1974, 2, d, hourUTC, swisseph.SE_GREG_CAL);
  const houses = swisseph.swe_houses(jd, lat, lng, 'P');
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
  let siderealAsc = houses.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;
  
  let deg = siderealAsc % 30;
  console.log(`IST: 03:${m.toString().padStart(2, '0')}:00 -> Sidereal Asc: ${siderealAsc.toFixed(4)} (Scorpio ${deg.toFixed(4)})`);
}
