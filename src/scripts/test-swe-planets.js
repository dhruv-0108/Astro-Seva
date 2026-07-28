const swisseph = require('swisseph');

const jd = swisseph.swe_julday(1974, 2, 1, 22.866667, swisseph.SE_GREG_CAL);
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const flag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;

const planets = {
  Sun: swisseph.SE_SUN,
  Moon: swisseph.SE_MOON,
  Mars: swisseph.SE_MARS,
  Mercury: swisseph.SE_MERCURY,
  Jupiter: swisseph.SE_JUPITER,
  Venus: swisseph.SE_VENUS,
  Saturn: swisseph.SE_SATURN,
  Rahu: swisseph.SE_MEAN_NODE,
};

const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

console.log("Calculated Nirayana Planet Positions:");
for (let name in planets) {
  const res = swisseph.swe_calc_ut(jd, planets[name], flag);
  let long = res.longitude;
  let signIdx = Math.floor(long / 30);
  let deg = long % 30;
  console.log(`${name.padEnd(8)}: ${long.toFixed(2)} deg -> ${signs[signIdx]} ${deg.toFixed(2)} deg`);
}

// Calculate Ketu (exactly 180 degrees opposite to Rahu)
const rahuRes = swisseph.swe_calc_ut(jd, swisseph.SE_MEAN_NODE, flag);
let ketuLong = (rahuRes.longitude + 180) % 360;
let ketuSignIdx = Math.floor(ketuLong / 30);
let ketuDeg = ketuLong % 30;
console.log(`Ketu    : ${ketuLong.toFixed(2)} deg -> ${signs[ketuSignIdx]} ${ketuDeg.toFixed(2)} deg`);
