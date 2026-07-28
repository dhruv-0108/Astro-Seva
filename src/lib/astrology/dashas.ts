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
