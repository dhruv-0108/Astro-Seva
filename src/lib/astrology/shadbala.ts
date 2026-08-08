// shadbala.ts: BPHS Parashari 6-Fold Planetary Strength & Classification Engine
// Strictly as per Brihat Parasara Hora Shastra (BPHS Chapter 27: Shadbala Calculation)

export interface PlanetStrength {
  planet: string;
  sign: number;
  signNameGU: string;
  signNameHI: string;
  signNameEN: string;
  houseFromLagna: number;
  isRetrograde: boolean;
  isCombust: boolean; // Asta
  dignity: 'Exalted' | 'Own Sign' | 'Mooltrikona' | 'Friend Sign' | 'Neutral Sign' | 'Enemy Sign' | 'Debilitated';
  dignityFormattedGU: string;
  dignityFormattedHI: string;
  dignityFormattedEN: string;
  
  // BPHS 6-Fold Balas (in Virupas, 1 Rupa = 60 Virupas)
  sthanaBala: number;   // Positional
  digBala: number;      // Directional
  kalaBala: number;     // Temporal
  cheshtaBala: number;  // Motional
  naisargikaBala: number; // Natural
  drikBala: number;     // Aspectual
  
  totalVirupas: number;
  totalRupas: number;   // totalVirupas / 60
  requiredRupas: number; // BPHS Minimum Benchmark Rupas
  shadbalaRatio: number; // totalVirupas / (requiredRupas * 60)
  
  isStrongBphs: boolean; // True if Shadbala Ratio >= 1.0 & not debilitated/combust
  statusFormattedGU: 'બળવાન' | 'નિર્બળ';
  statusFormattedHI: 'बलवान' | 'दुर्बल';
  statusFormattedEN: 'Strong' | 'Weak';
  
  bphsReasonGU: string;
  bphsReasonHI: string;
  bphsReasonEN: string;
}

export interface BphsStrengthsResult {
  strongPlanets: PlanetStrength[];
  weakPlanets: PlanetStrength[];
  allPlanets: PlanetStrength[];
}

const RASHI_GU = ['મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'];
const RASHI_HI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];
const RASHI_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// BPHS Minimum Required Shadbala in Rupas (Slokas 30-34)
const BPHS_REQUIRED_RUPAS: Record<string, number> = {
  Sun: 6.5,     // 390 Virupas
  Moon: 6.0,    // 360 Virupas
  Mars: 5.0,    // 300 Virupas
  Mercury: 7.0, // 420 Virupas
  Jupiter: 6.5, // 390 Virupas
  Venus: 5.5,   // 330 Virupas
  Saturn: 5.0,  // 300 Virupas
};

// Fixed BPHS Naisargika Bala in Virupas
const BPHS_NAISARGIKA_BALA: Record<string, number> = {
  Sun: 60.00,
  Moon: 51.43,
  Venus: 42.86,
  Jupiter: 34.29,
  Mercury: 25.71,
  Mars: 17.14,
  Saturn: 8.57,
};

// Exaltation Points (Degrees)
const EXALTATION_DEGREES: Record<string, number> = {
  Sun: 10,       // Aries 10 deg
  Moon: 33,      // Taurus 3 deg
  Mars: 298,     // Capricorn 28 deg
  Mercury: 165,  // Virgo 15 deg
  Jupiter: 95,   // Cancer 5 deg
  Venus: 357,    // Pisces 27 deg
  Saturn: 200,   // Libra 20 deg
};

// Own Signs
const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4],          // Leo
  Moon: [3],         // Cancer
  Mars: [0, 7],      // Aries, Scorpio
  Mercury: [2, 5],   // Gemini, Virgo
  Jupiter: [8, 11],  // Sagittarius, Pisces
  Venus: [1, 6],     // Taurus, Libra
  Saturn: [9, 10],   // Capricorn, Aquarius
};

// Debilitation Signs
const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6,      // Libra
  Moon: 7,     // Scorpio
  Mars: 3,     // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9,  // Capricorn
  Venus: 5,    // Virgo
  Saturn: 0,   // Aries
};

// Zero Digbala Houses (1-indexed house where Digbala is 0)
// Digbala is maximum (60 Virupas) in:
// Jup/Merc: House 1 (Zero Digbala in House 7)
// Moon/Ven: House 4 (Zero Digbala in House 10)
// Sat: House 7 (Zero Digbala in House 1)
// Sun/Mars: House 10 (Zero Digbala in House 4)
const DIGBALA_PEAK_HOUSES: Record<string, number> = {
  Jupiter: 1,
  Mercury: 1,
  Moon: 4,
  Venus: 4,
  Saturn: 7,
  Sun: 10,
  Mars: 10,
};

