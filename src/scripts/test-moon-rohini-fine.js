const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const flag = swisseph.SEFLG_SIDEREAL;

console.log("Moon position every 5 minutes around 04:20 AM IST:");
for (let min = 0; min <= 60; min += 5) {
  let hourIST = 4 + (20 + min)/60; // 04:20 to 05:20 IST
  let hourUTC = hourIST - 5.5;
  let d = 2;
  if (hourUTC < 0) {
    hourUTC += 24;
    d = 1;
  }
  
  const jd = swisseph.swe_julday(1974, 2, d, hourUTC, swisseph.SE_GREG_CAL);
  const res = swisseph.swe_calc_ut(jd, swisseph.SE_MOON, flag);
  let long = res.longitude;
  
  let deg = long % 30;
  console.log(`IST: 04:${(20 + min).toString().padStart(2, '0')} -> Moon: ${long.toFixed(5)} (Taurus ${deg.toFixed(5)})`);
}
