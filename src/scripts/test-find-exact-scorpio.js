const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const targetAsc = 210 + 22 + 5/60 + 11/3600; // Scorpio 22:05:11
console.log("Target Ascendant:", targetAsc);

const lat = 21.2;
const lng = 72.8333;

for (let min = 0; min < 1440; min++) {
  let hourUTC = min / 60;
  const jd = swisseph.swe_julday(1974, 2, 2, hourUTC, swisseph.SE_GREG_CAL);
  const houses = swisseph.swe_houses(jd, lat, lng, 'P');
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
  
  let siderealAsc = houses.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;
  
  if (Math.abs(siderealAsc - targetAsc) < 0.05) {
    let hourIST = hourUTC + 5.5;
    let dayIST = 2;
    if (hourIST >= 24) {
      hourIST -= 24;
      dayIST = 3;
    }
    const h = Math.floor(hourIST);
    const m = Math.floor((hourIST - h) * 60);
    const s = Math.floor((((hourIST - h) * 60) - m) * 60);
    console.log(`Match at UTC: ${hourUTC.toFixed(4)} (IST: Feb ${dayIST} ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}) -> Asc: ${siderealAsc.toFixed(4)}`);
  }
}
