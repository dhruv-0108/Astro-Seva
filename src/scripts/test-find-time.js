const swisseph = require('swisseph');

swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

console.log("Ascendant for Feb 2, 1974 in Surat (every 2 hours):");

for (let hourIST = 0; hourIST < 24; hourIST += 2) {
  // Convert IST to UTC decimal hours
  let hourUTC = hourIST - 5.5;
  let day = 2;
  if (hourUTC < 0) {
    hourUTC += 24;
    day = 1;
  }
  
  const jd = swisseph.swe_julday(1974, 2, day, hourUTC, swisseph.SE_GREG_CAL);
  const houses = swisseph.swe_houses(jd, 21.1702, 72.8311, 'P');
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
  
  // Calculate sidereal ascendant
  let siderealAsc = houses.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;
  
  const signNum = Math.floor(siderealAsc / 30);
  const deg = siderealAsc % 30;
  
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  console.log(`IST: ${hourIST.toString().padStart(2, '0')}:00 -> Sidereal Asc: ${siderealAsc.toFixed(2)} (${signs[signNum]} ${deg.toFixed(2)} deg)`);
}
