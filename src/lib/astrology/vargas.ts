// vargas.ts: Calculations for the 16 Divisional Charts (Shodashavarga) based on BPHS

export type VargaName =
  | 'D1'  // Rashi
  | 'D2'  // Hora
  | 'D3'  // Drekkana
  | 'D4'  // Chaturthamsa
  | 'D7'  // Saptamsha
  | 'D9'  // Navamsha
  | 'D10' // Dashamsha
  | 'D12' // Dwadasamsha
  | 'D16' // Shodasamsa (Kalamsa)
  | 'D20' // Vimsamsha
  | 'D24' // Siddhamsha (Chaturvimsamsha)
  | 'D27' // Bhamsa (Saptavimsamsha)
  | 'D30' // Trimsamsa
  | 'D40' // Khavedamsha
  | 'D45' // Akshavedamsha
  | 'D60'; // Shashtiamsha

export type VargaPlacements = Record<VargaName, number>;

// Helper to normalize sign index (0 to 11)
function norm(sign: number): number {
  return ((sign % 12) + 12) % 12;
}

// Check if sign is odd (Aries=0, Taurus=1, Gemini=2, etc. so index 0, 2, 4, 6, 8, 10 are odd signs in terms of Aries=1, i.e., index is even)
// Sign numbers: 0=Aries (odd), 1=Taurus (even), 2=Gemini (odd), etc.
function isOddSign(signIdx: number): boolean {
  return signIdx % 2 === 0;
}

// Calculate the sign placement for a given Varga and longitude
export function calculateVargaSign(longitude: number, varga: VargaName): number {
  const rawLong = longitude % 360;
  const signIdx = Math.floor(rawLong / 30);
  const degreeInSign = rawLong % 30;

  switch (varga) {
    case 'D1': // Rashi
      return signIdx;

    case 'D2': { // Hora
      const isOdd = isOddSign(signIdx);
      if (degreeInSign < 15) {
        return isOdd ? 4 : 3; // Sun (Leo=4) for odd, Moon (Cancer=3) for even
      } else {
        return isOdd ? 3 : 4; // Moon (Cancer=3) for odd, Sun (Leo=4) for even
      }
    }

    case 'D3': { // Drekkana
      const part = Math.floor(degreeInSign / 10); // 0, 1, 2
      if (part === 0) return signIdx;
      if (part === 1) return norm(signIdx + 4); // 5th sign
      return norm(signIdx + 8); // 9th sign
    }

    case 'D4': { // Chaturthamsa
      const part = Math.floor(degreeInSign / 7.5); // 0, 1, 2, 3
      return norm(signIdx + part * 3); // starts at signIdx, then 4th, 7th, 10th
    }

    case 'D7': { // Saptamsha
      const part = Math.floor(degreeInSign / (30 / 7)); // 0 to 6
      const startSign = isOddSign(signIdx) ? signIdx : norm(signIdx + 6); // 7th sign
      return norm(startSign + part);
    }

    case 'D9': { // Navamsha
      const part = Math.floor(degreeInSign / (30 / 9)); // 0 to 8
      let startSign = 0;
      const element = signIdx % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
      if (element === 0) startSign = 0; // Aries
      else if (element === 1) startSign = 9; // Capricorn
      else if (element === 2) startSign = 6; // Libra
      else startSign = 3; // Cancer
      return norm(startSign + part);
    }

    case 'D10': { // Dashamsha
      const part = Math.floor(degreeInSign / 3); // 0 to 9
      const startSign = isOddSign(signIdx) ? signIdx : norm(signIdx + 8); // 9th sign
      return norm(startSign + part);
    }

    case 'D12': { // Dwadasamsha
      const part = Math.floor(degreeInSign / 2.5); // 0 to 11
      return norm(signIdx + part);
    }

    case 'D16': { // Shodasamsa
      const part = Math.floor(degreeInSign / 1.875); // 0 to 15
      const mobility = signIdx % 3; // 0=Movable, 1=Fixed, 2=Dual
      let startSign = 0;
      if (mobility === 0) startSign = 0; // Aries
      else if (mobility === 1) startSign = 4; // Leo
      else startSign = 8; // Sagittarius
      return norm(startSign + part);
    }

    case 'D20': { // Vimsamsha
      const part = Math.floor(degreeInSign / 1.5); // 0 to 19
      const mobility = signIdx % 3;
      let startSign = 0;
      if (mobility === 0) startSign = 0; // Aries (Movable)
      else if (mobility === 1) startSign = 8; // Sagittarius (Fixed)
      else startSign = 4; // Leo (Dual)
      return norm(startSign + part);
    }

    case 'D24': { // Siddhamsha
      const part = Math.floor(degreeInSign / 1.25); // 0 to 23
      const startSign = isOddSign(signIdx) ? 4 : 3; // Leo (4) for odd, Cancer (3) for even
      return norm(startSign + part);
    }

    case 'D27': { // Bhamsa
      const part = Math.floor(degreeInSign / (30 / 27)); // 0 to 26
      let startSign = 0;
      const element = signIdx % 4; // Fire, Earth, Air, Water
      if (element === 0) startSign = 0; // Aries
      else if (element === 1) startSign = 3; // Cancer
      else if (element === 2) startSign = 6; // Libra
      else startSign = 9; // Capricorn
      return norm(startSign + part);
    }

    case 'D30': { // Trimsamsa
      const isOdd = isOddSign(signIdx);
      if (isOdd) {
        if (degreeInSign < 5) return 0; // Mars (Aries)
        if (degreeInSign < 10) return 10; // Saturn (Aquarius)
        if (degreeInSign < 18) return 8; // Jupiter (Sagittarius)
        if (degreeInSign < 25) return 2; // Mercury (Gemini)
        return 1; // Venus (Taurus)
      } else {
        if (degreeInSign < 5) return 1; // Venus (Taurus)
        if (degreeInSign < 12) return 5; // Mercury (Virgo)
        if (degreeInSign < 20) return 11; // Jupiter (Pisces)
        if (degreeInSign < 25) return 9; // Saturn (Capricorn)
        return 7; // Mars (Scorpio)
      }
    }

    case 'D40': { // Khavedamsha
      const part = Math.floor(degreeInSign / 0.75); // 0 to 39
      const startSign = isOddSign(signIdx) ? 0 : 6; // Aries (0) for odd, Libra (6) for even
      return norm(startSign + part);
    }

    case 'D45': { // Akshavedamsha
      const part = Math.floor(degreeInSign / (30 / 45)); // 0 to 44
      const mobility = signIdx % 3;
      let startSign = 0;
      if (mobility === 0) startSign = 0; // Aries
      else if (mobility === 1) startSign = 4; // Leo
      else startSign = 8; // Sagittarius
      return norm(startSign + part);
    }

    case 'D60': { // Shashtiamsha
      const part = Math.floor(degreeInSign / 0.5); // 0 to 59
      const startSign = isOddSign(signIdx) ? signIdx : norm(signIdx + 11); // sign itself or 12th sign
      return norm(startSign + part);
    }

    default:
      return signIdx;
  }
}

// Calculate varga placements for all planets and lagna
export function calculateAllVargas(longitude: number): VargaPlacements {
  const vargas: VargaName[] = [
    'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'
  ];
  const placements = {} as VargaPlacements;
  for (const v of vargas) {
    placements[v] = calculateVargaSign(longitude, v);
  }
  return placements;
}
