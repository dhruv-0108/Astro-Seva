// dashas.ts: Vimshottari Dasha calculations based on Moon's Nirayana Longitude

export interface DashaPeriod {
  lord: string;
  startDate: Date;
  endDate: Date;
}

export interface AntardashaPeriod extends DashaPeriod {
  pratyantardashas: DashaPeriod[];
}

export interface MahadashaPeriod extends DashaPeriod {
  antardashas: AntardashaPeriod[];
}

export const PLANET_ORDER = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury',
];

export const PLANET_SPANS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

// Total span of Vimshottari Dasha is 120 years
const TOTAL_SPAN = 120;

// Helper to add years/months/days to Date
export function addYears(date: Date, yearsDecimal: number): Date {
  const result = new Date(date.getTime());
  // Express in milliseconds: 1 year = 365.25 days
  const msInYear = 365.25 * 24 * 60 * 60 * 1000;
  result.setTime(result.getTime() + yearsDecimal * msInYear);
  return result;
}

export function calculateVimshottari(
  moonLong: number,
  birthDate: Date
): {
  bhogyaDasha: { lord: string; yearsRemaining: number; formatted: string };
  mahadashas: MahadashaPeriod[];
} {
  const rawLong = moonLong % 360;
  const nakshatraLength = 360 / 27; // 13.333333 degrees
  const nakshatraIdx = Math.floor(rawLong / nakshatraLength);
  const traversed = rawLong % nakshatraLength;
  const traversedFraction = traversed / nakshatraLength;
  const bhogyaFraction = 1 - traversedFraction; // remaining fraction

  const startingLordIdx = nakshatraIdx % 9;
  const startingLord = PLANET_ORDER[startingLordIdx];
  const startingSpan = PLANET_SPANS[startingLord];
  const yearsRemaining = bhogyaFraction * startingSpan;

  // Format bhogya dasha
  const bYears = Math.floor(yearsRemaining);
  const bMonthsFloat = (yearsRemaining - bYears) * 12;
  const bMonths = Math.floor(bMonthsFloat);
  const bDays = Math.floor((bMonthsFloat - bMonths) * 30);
  const bhogyaFormatted = `${bYears} વર્ષ, ${bMonths} માસ, ${bDays} દિવસ`;

  const mahadashas: MahadashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());

  // We will generate dashas for a total of 120 years starting from birth
  let lordIdx = startingLordIdx;
  let remainingFraction = bhogyaFraction;

  for (let i = 0; i < 9; i++) {
    const lord = PLANET_ORDER[lordIdx];
    const span = PLANET_SPANS[lord];
    
    // For the very first dasha, we only use the remaining years (bhogya)
    const currentSpanYears = i === 0 ? yearsRemaining : span;
    const startDate = new Date(currentDate.getTime());
    const endDate = addYears(startDate, currentSpanYears);

    // Calculate Antardashas (AD)
    const antardashas: AntardashaPeriod[] = [];
    let adCurrentDate = new Date(startDate.getTime());
    
    // Antardashas start with the lord of MD itself and follow the order
    let adLordIdx = lordIdx;
    for (let j = 0; j < 9; j++) {
      const adLord = PLANET_ORDER[adLordIdx];
      const adSpan = PLANET_SPANS[adLord];
      
      // Proportional AD years in the MD
      // If it is the first MD, the ADs are also proportionately reduced by the bhogya fraction
      const adFraction = adSpan / TOTAL_SPAN;
      const adYearsValue = currentSpanYears * (adSpan / span) * (i === 0 ? 1 : 1) * adFraction;
      
      // Wait, standard AD duration = MD_duration * (adSpan / 120)
      const standardAdYears = currentSpanYears * (adSpan / TOTAL_SPAN);
      
      const adStartDate = new Date(adCurrentDate.getTime());
      const adEndDate = addYears(adStartDate, standardAdYears);

      // Calculate Pratyantardashas (PD)
      const pratyantardashas: DashaPeriod[] = [];
      let pdCurrentDate = new Date(adStartDate.getTime());
      let pdLordIdx = adLordIdx;

      for (let k = 0; k < 9; k++) {
        const pdLord = PLANET_ORDER[pdLordIdx];
        const pdSpan = PLANET_SPANS[pdLord];
        
        // Standard PD duration = AD_duration * (pdSpan / 120)
        const standardPdYears = standardAdYears * (pdSpan / TOTAL_SPAN);
        
        const pdStartDate = new Date(pdCurrentDate.getTime());
        const pdEndDate = addYears(pdStartDate, standardPdYears);

        pratyantardashas.push({
          lord: pdLord,
          startDate: pdStartDate,
          endDate: pdEndDate,
        });

        pdCurrentDate = new Date(pdEndDate.getTime());
        pdLordIdx = (pdLordIdx + 1) % 9;
      }

      antardashas.push({
        lord: adLord,
        startDate: adStartDate,
        endDate: adEndDate,
        pratyantardashas,
      });

      adCurrentDate = new Date(adEndDate.getTime());
      adLordIdx = (adLordIdx + 1) % 9;
    }

    mahadashas.push({
      lord,
      startDate,
      endDate,
      antardashas,
    });

    currentDate = new Date(endDate.getTime());
    lordIdx = (lordIdx + 1) % 9;
  }

  return {
    bhogyaDasha: {
      lord: startingLord,
      yearsRemaining,
      formatted: bhogyaFormatted,
    },
    mahadashas,
  };
}

