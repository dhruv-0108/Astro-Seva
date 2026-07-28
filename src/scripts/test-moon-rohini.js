const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const flag = swisseph.SEFLG_SIDEREAL;

for (let min = 0; min < 1440; min += 5) {
  let hourUTC = min / 60;
  const jd = swisseph.swe_julday(1974, 2, 2, hourUTC, swisseph.SE_GREG_CAL);
  const res = swisseph.swe_calc_ut(jd, swisseph.SE_MOON, flag);
  let long = res.longitude;
  
  let hourIST = hourUTC + 5.5;
  const h = Math.floor(hourIST);
  const m = Math.floor((hourIST - h) * 60);
  
  if (long >= 39.9 && long <= 40.2) {
    console.log(`IST: ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} -> Moon Longitude: ${long.toFixed(4)} deg (Taurus ${(long - 30).toFixed(4)} deg)`);
  }
}
