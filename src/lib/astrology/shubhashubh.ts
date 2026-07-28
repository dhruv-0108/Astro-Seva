// shubhashubh.ts: Calculates Mulank, Bhagyank, friendly/enemy numbers, and auspicious associations in Gujarati

export interface ShubhashubhData {
  mulank: number;
  bhagyank: number;
  friendlyNumbers: string;
  enemyNumbers: string;
  auspiciousYears: string;
  auspiciousDays: string;
  auspiciousPlanets: string;
  inauspiciousPlanets: string;
  friendlySigns: string;
  friendlyLagnas: string;
  gemstone: string;
  subGemstone: string;
  fortuneGemstone: string;
  deity: string;
  metal: string;
  color: string;
  direction: string;
  timeOfDay: string;
  offerings: string;
  food: string;
  liquid: string;
}

// Sum digits helper
function sumDigits(num: number): number {
  let sum = 0;
  while (num > 0 || sum > 9) {
    if (num === 0) {
      num = sum;
      sum = 0;
    }
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  return sum;
}

// Numerology table based on Mulank (1 to 9)
const NUMEROLOGY_MAP: Record<number, {
  friendly: string;
  enemy: string;
  years: string;
  days: string;
  planets: string;
  inauspicious: string;
}> = {
  1: { friendly: '2, 3, 9', enemy: '6, 8', years: '19, 28, 37, 46, 55, 64', days: 'રવિવાર, સોમવાર', planets: 'સૂર્ય, ચંદ્ર, ગુરુ', inauspicious: 'શુક્ર, શનિ' },
  2: { friendly: '1, 3, 7, 9', enemy: '5, 8', years: '20, 29, 38, 47, 56, 65', days: 'રવિવાર, ગુરુવાર, મંગળવાર', planets: 'સૂર્ય, ગુરુ, મંગળ', inauspicious: 'બુધ, શનિ' },
  3: { friendly: '1, 2, 9', enemy: '5, 6', years: '21, 30, 39, 48, 57, 66', days: 'ગુરુવાર, રવિવાર, મંગળવાર', planets: 'ગુરુ, સૂર્ય, મંગળ', inauspicious: 'બુધ, શુક્ર' },
  4: { friendly: '5, 6, 8', enemy: '1, 2, 9', years: '22, 31, 40, 49, 58, 67', days: 'શનિવાર, બુધવાર, શુક્રવાર', planets: 'રાહુ, શનિ, બુધ', inauspicious: 'સૂર્ય, ચંદ્ર, મંગળ' },
  5: { friendly: '1, 6, 8', enemy: '2', years: '23, 32, 41, 50, 59, 68', days: 'બુધવાર, શુક્રવાર', planets: 'બુધ, શુક્ર, સૂર્ય', inauspicious: 'ચંદ્ર' },
  6: { friendly: '5, 8, 9', enemy: '1, 2', years: '24, 33, 42, 51, 60, 69', days: 'શુક્રવાર, બુધવાર, શનિવાર', planets: 'શુક્ર, બુધ, શનિ', inauspicious: 'સૂર્ય, ચંદ્ર' },
  7: { friendly: '1, 3, 4, 9', enemy: '5, 6, 8', years: '25, 34, 43, 52, 61, 70', days: 'રવિવાર, સોમવાર, બુધવાર', planets: 'કેતુ, ચંદ્ર, સૂર્ય', inauspicious: 'બુધ, શુક્ર, શનિ' },
  8: { friendly: '5, 6, 7', enemy: '1, 2', years: '26, 35, 44, 53, 62, 71', days: 'શનિવાર, શુક્રવાર, બુધવાર', planets: 'શનિ, શુક્ર, બુધ', inauspicious: 'સૂર્ય, ચંદ્ર, મંગળ' },
  9: { friendly: '1, 2, 3', enemy: '5', years: '27, 36, 45, 54, 63, 72', days: 'મંગળવાર, રવિવાર, ગુરુવાર', planets: 'મંગળ, સૂર્ય, ગુરુ', inauspicious: 'બુધ' },
};

// Astrological recommendations based on Lagna (Ascendant) Sign (0=Aries, 1=Taurus, etc.)
const LAGNA_MAP: Record<number, {
  friendlySigns: string;
  friendlyLagnas: string;
  gemstone: string;
  subGemstone: string;
  fortuneGemstone: string;
  deity: string;
  metal: string;
  color: string;
  direction: string;
  timeOfDay: string;
  offerings: string;
  food: string;
  liquid: string;
}> = {
  0: { // Aries (Mesha)
    friendlySigns: 'સિંહ, ધનુ', friendlyLagnas: 'સિંહ, ધનુ, સૂર્ય',
    gemstone: 'મૂંગા (Coral)', subGemstone: 'લાલ અકીક', fortuneGemstone: 'માણેક (Ruby)',
    deity: 'હનુમાનજી / શિવ', metal: 'તાંબુ', color: 'લાલ',
    direction: 'પૂર્વ', timeOfDay: 'સવાર', offerings: 'લાલ ફૂલ, કંકુ',
    food: 'મસૂર દાળ, ગુળ', liquid: 'મધ'
  },
  1: { // Taurus (Vrishabh)
    friendlySigns: 'કન્યા, મકર', friendlyLagnas: 'કન્યા, મકર, મિથુન',
    gemstone: 'હીરા (Diamond)', subGemstone: 'ઓપલ, સ્ફટિક', fortuneGemstone: 'પન્ના (Emerald)',
    deity: 'લક્ષ્મીજી / દુર્ગા', metal: 'ચાંદી / સોનું', color: 'સફેદ',
    direction: 'અગ્નિ (Southeast)', timeOfDay: 'સવાર', offerings: 'સફેદ ચંદન, ચોખા',
    food: 'ચોખાની ખીર', liquid: 'દૂધ'
  },
  2: { // Gemini (Mithuna)
    friendlySigns: 'તુલા, કુંભ', friendlyLagnas: 'તુલા, કુંભ, કન્યા',
    gemstone: 'પન્ના (Emerald)', subGemstone: 'લીલો બેરિલ', fortuneGemstone: 'હીરા (Diamond)',
    deity: 'ગણેશજી', metal: 'કાંસા', color: 'લીલો',
    direction: 'ઉત્તર', timeOfDay: 'બપોર', offerings: 'દુર્વા, મોદક',
    food: 'મગ, લીલા શાકભાજી', liquid: 'નારિયેળ પાણી'
  },
  3: { // Cancer (Karka)
    friendlySigns: 'વૃશ્ચિક, મીન', friendlyLagnas: 'વૃશ્ચિક, મીન, વૃષભ',
    gemstone: 'મોતી (Pearl)', subGemstone: 'ચંદ્રકાંત મણિ (Moonstone)', fortuneGemstone: 'મૂંગા (Coral)',
    deity: 'શિવજી / પાર્વતી', metal: 'ચાંદી', color: 'સફેદ / ક્રીમ',
    direction: 'વાયવ્ય (Northwest)', timeOfDay: 'સંધ્યા', offerings: 'સફેદ ફૂલ, ગંગાજળ',
    food: 'ચોખા, સાકર', liquid: 'દૂધ, પાણી'
  },
  4: { // Leo (Simha)
    friendlySigns: 'મેષ, ધનુ', friendlyLagnas: 'મેષ, ધનુ, મિથુન',
    gemstone: 'માણેક (Ruby)', subGemstone: 'લાલ ગાર્નેટ', fortuneGemstone: 'મૂંગા (Coral)',
    deity: 'સૂર્યનારાયણ / ગાયત્રી', metal: 'તાણું / સોનું', color: 'લાલ / કેસરી',
    direction: 'પૂર્વ', timeOfDay: 'સૂર્યોદય', offerings: 'લાલ કનેર ફૂલ, અક્ષત',
    food: 'ઘઉં, મધ', liquid: 'ગંગાજળ'
  },
  5: { // Virgo (Kanya)
    friendlySigns: 'મકર, વૃષભ', friendlyLagnas: 'મકર, વૃષભ, તુલા',
    gemstone: 'પન્ના (Emerald)', subGemstone: 'ગ્રીન જેડ', fortuneGemstone: 'હીરા (Diamond)',
    deity: 'ગણેશજી / વિષ્ણુ', metal: 'કાંસા', color: 'લીલો / પોપટી',
    direction: 'ઉત્તર', timeOfDay: 'બપોર', offerings: 'તુલસી પત્ર, પીળા ફૂલ',
    food: 'મગની દાળ', liquid: 'પાણી'
  },
  6: { // Libra (Tula)
    friendlySigns: 'કુંભ, મિથુન', friendlyLagnas: 'કુંભ, મિથુન, સિંહ',
    gemstone: 'હીરા (Diamond)', subGemstone: 'સફેદ પોખરાજ', fortuneGemstone: 'પન્ના (Emerald)',
    deity: 'લક્ષ્મીજી', metal: 'પ્લેટિનમ / ચાંદી', color: 'સફેદ / ગુલાબી',
    direction: 'પશ્ચિમ', timeOfDay: 'સંધ્યા', offerings: 'ઇતર, સફેદ ગુલાબ',
    food: 'ખાંડ, ચોખા', liquid: 'મધ-પાણી'
  },
  7: { // Scorpio (Vrishchika)
    friendlySigns: 'મીન, કર્ક', friendlyLagnas: 'મીન, મિથુન, સિંહ, તુલા, ધનુ',
    gemstone: 'પોખરાજ (Yellow Sapphire)', subGemstone: 'સુનહલા, સોનલ, કેસરી', fortuneGemstone: 'માણેક (Ruby)',
    deity: 'વિષ્ણુ', metal: 'કાંસા', color: 'પીત',
    direction: 'પૂર્વોત્તર (Northeast)', timeOfDay: 'સંધ્યા', offerings: 'સાકર, હળદર, પુસ્તક, પીતપુષ્પ',
    food: 'દાળ, ચણા', liquid: 'ઘી'
  },
  8: { // Sagittarius (Dhanu)
    friendlySigns: 'મેષ, સિંહ', friendlyLagnas: 'મેષ, સિંહ, મીન',
    gemstone: 'પોખરાજ (Yellow Sapphire)', subGemstone: 'પીળો હકીક', fortuneGemstone: 'મૂંગા (Coral)',
    deity: 'ગુરુ દત્તાત્રેય / વિષ્ણુ', metal: 'સોનું', color: 'પીળો / કેસરી',
    direction: 'ઈશાન (Northeast)', timeOfDay: 'બપોર', offerings: 'ચણાની દાળ, કેળા',
    food: 'બેસનના લાડુ, હળદરવાળી દાળ', liquid: 'દૂધ-કેસર'
  },
  9: { // Capricorn (Makara)
    friendlySigns: 'વૃષભ, કન્યા', friendlyLagnas: 'વૃષભ, કન્યા, વૃશ્ચિક',
    gemstone: 'નીલમ (Blue Sapphire)', subGemstone: 'લાજવર્ત (Lapis Lazuli)', fortuneGemstone: 'હીરા (Diamond)',
    deity: 'શનિદેવ / હનુમાનજી', metal: 'લોખંડ / સ્ટીલ', color: 'વાદળી / કાળો',
    direction: 'પશ્ચિમ', timeOfDay: 'રાત્રિ', offerings: 'કાળા તલ, તેલ',
    food: 'અડદની દાળ, સરસવ તેલ', liquid: 'સરસવ તેલ'
  },
  10: { // Aquarius (Kumbha)
    friendlySigns: 'મિથુન, તુલા', friendlyLagnas: 'મિથુન, તુલા, ધનુ',
    gemstone: 'નીલમ (Blue Sapphire)', subGemstone: 'જાંબલી અકીક (Amethyst)', fortuneGemstone: 'હીરા (Diamond)',
    deity: 'શિવજી / કાલી', metal: 'લોખંડ / સીસું', color: 'જાંબલી / કાળો',
    direction: 'પશ્ચિમ', timeOfDay: 'સંધ્યા', offerings: 'કાળી દ્રાક્ષ, તેલનો દીવો',
    food: 'કાળા અડદ, ખીચડી', liquid: 'તેલ'
  },
  11: { // Pisces (Meena)
    friendlySigns: 'કર્ક, વૃશ્ચિક', friendlyLagnas: 'કર્ક, વૃશ્ચિક, મેષ',
    gemstone: 'પોખરાજ (Yellow Sapphire)', subGemstone: 'પીળી કણિ', fortuneGemstone: 'મૂંગા (Coral)',
    deity: 'વિષ્ણુ / શિવ', metal: 'સોનું / તાણું', color: 'પીળો',
    direction: 'ઈશાન (Northeast)', timeOfDay: 'બપોર', offerings: 'હળદરનો ટીકો, ચંદન',
    food: 'ચણા દાળ ખીચડી', liquid: 'ઘી-દૂધ'
  }
};

export function calculateShubhashubh(
  date: Date,
  lagnaSign: number
): ShubhashubhData {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const mulank = sumDigits(day);
  const bhagyank = sumDigits(day + month + sumDigits(year));

  const numData = NUMEROLOGY_MAP[mulank] || NUMEROLOGY_MAP[1];
  const lagnaData = LAGNA_MAP[lagnaSign] || LAGNA_MAP[0];

  return {
    mulank,
    bhagyank,
    friendlyNumbers: numData.friendly,
    enemyNumbers: numData.enemy,
    auspiciousYears: numData.years,
    auspiciousDays: numData.days,
    auspiciousPlanets: numData.planets,
    inauspiciousPlanets: numData.inauspicious,
    ...lagnaData
  };
}
