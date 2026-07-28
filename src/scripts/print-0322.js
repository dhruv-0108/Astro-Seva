const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const lat = 21.2;
const lng = 72.8333;

const check = (hIST) => {
  let hUTC = hIST - 5.5;
  let d = 2;
  if (hUTC < 0) {
    hUTC += 24;
    d = 1;
  }
  const jd = swisseph.swe_julday(1974, 2, d, hUTC, swisseph.SE_GREG_CAL);
  const houses = swisseph.swe_houses(jd, lat, lng, 'P');
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
  let siderealAsc = houses.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;
  console.log(`IST: ${hIST} -> Sidereal Asc: ${siderealAsc.toFixed(4)} (deg: ${ (siderealAsc % 30).toFixed(4) } in sign index ${Math.floor(siderealAsc/30)})`);
};

check(3.366667); // 03:22 AM
check(3.722222); // 03:43 AM (LMT)
check(4.366667); // 04:22 AM