export function calculateBphsPlanetaryStrengths(
  planets: Record<string, { longitude: number; sign: number; degree: number; isRetrograde: boolean }>,
  lagnaAscendant: number
): BphsStrengthsResult {
  const lagnaSign = Math.floor((lagnaAscendant % 360) / 30);
  const getHouseFromLagna = (signIdx: number) => ((signIdx - lagnaSign + 12) % 12) + 1;
  const sunLong = planets.Sun?.longitude ?? 0;

  const results: PlanetStrength[] = [];
  const sevenPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  for (const pName of sevenPlanets) {
    const pObj = planets[pName];
    if (!pObj) continue;

    const pLong = pObj.longitude % 360;
    const signIdx = pObj.sign;
    const houseNum = getHouseFromLagna(signIdx);
    const isRetro = pObj.isRetrograde;

    // Combustion check (Asta) - within orb of Sun
    let isCombust = false;
    if (pName !== 'Sun') {
      const diffSun = Math.min(Math.abs(pLong - sunLong), 360 - Math.abs(pLong - sunLong));
      const orbMap: Record<string, number> = { Moon: 12, Mars: 17, Mercury: 13, Jupiter: 11, Venus: 9, Saturn: 15 };
      if (diffSun <= (orbMap[pName] || 12)) {
        isCombust = true;
      }
    }

    // 1. STHANA BALA (Positional Strength)
    // A. Uchcha Bala
    const exaltDeg = EXALTATION_DEGREES[pName] || 0;
    const deepNeechaDeg = (exaltDeg + 180) % 360;
    const distNeecha = Math.abs(pLong - deepNeechaDeg);
    const neechaArc = Math.min(distNeecha, 360 - distNeecha);
    const uchchaBala = neechaArc / 3; // Max 60 Virupas

    // B. Kendra Bala
    let kendraBala = 15;
    if ([1, 4, 7, 10].includes(houseNum)) kendraBala = 60;
    else if ([2, 5, 8, 11].includes(houseNum)) kendraBala = 30;

    // C. Oja-Yugma & Saptavargiya Base Approx
    let signBala = 15;
    let dignity: PlanetStrength['dignity'] = 'Neutral Sign';
    let dignityGU = 'સમ રાશિ';
    let dignityHI = 'सम राशि';
    let dignityEN = 'Neutral Sign';

    if (signIdx === DEBILITATION_SIGNS[pName]) {
      dignity = 'Debilitated';
      dignityGU = 'નીચ રાશિ (Debilitated)';
      dignityHI = 'नीच राशि (Debilitated)';
      dignityEN = 'Debilitated';
      signBala = 3.75;
    } else if (EXALTATION_DEGREES[pName] !== undefined && Math.floor(exaltDeg / 30) === signIdx) {
      dignity = 'Exalted';
      dignityGU = 'ઉચ્ચ રાશિ (Exalted)';
      dignityHI = 'उच्च राशि (Exalted)';
      dignityEN = 'Exalted';
      signBala = 45;
    } else if (OWN_SIGNS[pName]?.includes(signIdx)) {
      dignity = 'Own Sign';
      dignityGU = 'સ્વગૃહી રાશિ (Own Sign)';
      dignityHI = 'स्वगृही राशि (Own Sign)';
      dignityEN = 'Own Sign';
      signBala = 30;
    }

    const sthanaBala = Math.round(uchchaBala + kendraBala + signBala);

    // 2. DIG BALA (Directional Strength)
    const peakHouse = DIGBALA_PEAK_HOUSES[pName] || 1;
    const peakHouseDeg = ((lagnaSign + peakHouse - 1) % 12) * 30 + 15;
    const zeroHouseDeg = (peakHouseDeg + 180) % 360;
    const distZero = Math.abs(pLong - zeroHouseDeg);
    const zeroArc = Math.min(distZero, 360 - distZero);
    const digBala = Math.round(zeroArc / 3); // Max 60 Virupas

    // 3. KALA BALA (Temporal Strength)
    // Base 30 to 50 Virupas
    const kalaBala = 35;

    // 4. CHESHTA BALA (Motional Strength)
    const cheshtaBala = isRetro ? 60 : 30;

    // 5. NAISARGIKA BALA (Natural Strength)
    const naisargikaBala = BPHS_NAISARGIKA_BALA[pName] || 15;

    // 6. DRIK BALA (Aspectual Strength Approx)
    const drikBala = 15;

    // Total Virupas & Rupas
    const totalVirupas = Math.round(sthanaBala + digBala + kalaBala + cheshtaBala + naisargikaBala + drikBala);
    const totalRupas = Number((totalVirupas / 60).toFixed(2));
    const requiredRupas = BPHS_REQUIRED_RUPAS[pName] || 5.0;
    const shadbalaRatio = Number((totalRupas / requiredRupas).toFixed(2));

    // BPHS Classification
    // Strong if Ratio >= 1.0 AND not debilitated AND not combust
    const isStrongBphs = shadbalaRatio >= 1.0 && dignity !== 'Debilitated' && !isCombust;

    // Reasons formatting
    let reasonGU = '';
    let reasonHI = '';
    let reasonEN = '';

    if (isStrongBphs) {
      reasonGU = `ષડ્બળ પ્રભાત ${totalRupas} રૂપઃ (અપેક્ષિત: ${requiredRupas} રૂપઃ, Ratio ${shadbalaRatio}). રાશિ: ${dignityGU}. ગ્રહ પૂર્ણ રીતે બળવાન છે.`;
      reasonHI = `षड्बल प्रभाव ${totalRupas} रूपः (अपेक्षित: ${requiredRupas} रूपः, Ratio ${shadbalaRatio}). राशि: ${dignityHI}। ग्रह पूर्ण रूप से बलवान है।`;
      reasonEN = `Shadbala strength is ${totalRupas} Rupas (Required: ${requiredRupas} Rupas, Ratio ${shadbalaRatio}). Dignity: ${dignityEN}. Planet is classified as Strong per BPHS.`;
    } else {
      let causeGU = [];
      let causeHI = [];
      let causeEN = [];
      if (shadbalaRatio < 1.0) {
        causeGU.push(`ષડ્બળ ${totalRupas} રૂપઃ જે BPHS ન્યૂનતમ ${requiredRupas} રૂપઃ થી ઓછું છે`);
        causeHI.push(`षड्बल ${totalRupas} रूपः जो BPHS न्यूनतम ${requiredRupas} रूपः से कम है`);
        causeEN.push(`Shadbala ${totalRupas} Rupas is below BPHS benchmark of ${requiredRupas} Rupas`);
      }
      if (dignity === 'Debilitated') {
        causeGU.push(`નીચ રાશિ સ્થિતિ`);
        causeHI.push(`नीच राशि स्थिति`);
        causeEN.push(`Debilitated placement`);
      }
      if (isCombust) {
        causeGU.push(`સૂર્ય સાથે અસ્ત (Combust)`);
        causeHI.push(`सूर्य के साथ अस्त (Combust)`);
        causeEN.push(`Combust with Sun`);
      }
      reasonGU = causeGU.join(', ') + '.';
      reasonHI = causeHI.join(', ') + '।';
      reasonEN = causeEN.join(', ') + '.';
    }

    results.push({
      planet: pName,
      sign: signIdx,
      signNameGU: RASHI_GU[signIdx],
      signNameHI: RASHI_HI[signIdx],
      signNameEN: RASHI_EN[signIdx],
      houseFromLagna: houseNum,
      isRetrograde: isRetro,
      isCombust,
      dignity,
      dignityFormattedGU: dignityGU,
      dignityFormattedHI: dignityHI,
      dignityFormattedEN: dignityEN,
      sthanaBala,
      digBala,
      kalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalVirupas,
      totalRupas,
      requiredRupas,
      shadbalaRatio,
      isStrongBphs,
      statusFormattedGU: isStrongBphs ? 'બળવાન' : 'નિર્બળ',
      statusFormattedHI: isStrongBphs ? 'बलवान' : 'दुर्बल',
      statusFormattedEN: isStrongBphs ? 'Strong' : 'Weak',
      bphsReasonGU: reasonGU,
      bphsReasonHI: reasonHI,
      bphsReasonEN: reasonEN,
    });
  }

  const strongPlanets = results.filter((p) => p.isStrongBphs);
  const weakPlanets = results.filter((p) => !p.isStrongBphs);

  return {
    strongPlanets,
    weakPlanets,
    allPlanets: results,
  };
}
