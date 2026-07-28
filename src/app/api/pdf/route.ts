import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/admin';
import { calculateAstrologicalData } from '../../../lib/astrology/astro';
import { calculateAllVargas, calculateVargaSign, VargaName } from '../../../lib/astrology/vargas';
import { calculateVimshottari, PLANET_SPANS } from '../../../lib/astrology/dashas';
import { calculatePanchanga, NAKSHATRA_NAMES } from '../../../lib/astrology/panchanga';
import { calculateSaturnTransits } from '../../../lib/astrology/transits';
import { calculateShubhashubh } from '../../../lib/astrology/shubhashubh';

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

const RASHI_NAMES_GU = [
  'મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'
];

const PLANET_NAMES_GU: Record<string, string> = {
  Sun: 'સૂર્ય',
  Moon: 'ચંદ્ર',
  Mars: 'મંગળ',
  Mercury: 'બુધ',
  Jupiter: 'ગુરુ',
  Venus: 'શુક્ર',
  Saturn: 'શનિ',
  Rahu: 'રાહુ',
  Ketu: 'કેતુ',
};

// Draw North Indian Style chart in PDF
function drawNorthIndianChart(
  page: any,
  font: any,
  x: number,
  y: number,
  size: number,
  title: string,
  lagnaSign: number, // 0 to 11
  planetsMap: Record<string, { sign: number; isRetrograde: boolean }>
) {
  // Draw outline square
  page.drawRectangle({
    x,
    y,
    width: size,
    height: size,
    borderColor: rgb(0.83, 0.68, 0.21), // Gold color
    borderWidth: 1.5,
    color: rgb(0.99, 0.98, 0.96),
  });

  const cx = x + size / 2;
  const cy = y + size / 2;

  // Draw diagonals
  page.drawLine({ start: { x, y }, end: { x: x + size, y: y + size }, color: rgb(0.83, 0.68, 0.21), width: 1 });
  page.drawLine({ start: { x, y: y + size }, end: { x: x + size, y }, color: rgb(0.83, 0.68, 0.21), width: 1 });

  // Draw diamond
  page.drawLine({ start: { x: cx, y }, end: { x, y: cy }, color: rgb(0.83, 0.68, 0.21), width: 1 });
  page.drawLine({ start: { x, y: cy }, end: { x: cx, y: y + size }, color: rgb(0.83, 0.68, 0.21), width: 1 });
  page.drawLine({ start: { x: cx, y: y + size }, end: { x: x + size, y: cy }, color: rgb(0.83, 0.68, 0.21), width: 1 });
  page.drawLine({ start: { x: x + size, y: cy }, end: { x: cx, y }, color: rgb(0.83, 0.68, 0.21), width: 1 });

  // Draw Title
  page.drawText(title, {
    x: x + 10,
    y: y + size - 18,
    size: 11,
    font,
    color: rgb(0.8, 0.4, 0),
  });

  // Calculate sign numbers for each of the 12 houses (1-indexed house positions in chart)
  // House 1 (top center) has lagnaSign + 1. House 2 has lagnaSign + 2...
  const houseSigns: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    houseSigns[h] = ((lagnaSign + h - 1) % 12) + 1; // 1 to 12 display number
  }

  // Group planets by house placement
  const housePlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];

  for (const [name, p] of Object.entries(planetsMap)) {
    const pSignIndex = p.sign;
    const house = ((pSignIndex - lagnaSign + 12) % 12) + 1;
    const displayName = PLANET_NAMES_GU[name] || name;
    housePlanets[house].push(`${displayName}${p.isRetrograde ? '(R)' : ''}`);
  }

  // Geometrical coordinates for house sign numbers and planet names
  // Format: [ houseNumber ]: { signCoords: [dx, dy], planetCoords: [dx, dy] }
  const positions: Record<number, { sx: number; sy: number; px: number; py: number }> = {
    1: { sx: cx - 4, sy: y + size * 0.70, px: cx - 20, py: y + size * 0.58 },
    2: { sx: x + size * 0.25, sy: y + size * 0.82, px: x + size * 0.12, py: y + size * 0.72 },
    3: { sx: x + size * 0.14, sy: y + size * 0.62, px: x + size * 0.05, py: y + size * 0.54 },
    4: { sx: x + size * 0.28, sy: y + size * 0.48, px: x + size * 0.15, py: y + size * 0.40 },
    5: { sx: x + size * 0.14, sy: y + size * 0.34, px: x + size * 0.05, py: y + size * 0.24 },
    6: { sx: x + size * 0.25, sy: y + size * 0.14, px: x + size * 0.12, py: y + size * 0.06 },
    7: { sx: cx - 4, sy: y + size * 0.26, px: cx - 20, py: y + size * 0.16 },
    8: { sx: x + size * 0.70, sy: y + size * 0.14, px: x + size * 0.65, py: y + size * 0.06 },
    9: { sx: x + size * 0.82, sy: y + size * 0.34, px: x + size * 0.75, py: y + size * 0.24 },
    10: { sx: x + size * 0.68, sy: y + size * 0.48, px: x + size * 0.55, py: y + size * 0.40 },
    11: { sx: x + size * 0.82, sy: y + size * 0.62, px: x + size * 0.75, py: y + size * 0.54 },
    12: { sx: x + size * 0.70, sy: y + size * 0.82, px: x + size * 0.65, py: y + size * 0.72 },
  };

  // Draw numbers and planets
  for (let h = 1; h <= 12; h++) {
    const pos = positions[h];
    // Sign number
    page.drawText(houseSigns[h].toString(), {
      x: pos.sx,
      y: pos.sy,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Planets
    const plist = housePlanets[h];
    if (plist.length > 0) {
      // Draw first two planets, stack others
      plist.slice(0, 3).forEach((pstr, idx) => {
        page.drawText(pstr, {
          x: pos.px,
          y: pos.py - idx * 8,
          size: 7,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
      });
    }
  }
}

// Center title helper
function drawHeader(page: any, font: any, title: string, subtitle: string = '') {
  // Saffron header line
  page.drawLine({
    start: { x: 50, y: 795 },
    end: { x: 545, y: 795 },
    color: rgb(1, 0.6, 0.2),
    width: 2,
  });

  page.drawText('ૐ', { x: 50, y: 805, size: 24, font, color: rgb(0.8, 0.4, 0) });
  page.drawText(title, { x: 80, y: 808, size: 14, font, color: rgb(0.8, 0.4, 0) });
  
  if (subtitle) {
    page.drawText(subtitle, { x: 80, y: 799, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
  }

  // Footer page number
  page.drawLine({
    start: { x: 50, y: 40 },
    end: { x: 545, y: 40 },
    color: rgb(0.9, 0.9, 0.9),
    width: 1,
  });
  page.drawText('એસ્ટ્રો-સેવા કુંડળી રિપોર્ટ — ગુરુજીના આશીર્વાદ સાથે', {
    x: 50,
    y: 28,
    size: 7,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing request ID', { status: 400 });
    }

    // 1. Fetch submission from Firestore
    const docRef = adminDb.collection('submissions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return new Response('Kundli not found', { status: 404 });
    }

    const data = docSnap.data();
    if (!data) return new Response('Empty record data', { status: 500 });

    // Payment verification check
    if (data.paymentStatus !== 'paid') {
      return new Response('Payment pending approval by Guruji', { status: 403 });
    }

    const name = data.name;
    const phone = data.phone;
    const { date, time, place, lat, lng, tzOffset } = data.birthDetails;

    // Parse date/time components
    const dateParts = date.split('-'); // YYYY-MM-DD
    const timeParts = time.split(':'); // HH:MM:SS
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    const hour = parseInt(timeParts[0]);
    const min = parseInt(timeParts[1]);
    const sec = timeParts[2] ? parseInt(timeParts[2]) : 0;

    // 2. Execute Astrological calculations
    const astro = calculateAstrologicalData(year, month, day, hour, min, sec, lat, lng, tzOffset);
    const birthDateObj = new Date(year, month - 1, day, hour, min, sec);
    const lagnaSignIndex = Math.floor(astro.ascendant / 30);

    const panchanga = calculatePanchanga(astro.jd, tzOffset);
    const dasha = calculateVimshottari(astro.planets.Moon.longitude, birthDateObj);
    const transits = calculateSaturnTransits(astro.jd, astro.planets.Moon.sign, tzOffset);
    const shubha = calculateShubhashubh(birthDateObj, lagnaSignIndex);

    // 3. Setup PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Load Unicode Gujarati font
    const fontPath = path.join(process.cwd(), 'src/assets/fonts/NotoSansGujarati-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    // =========================================================================
    // PAGE 1: BASIC DETAILS & PANCHANGA
    // =========================================================================
    const p1 = pdfDoc.addPage([595, 842]);
    drawHeader(p1, font, 'જન્મ કુંડળી વિગતો (Birth & Panchanga Details)', name);

    // Left Column Box
    p1.drawRectangle({ x: 50, y: 480, width: 235, height: 280, color: rgb(0.99, 0.98, 0.96), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });
    const p1Left = [
      { k: 'નામ (Name)', v: name },
      { k: 'જન્મ તારીખ (DOB)', v: `${day}-${month}-${year}` },
      { k: 'જન્મ સમય (TOB)', v: time },
      { k: 'જન્મ સ્થાન (POB)', v: place.split(',').slice(0, 2).join(',') },
      { k: 'અક્ષાંશ (Latitude)', v: `${Math.floor(lat)}°${Math.floor((lat % 1) * 60)}' N` },
      { k: 'રેખાંશ (Longitude)', v: `${Math.floor(lng)}°${Math.floor((lng % 1) * 60)}' E` },
      { k: 'ટાઇમઝોન (Timezone)', v: `GMT +${tzOffset}` },
      { k: 'અયનાંશ (Ayanamsa)', v: `${Math.floor(astro.ayanamsa)}°${Math.floor((astro.ayanamsa % 1) * 60)}' ${Math.floor((((astro.ayanamsa % 1) * 60) % 1) * 60)}"` },
    ];
    p1Left.forEach((item, idx) => {
      p1.drawText(item.k, { x: 60, y: 740 - idx * 30, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
      p1.drawText(item.v, { x: 60, y: 728 - idx * 30, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    });

    // Right Column Box
    p1.drawRectangle({ x: 300, y: 480, width: 245, height: 280, color: rgb(0.99, 0.98, 0.96), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });
    const p1Right = [
      { k: 'ચંદ્ર રાશિ (Moon Sign)', v: RASHI_NAMES_GU[astro.planets.Moon.sign] },
      { k: 'તિથિ (Tithi)', v: panchanga.tithi.formatted },
      { k: 'નક્ષત્ર (Nakshatra)', v: `${panchanga.nakshatra.formatted} (${(astro.planets.Moon.longitude % 13.333 > 10) ? 4 : Math.floor((astro.planets.Moon.longitude % 13.333)/3.333)+1} ચરણ)` },
      { k: 'યોગ (Yoga)', v: panchanga.yoga.formatted },
      { k: 'કરણ (Karana)', v: panchanga.karana.formatted },
      { k: 'મૂળાંક (Mulank)', v: shubha.mulank.toString() },
      { k: 'ભાગ્યાંક (Bhagyank)', v: shubha.bhagyank.toString() },
      { k: 'ભોગ્ય દશા (Dasha at Birth)', v: `${dasha.bhogyaDasha.lord} (${dasha.bhogyaDasha.formatted})` },
    ];
    p1Right.forEach((item, idx) => {
      p1.drawText(item.k, { x: 310, y: 740 - idx * 30, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
      p1.drawText(item.v, { x: 310, y: 728 - idx * 30, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    });

    // Transition Times Table
    p1.drawText('પંચાંગ પરિવર્તન સમય (Panchanga Transition Times)', { x: 50, y: 430, size: 12, font, color: rgb(0.8, 0.4, 0) });
    p1.drawRectangle({ x: 50, y: 90, width: 495, height: 320, color: rgb(1, 1, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });
    
    // Headers
    p1.drawRectangle({ x: 50, y: 380, width: 495, height: 30, color: rgb(0.99, 0.94, 0.88) });
    p1.drawText('તત્વ (Element)', { x: 60, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p1.drawText('સબમિટ વિગત (At Birth)', { x: 160, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p1.drawText('પ્રારંભ સમય (Start Time)', { x: 280, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p1.drawText('અંત સમય (End Time)', { x: 420, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });

    const p1Trans = [
      { label: 'તિથિ (Tithi)', val: panchanga.tithi.formatted, s: panchanga.tithi.startTime, e: panchanga.tithi.endTime },
      { label: 'નક્ષત્ર (Nakshatra)', val: panchanga.nakshatra.formatted, s: panchanga.nakshatra.startTime, e: panchanga.nakshatra.endTime },
      { label: 'યોગ (Yoga)', val: panchanga.yoga.formatted, s: panchanga.yoga.startTime, e: panchanga.yoga.endTime },
      { label: 'કરણ (Karana)', val: panchanga.karana.formatted, s: panchanga.karana.startTime, e: panchanga.karana.endTime },
      { label: 'ચંદ્ર રાશિ (Rashi)', val: panchanga.rashi.formatted, s: panchanga.rashi.startTime, e: panchanga.rashi.endTime },
    ];

    const formatShortTime = (d: Date) => `${d.getDate()}/${d.getMonth()+1} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

    p1Trans.forEach((row, idx) => {
      const yOffset = 345 - idx * 55;
      pageBorderLine(p1, 90 + yOffset);
      p1.drawText(row.label, { x: 60, y: yOffset + 15, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
      p1.drawText(row.val, { x: 160, y: yOffset + 15, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
      p1.drawText(formatShortTime(row.s), { x: 280, y: yOffset + 15, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
      p1.drawText(formatShortTime(row.e), { x: 420, y: yOffset + 15, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
    });

    // Helper line drawer
    function pageBorderLine(pageObj: any, yval: number) {
      pageObj.drawLine({ start: { x: 50, y: yval }, end: { x: 545, y: yval }, color: rgb(0.9, 0.9, 0.9), width: 1 });
    }

    // =========================================================================
    // PAGE 2: CHALIT & CUSP CHARTS WITH DEGREES
    // =========================================================================
    const p2 = pdfDoc.addPage([595, 842]);
    drawHeader(p2, font, 'ચલિત અને કસ્પ કુંડળી (Chalit & Cusp Kundli)', name);

    // Planet details mapped to draw helper format
    const planetsFormat = {} as Record<string, { sign: number; isRetrograde: boolean }>;
    for (const [pname, pobj] of Object.entries(astro.planets)) {
      planetsFormat[pname] = { sign: pobj.sign, isRetrograde: pobj.isRetrograde };
    }

    // Draw Chalit Chart (Left)
    drawNorthIndianChart(p2, font, 50, 480, 235, 'ભવ ચલિત કુંડળી (Chalit)', lagnaSignIndex, planetsFormat);

    // Draw Cusp Chart (Right) - Placidus Cusp chart uses house positions directly as signs
    const cuspPlacements = {} as Record<string, { sign: number; isRetrograde: boolean }>;
    for (const [pname, pobj] of Object.entries(astro.planets)) {
      // Find which Placidus house the planet is in
      let pCuspSign = pobj.sign;
      for (let h = 0; h < 11; h++) {
        if (pobj.longitude >= astro.houses[h] && pobj.longitude < astro.houses[h+1]) {
          pCuspSign = h;
          break;
        }
      }
      cuspPlacements[pname] = { sign: pCuspSign, isRetrograde: pobj.isRetrograde };
    }
    drawNorthIndianChart(p2, font, 310, 480, 235, 'કસ્પ કુંડળી (KP Cusp Chart)', lagnaSignIndex, cuspPlacements);

    // Chalit / Cusp Table
    p2.drawText('કસ્પ અંશ વિગતો (Cusp Degree Table)', { x: 50, y: 430, size: 12, font, color: rgb(0.8, 0.4, 0) });
    p2.drawRectangle({ x: 50, y: 90, width: 495, height: 320, color: rgb(1, 1, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });

    p2.drawRectangle({ x: 50, y: 380, width: 495, height: 30, color: rgb(0.99, 0.94, 0.88) });
    p2.drawText('ભાવ (House)', { x: 60, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p2.drawText('સ્પષ્ટ અંશ (Degrees)', { x: 180, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p2.drawText('રાશિ નામ (Rashi Sign)', { x: 340, y: 390, size: 9, font, color: rgb(0.6, 0.3, 0) });

    for (let h = 1; h <= 12; h++) {
      const yOffset = 380 - h * 24;
      pageBorderLine(p2, yOffset);
      const houseDeg = astro.houses[h-1];
      const signIndex = Math.floor(houseDeg / 30);
      const localDeg = houseDeg % 30;
      
      const degStr = `${Math.floor(localDeg)}° ${Math.floor((localDeg % 1) * 60)}' ${Math.floor((((localDeg % 1) * 60) % 1) * 60)}"`;

      p2.drawText(`ભાવ ${h}`, { x: 60, y: yOffset + 6, size: 9, font, color: rgb(0.1, 0.1, 0.1) });
      p2.drawText(degStr, { x: 180, y: yOffset + 6, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      p2.drawText(RASHI_NAMES_GU[signIndex], { x: 340, y: yOffset + 6, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
    }

    // =========================================================================
    // PAGE 3: TARA CHAKRA & OTHER CHARTS
    // =========================================================================
    const p3 = pdfDoc.addPage([595, 842]);
    drawHeader(p3, font, 'તારા ચક્ર અને મુખ્ય વર્ગો (Tara Chakra & Charts)', name);

    // Tara Chakra grid drawing
    p3.drawText('તારા ચક્ર (Nakshatra Tara Chakra)', { x: 50, y: 740, size: 12, font, color: rgb(0.8, 0.4, 0) });
    p3.drawRectangle({ x: 50, y: 480, width: 495, height: 240, color: rgb(1, 1, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });

    p3.drawRectangle({ x: 50, y: 690, width: 495, height: 30, color: rgb(0.99, 0.94, 0.88) });
    const tarasGu = ['જન્મ', 'સંપત', 'વિપત', 'ક્ષેમ', 'પ્રત્યરી', 'સાધક', 'વધ', 'મૈત્રી', 'અતિ-મૈત્રી'];
    
    // Draw columns headers
    tarasGu.forEach((tName, colIdx) => {
      p3.drawText(tName, { x: 58 + colIdx * 54, y: 700, size: 8, font, color: rgb(0.6, 0.3, 0) });
    });

    // Populate Tara nakshatras
    const moonNakIdx = Math.floor(astro.planets.Moon.longitude / (360 / 27));
    
    for (let cycle = 0; cycle < 3; cycle++) {
      const yOffset = 690 - (cycle + 1) * 60;
      pageBorderLine(p3, yOffset);
      
      for (let tIdx = 0; tIdx < 9; tIdx++) {
        const nakNumber = (moonNakIdx + tIdx + cycle * 9) % 27;
        const nakName = NAKSHATRA_NAMES[nakNumber];
        
        p3.drawText(nakName.slice(0, 6), {
          x: 58 + tIdx * 54,
          y: yOffset + 24,
          size: 7,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
    }

    // Chandra & Navamsha Charts side-by-side
    // Moon chart (Lagna set to Moon Sign)
    const moonSignIdx = astro.planets.Moon.sign;
    drawNorthIndianChart(p3, font, 50, 200, 235, 'ચંદ્ર કુંડળી (Moon Chart)', moonSignIdx, planetsFormat);

    // Navamsha (D9) Chart
    const d9Placements = {} as Record<string, { sign: number; isRetrograde: boolean }>;
    for (const [pname, pobj] of Object.entries(astro.planets)) {
      d9Placements[pname] = { sign: calculateVargaSign(pobj.longitude, 'D9'), isRetrograde: pobj.isRetrograde };
    }
    const d9LagnaSign = calculateVargaSign(astro.ascendant, 'D9');
    drawNorthIndianChart(p3, font, 310, 200, 235, 'નવમાંશ કુંડળી (Navamsha - D9)', d9LagnaSign, d9Placements);

    // Active Dasha Chain text at bottom
    p3.drawRectangle({ x: 50, y: 90, width: 495, height: 80, color: rgb(0.99, 0.98, 0.96), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });
    const runningMd = dasha.mahadashas.find(md => md.startDate <= birthDateObj && md.endDate >= birthDateObj) || dasha.mahadashas[0];
    const runningAd = runningMd?.antardashas.find(ad => ad.startDate <= birthDateObj && ad.endDate >= birthDateObj) || runningMd?.antardashas[0];
    const runningPd = runningAd?.pratyantardashas.find(pd => pd.startDate <= birthDateObj && pd.endDate >= birthDateObj) || runningAd?.pratyantardashas[0];

    p3.drawText('જન્મ સમયે સક્રિય દશા શૃંખલા (Active Dasha Chain at Birth)', { x: 60, y: 145, size: 10, font, color: rgb(0.8, 0.4, 0) });
    p3.drawText(
      `મહા દશા: ${PLANET_NAMES_GU[runningMd.lord]}  >>  અંતર દશા: ${PLANET_NAMES_GU[runningAd.lord]}  >>  પ્રત્યંતર દશા: ${PLANET_NAMES_GU[runningPd.lord]}`,
      { x: 60, y: 115, size: 12, font, color: rgb(0.1, 0.1, 0.1) }
    );

    // =========================================================================
    // PAGE 4: SADESATI & DHAIYA LIFETIME TRANSITS
    // =========================================================================
    const p4 = pdfDoc.addPage([595, 842]);
    drawHeader(p4, font, 'સાડાસાતી વિચાર (Lifetime Saturn Transits)', name);

    p4.drawText('શનિ ગોચર અને સાડાસાતી કોષ્ટક (Saturn Transit Table)', { x: 50, y: 740, size: 12, font, color: rgb(0.8, 0.4, 0) });
    p4.drawRectangle({ x: 50, y: 90, width: 495, height: 630, color: rgb(1, 1, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });

    p4.drawRectangle({ x: 50, y: 690, width: 495, height: 30, color: rgb(0.99, 0.94, 0.88) });
    p4.drawText('ગોચર પ્રકાર (Type)', { x: 60, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p4.drawText('શનિ રાશિ (Saturn)', { x: 160, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p4.drawText('પ્રારંભ તારીખ (Start)', { x: 260, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p4.drawText('અંત તારીખ (End)', { x: 370, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p4.drawText('પાયા (Metal)', { x: 480, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });

    const formatDateShort = (d: Date) => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;

    // Render up to 23 transit records (which fits in 600px height at 25px per row)
    transits.slice(0, 23).forEach((tRow, idx) => {
      const yOffset = 690 - (idx + 1) * 25;
      pageBorderLine(p4, yOffset);

      p4.drawText(tRow.type, { x: 60, y: yOffset + 8, size: 9, font, color: rgb(0.1, 0.1, 0.1) });
      p4.drawText(tRow.saturnSignFormatted, { x: 160, y: yOffset + 8, size: 9, font, color: rgb(0.2, 0.2, 0.2) });
      p4.drawText(formatDateShort(tRow.startDate), { x: 260, y: yOffset + 8, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
      p4.drawText(formatDateShort(tRow.endDate), { x: 370, y: yOffset + 8, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
      p4.drawText(tRow.paya, { x: 480, y: yOffset + 8, size: 9, font, color: rgb(0.1, 0.5, 0.1) });
    });

    // =========================================================================
    // PAGE 5: SHUBHASHUBH TABLE & REMEDIES
    // =========================================================================
    const p5 = pdfDoc.addPage([595, 842]);
    drawHeader(p5, font, 'શુભાશુભ નું જ્ઞાન (Auspicious Guide & Remedies)', name);

    p5.drawText('અનુકૂળતા માર્ગદર્શિકા (Personalized Auspicious Guide)', { x: 50, y: 740, size: 12, font, color: rgb(0.8, 0.4, 0) });
    p5.drawRectangle({ x: 50, y: 90, width: 495, height: 630, color: rgb(1, 1, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });

    const remedies = [
      { k: 'મૂળાંક (Radical Number)', v: shubha.mulank.toString() },
      { k: 'ભાગ્યાંક (Destiny Number)', v: shubha.bhagyank.toString() },
      { k: 'મિત્રાંક (Friendly Numbers)', v: shubha.friendlyNumbers },
      { k: 'શત્રુ અંક (Enemy Numbers)', v: shubha.enemyNumbers },
      { k: 'શુભ વર્ષ (Auspicious Years)', v: shubha.auspiciousYears },
      { k: 'શુભ વાર (Auspicious Days)', v: shubha.auspiciousDays },
      { k: 'શુભ ગ્રહ (Auspicious Planets)', v: shubha.auspiciousPlanets },
      { k: 'અશુભ ગ્રહ (Inauspicious Planets)', v: shubha.inauspiciousPlanets },
      { k: 'મિત્ર રાશિ (Friendly Signs)', v: shubha.friendlySigns },
      { k: 'મિત્ર લગ્ન (Friendly Lagnas)', v: shubha.friendlyLagnas },
      { k: 'શુભ રત્ન (Auspicious Gemstone)', v: shubha.gemstone },
      { k: 'શુભ ઉપરત્ન (Auspicious Sub-gemstone)', v: shubha.subGemstone },
      { k: 'ભાગ્ય રત્ન (Destiny Gemstone)', v: shubha.fortuneGemstone },
      { k: 'અનુકૂળ દેવતા (Auspicious Deity)', v: shubha.deity },
      { k: 'શુભ ધાતુ (Auspicious Metal)', v: shubha.metal },
      { k: 'શુભ રંગ (Auspicious Color)', v: shubha.color },
      { k: 'દિશા (Direction)', v: shubha.direction },
      { k: 'સમય (Auspicious Time)', v: shubha.timeOfDay },
      { k: 'પદાર્થ (Offering Substances)', v: shubha.offerings },
      { k: 'અન્ન (Auspicious Food)', v: shubha.food },
      { k: 'દ્રવ્ય (Liquids/Ghee)', v: shubha.liquid },
    ];

    remedies.forEach((row, idx) => {
      const yOffset = 680 - idx * 28;
      pageBorderLine(p5, yOffset);

      p5.drawText(row.k, { x: 60, y: yOffset + 8, size: 10, font, color: rgb(0.5, 0.5, 0.5) });
      p5.drawText(row.v, { x: 280, y: yOffset + 8, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    });

    // =========================================================================
    // PAGE 6: VIMSHOTTARI DASHA TABLE
    // =========================================================================
    const p6 = pdfDoc.addPage([595, 842]);
    drawHeader(p6, font, 'વિંશોત્તરી મહા દશા (Vimshottari Dasha Spans)', name);

    p6.drawText('વિંશોત્તરી મહા દશા ચક્ર (Vimshottari Dasha Timeline)', { x: 50, y: 740, size: 12, font, color: rgb(0.8, 0.4, 0) });
    p6.drawRectangle({ x: 50, y: 90, width: 495, height: 630, color: rgb(1, 1, 1), borderColor: rgb(0.9, 0.9, 0.9), borderWidth: 1 });

    p6.drawRectangle({ x: 50, y: 690, width: 495, height: 30, color: rgb(0.99, 0.94, 0.88) });
    p6.drawText('ગ્રહ (Planet Lord)', { x: 60, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p6.drawText('પ્રારંભ તારીખ (Start Date)', { x: 200, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });
    p6.drawText('અંત તારીખ (End Date)', { x: 380, y: 700, size: 9, font, color: rgb(0.6, 0.3, 0) });

    dasha.mahadashas.forEach((mdRow, idx) => {
      const yOffset = 690 - (idx + 1) * 60;
      pageBorderLine(p6, yOffset);

      p6.drawText(`${PLANET_NAMES_GU[mdRow.lord] || mdRow.lord} Dasha (${PLANET_SPANS[mdRow.lord]} વર્ષ)`, {
        x: 60,
        y: yOffset + 24,
        size: 11,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      p6.drawText(formatDateShort(mdRow.startDate), { x: 200, y: yOffset + 24, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
      p6.drawText(formatDateShort(mdRow.endDate), { x: 380, y: yOffset + 24, size: 10, font, color: rgb(0.3, 0.3, 0.3) });

      // Sub-AD preview text below main line
      const adPreview = mdRow.antardashas.slice(0, 5).map(ad => `${PLANET_NAMES_GU[ad.lord] || ad.lord}`).join(', ');
      p6.drawText(`અંતર દશા: ${adPreview}...`, {
        x: 60,
        y: yOffset + 8,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    // 4. Save and return PDF as stream
    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Kundli-${name.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation API error:', error);
    return new Response(`PDF generation failed: ${error.message}`, { status: 500 });
  }
}
