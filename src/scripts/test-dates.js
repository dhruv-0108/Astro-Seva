const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const lat = 21.2;
const lng = 72.8333;

const dates = [
  { y: 1974, m: 2, d: 1, hIST: 4.366667, label: "Feb 1, 1974 04:22 AM" },
  { y: 1974, m: 2, d: 2, hIST: 4.366667, label: "Feb 2, 1974 04:22 AM" }
];

for (let item of dates) {
  let hourUTC = item.hIST - 5.5;
  let d = item.d;
  if (hourUTC < 0) {
    hourUTC += 24;
    d -= 1;
  }
  const jd = swisseph.swe_julday(item.y, item.m, d, hourUTC, swisseph.SE_GREG_CAL);
  const houses = swisseph.swe_houses(jd, lat, lng, 'P');
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
  let siderealAsc = houses.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;
  console.log(`${item.label} -> Sidereal Asc: ${siderealAsc.toFixed(4)} deg (Sagittarius ${ (siderealAsc - 240).toFixed(4) } deg)`);
}
