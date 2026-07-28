const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const targetAsc = 210 + 22 + 5/60 + 11/3600; // Scorpio 22:05:11
console.log("Target Ascendant:", targetAsc);

const lat = 21.2;
const lng = 72.8333;

// Scan from Feb 1, 1974 12:00 UTC to Feb 2, 1974 12:00 UTC
for (let hUTC = 12; hUTC < 36; hUTC++) {
  let day = 1;
  let h = hUTC;
  if (h >= 24) {
    day = 2;
    h -= 24;
  }
  
  for (let m = 0; m < 60; m++) {
    const jd = swisseph.swe_julday(1974, 2, day, h + m/60, swisseph.SE_GREG_CAL);
    const houses = swisseph.swe_houses(jd, lat, lng, 'P');
    const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
    
    let siderealAsc = houses.ascendant - ayanamsa;
    if (siderealAsc < 0) siderealAsc += 360;
    
    if (Math.abs(siderealAsc - targetAsc) < 0.05) {
      let hourIST = h + m/60 + 5.5;
      let dayIST = day;
      if (hourIST >= 24) {
        hourIST -= 24;
        dayIST += 1;
      }
      const hh = Math.floor(hourIST);
      const mm = Math.floor((hourIST - hh) * 60);
      const ss = Math.floor((((hourIST - hh) * 60) - mm) * 60);
      console.log(`Match at UTC: Feb ${day} ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00 -> IST: Feb ${dayIST} ${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')} -> Asc: ${siderealAsc.toFixed(4)}`);
    }
  }
}
