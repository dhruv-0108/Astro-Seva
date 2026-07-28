import { calculateAstrologicalData } from '../lib/astrology/astro';
import { calculateAllVargas } from '../lib/astrology/vargas';
import { calculateVimshottari } from '../lib/astrology/dashas';
import { calculatePanchanga } from '../lib/astrology/panchanga';
import { calculateSaturnTransits } from '../lib/astrology/transits';
import { calculateShubhashubh } from '../lib/astrology/shubhashubh';

// Test case details: Feb 2, 1974 at 04:22:00 AM IST in Surat, Gujarat
const year = 1974;
const month = 2; // 1-indexed (Feb)
const day = 2;
const hour = 4;
const min = 22;
const sec = 0;
const lat = 21.1702;
const lng = 72.8311;
const tzOffset = 5.5; // IST

console.log("====================================================");
console.log("           ASTRO-SEVA ENGINE TEST RUN               ");
console.log("====================================================");

// 1. Core calculation
const astro = calculateAstrologicalData(year, month, day, hour, min, sec, lat, lng, tzOffset);
const birthDate = new Date(year, month - 1, day, hour, min, sec);
console.log("\n1. Core Details:");
console.log(`Julian Date : ${astro.jd}`);
console.log(`Ayanamsa    : ${astro.ayanamsa.toFixed(6)} degrees`);
console.log(`Ascendant   : ${astro.ascendant.toFixed(4)} deg (sign ${Math.floor(astro.ascendant/30)})`);

// 2. Planet positions
console.log("\n2. Nirayana Planet Placements:");
const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
for (const [name, p] of Object.entries(astro.planets)) {
  console.log(`- ${name.padEnd(8)}: ${signs[p.sign]} ${p.degree.toFixed(2)} deg ${p.isRetrograde ? '(R)' : ''}`);
}

// 3. Vargas (D1, D9, D10, D60)
console.log("\n3. Vargas (Divisional Charts) for Sun & Moon:");
const sunVargas = calculateAllVargas(astro.planets.Sun.longitude);
const moonVargas = calculateAllVargas(astro.planets.Moon.longitude);
console.log(`Sun  - D1: ${signs[sunVargas.D1]}, D9: ${signs[sunVargas.D9]}, D10: ${signs[sunVargas.D10]}, D60: ${signs[sunVargas.D60]}`);
console.log(`Moon - D1: ${signs[moonVargas.D1]}, D9: ${signs[moonVargas.D9]}, D10: ${signs[moonVargas.D10]}, D60: ${signs[moonVargas.D60]}`);

// 4. Panchanga
console.log("\n4. Active Panchanga and Transition Timings:");
const panchanga = calculatePanchanga(astro.jd, tzOffset);
const formatTime = (d: Date) => d.toLocaleString('en-IN');
console.log(`- Tithi    : ${panchanga.tithi.formatted} (Started: ${formatTime(panchanga.tithi.startTime)} -> Ends: ${formatTime(panchanga.tithi.endTime)})`);
console.log(`- Nakshatra: ${panchanga.nakshatra.formatted} (Started: ${formatTime(panchanga.nakshatra.startTime)} -> Ends: ${formatTime(panchanga.nakshatra.endTime)})`);
console.log(`- Yoga     : ${panchanga.yoga.formatted} (Started: ${formatTime(panchanga.yoga.startTime)} -> Ends: ${formatTime(panchanga.yoga.endTime)})`);
console.log(`- Karana   : ${panchanga.karana.formatted} (Started: ${formatTime(panchanga.karana.startTime)} -> Ends: ${formatTime(panchanga.karana.endTime)})`);

// 5. Vimshottari Dasha
console.log("\n5. Vimshottari Dasha:");
const dasha = calculateVimshottari(astro.planets.Moon.longitude, birthDate);
console.log(`- Bhogya Dasha at birth: ${dasha.bhogyaDasha.lord} Dasha (${dasha.bhogyaDasha.formatted})`);
console.log("- Mahadasha sequence (first 3):");
dasha.mahadashas.slice(0, 3).forEach((md, idx) => {
  console.log(`  ${idx + 1}. ${md.lord.padEnd(8)}: ${formatTime(md.startDate)} to ${formatTime(md.endDate)}`);
});

// 6. Saturn transits
console.log("\n6. Saturn Sadesati / Dhaiya transits (first 3):");
const transits = calculateSaturnTransits(astro.jd, astro.planets.Moon.sign, tzOffset);
transits.slice(0, 3).forEach((t, idx) => {
  console.log(`  ${idx + 1}. ${t.type.padEnd(10)} in ${t.saturnSignFormatted.padEnd(8)}: ${formatTime(t.startDate)} to ${formatTime(t.endDate)} (Paya: ${t.paya})`);
});

// 7. Shubhashubh table
console.log("\n7. Shubhashubh Guidance (Numerology & Lagna):");
const shubha = calculateShubhashubh(birthDate, Math.floor(astro.ascendant/30));
console.log(`- Mulank: ${shubha.mulank}, Bhagyank: ${shubha.bhagyank}`);
console.log(`- Deity : ${shubha.deity}`);
console.log(`- Gemstone: ${shubha.gemstone} (Sub: ${shubha.subGemstone})`);
console.log(`- Auspicious Color: ${shubha.color}`);
console.log(`- Food  : ${shubha.food}`);
console.log("====================================================");