export function calculateSookshmadashas(
  pdStartDate: Date,
  pdEndDate: Date,
  pdLord: string
): DashaPeriod[] {
  const pdSpanMs = pdEndDate.getTime() - pdStartDate.getTime();
  const pdLordIdx = PLANET_ORDER.indexOf(pdLord);
  const result: DashaPeriod[] = [];
  let currentMs = pdStartDate.getTime();

  for (let s = 0; s < 9; s++) {
    const sdLord = PLANET_ORDER[(pdLordIdx + s) % 9];
    const sdSpanMs = pdSpanMs * (PLANET_SPANS[sdLord] / TOTAL_SPAN);
    const startMs = currentMs;
    const endMs = startMs + sdSpanMs;

    result.push({
      lord: sdLord,
      startDate: new Date(startMs),
      endDate: new Date(endMs),
    });

    currentMs = endMs;
  }

  return result;
}

export function calculatePranadashas(
  sdStartDate: Date,
  sdEndDate: Date,
  sdLord: string
): DashaPeriod[] {
  const sdSpanMs = sdEndDate.getTime() - sdStartDate.getTime();
  const sdLordIdx = PLANET_ORDER.indexOf(sdLord);
  const result: DashaPeriod[] = [];
  let currentMs = sdStartDate.getTime();

  for (let p = 0; p < 9; p++) {
    const prLord = PLANET_ORDER[(sdLordIdx + p) % 9];
    const prSpanMs = sdSpanMs * (PLANET_SPANS[prLord] / TOTAL_SPAN);
    const startMs = currentMs;
    const endMs = startMs + prSpanMs;

    result.push({
      lord: prLord,
      startDate: new Date(startMs),
      endDate: new Date(endMs),
    });

    currentMs = endMs;
  }

  return result;
}

export interface ActiveDashaChain {
  mahadasha: { lord: string; startDate: Date; endDate: Date };
  antardasha: { lord: string; startDate: Date; endDate: Date };
  pratyantardasha: { lord: string; startDate: Date; endDate: Date };
  sookshmadasha: { lord: string; startDate: Date; endDate: Date };
  prandasha: { lord: string; startDate: Date; endDate: Date };
}

export function getCurrentDashaChain(
  moonLong: number,
  birthDate: Date,
  targetDate: Date = new Date()
): ActiveDashaChain | null {
  const { mahadashas } = calculateVimshottari(moonLong, birthDate);
  const targetMs = targetDate.getTime();

  // 1. Find active Mahadasha
  const activeMd = mahadashas.find(
    (md) => targetMs >= md.startDate.getTime() && targetMs <= md.endDate.getTime()
  );
  if (!activeMd) return null;

  // 2. Find active Antardasha
  const activeAd = activeMd.antardashas.find(
    (ad) => targetMs >= ad.startDate.getTime() && targetMs <= ad.endDate.getTime()
  );
  if (!activeAd) return null;

  // 3. Find active Pratyantardasha
  const activePd = activeAd.pratyantardashas.find(
    (pd) => targetMs >= pd.startDate.getTime() && targetMs <= pd.endDate.getTime()
  );
  if (!activePd) return null;

  // 4. Calculate Sookshmadashas within active PD
  const pdSpanMs = activePd.endDate.getTime() - activePd.startDate.getTime();
  const pdLordIdx = PLANET_ORDER.indexOf(activePd.lord);
  let sdCurrentMs = activePd.startDate.getTime();
  let activeSd: { lord: string; startDate: Date; endDate: Date } | null = null;
  let activeSdIdx = pdLordIdx;

  for (let s = 0; s < 9; s++) {
    const sdLord = PLANET_ORDER[(pdLordIdx + s) % 9];
    const sdSpanMs = pdSpanMs * (PLANET_SPANS[sdLord] / TOTAL_SPAN);
    const sdStartMs = sdCurrentMs;
    const sdEndMs = sdStartMs + sdSpanMs;

    if (targetMs >= sdStartMs && targetMs <= sdEndMs) {
      activeSd = {
        lord: sdLord,
        startDate: new Date(sdStartMs),
        endDate: new Date(sdEndMs),
      };
      activeSdIdx = (pdLordIdx + s) % 9;
      break;
    }
    sdCurrentMs = sdEndMs;
  }
  if (!activeSd) return null;

  // 5. Calculate Prandashas within active SD
  const sdSpanMs = activeSd.endDate.getTime() - activeSd.startDate.getTime();
  let prCurrentMs = activeSd.startDate.getTime();
  let activePr: { lord: string; startDate: Date; endDate: Date } | null = null;

  for (let p = 0; p < 9; p++) {
    const prLord = PLANET_ORDER[(activeSdIdx + p) % 9];
    const prSpanMs = sdSpanMs * (PLANET_SPANS[prLord] / TOTAL_SPAN);
    const prStartMs = prCurrentMs;
    const prEndMs = prStartMs + prSpanMs;

    if (targetMs >= prStartMs && targetMs <= prEndMs) {
      activePr = {
        lord: prLord,
        startDate: new Date(prStartMs),
        endDate: new Date(prEndMs),
      };
      break;
    }
    prCurrentMs = prEndMs;
  }
  if (!activePr) return null;

  return {
    mahadasha: { lord: activeMd.lord, startDate: activeMd.startDate, endDate: activeMd.endDate },
    antardasha: { lord: activeAd.lord, startDate: activeAd.startDate, endDate: activeAd.endDate },
    pratyantardasha: { lord: activePd.lord, startDate: activePd.startDate, endDate: activePd.endDate },
    sookshmadasha: activeSd,
    prandasha: activePr,
  };
}

