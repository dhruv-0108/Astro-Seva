const swisseph = require('swisseph');

const jd = swisseph.swe_julday(1974, 2, 1, 22.866667, swisseph.SE_GREG_CAL);
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

const flag = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;

console.log("Calling swe_calc_ut for Sun...");

try {
  // Let's see if it works synchronously
  const result = swisseph.swe_calc_ut(jd, swisseph.SE_SUN, flag);
  console.log("Sync result for Sun:", result);
} catch (err) {
  console.log("Sync call failed:", err.message);
}

// Let's see if it works with callback
swisseph.swe_calc_ut(jd, swisseph.SE_SUN, flag, function(err, result) {
  if (err) {
    console.error("Callback call failed:", err);
  } else {
    console.log("Callback result for Sun:", result);
  }
});
