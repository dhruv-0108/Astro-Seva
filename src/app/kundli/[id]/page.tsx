'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NorthIndianChart from '../../../components/NorthIndianChart';
import { Button } from '../../../components/ui/shadcn/button';
import { Card } from '../../../components/ui/shadcn/card';
import { Badge } from '../../../components/ui/shadcn/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  Home,
  ChevronDown,
  ChevronUp,
  Compass,
  ShieldCheck,
  Award,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { calculateSookshmadashas, calculatePranadashas } from '../../../lib/astrology/dashas';

type Language = 'EN' | 'GU' | 'HI';

const RASHI_NAMES: Record<Language, string[]> = {
  EN: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  GU: ['મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'],
  HI: ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'],
};

const NAKSHATRA_NAMES: Record<Language, string[]> = {
  EN: [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ],
  GU: [
    'અશ્વિની', 'ભરણી', 'કૃતિકા', 'રોહિણી', 'મૃગશીર્ષ', 'આર્દ્રા',
    'પુનર્વસુ', 'પુષ્ય', 'આશ્લેષા', 'મઘા', 'પૂર્વા ફાલ્ગુની', 'ઉત્તરા ફાલ્ગુની',
    'હસ્ત', 'ચિત્રા', 'સ્વાતી', 'વિશાખા', 'અનુરાધા', 'જ્યેષ્ઠા',
    'મૂળ', 'પૂર્વાષાઢા', 'ઉત્તરાષાઢા', 'શ્રવણ', 'ધનિષ્ઠા', 'શતભિષા',
    'પૂર્વા ભાદ્રપદ', 'ઉત્તરા ભાદ્રપદ', 'રેવતી'
  ],
  HI: [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
    'पुनर्वसु', 'पुष्य', 'अश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी',
    'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
    'मूल', 'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'वती'
  ],
};

const PLANET_NAMES: Record<Language, Record<string, string>> = {
  EN: { Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury', Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu' },
  GU: { Sun: 'સૂર્ય', Moon: 'ચંદ્ર', Mars: 'મંગળ', Mercury: 'બુધ', Jupiter: 'ગુરુ', Venus: 'શુક્ર', Saturn: 'શનિ', Rahu: 'રાહુ', Ketu: 'કેતુ' },
  HI: { Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु' },
};

const VARGA_LABELS: Record<Language, Record<string, string>> = {
  EN: {
    D1: 'D1 - Birth Lagna Chart', D2: 'D2 - Hora (Wealth)', D3: 'D3 - Drekkana (Siblings)', D4: 'D4 - Chaturthamsha (Fortune)',
    D7: 'D7 - Saptamsha (Children)', D9: 'D9 - Navamsha (Spouse)', D10: 'D10 - Dashamsha (Career)', D12: 'D12 - Dwadashamsha (Parents)',
    D16: 'D16 - Shodashamsha (Comforts)', D20: 'D20 - Vimshamsha (Spiritual)', D24: 'D24 - Chaturvimshamsha (Learning)',
    D27: 'D27 - Bhamsa (Strengths)', D30: 'D30 - Trimshamsha (Misfortunes)', D40: 'D40 - Khavedamsha (Auspicious)',
    D45: 'D45 - Akshavedamsha (General)', D60: 'D60 - Shashtiamsha (Past Life)',
  },
  GU: {
    D1: 'D1 - જન્મ લગ્ન કુંડળી', D2: 'D2 - હોરા (સંપત્તિ)', D3: 'D3 - દ્રેષ્કાણ (ભાઈ-બહેન)', D4: 'D4 - ચતુર્થાંશ (ભાગ્ય)',
    D7: 'D7 - સપ્તમાંશ (સંતતિ)', D9: 'D9 - નવાંશ (જીવનસાથી)', D10: 'D10 - દશમાંશ (કારકિર્દી/વ્યવસાય)', D12: 'D12 - દ્વાદશાંશ (માતા-પિતા)',
    D16: 'D16 - ષોડશાંશ (વાહન/સુખ)', D20: 'D20 - વિંશાંશ (ઉપાસના)', D24: 'D24 - ચતુર્વિંશાંશ (વિદ્યા)',
    D27: 'D27 - ભાંશ (બળ/શક્તિ)', D30: 'D30 - ત્રિંશાંશ (અરિષ્ટ/સંકટ)', D40: 'D40 - ખવેદાંશ (શુભ ફળ)',
    D45: 'D45 - અક્ષવેદાંશ (સર્વ સુખ)', D60: 'D60 - ષષ્ટિયાંશ (પૂર્વજન્મ કર્મ)',
  },
  HI: {
    D1: 'D1 - जन्म लग्न कुंडली', D2: 'D2 - होरा (संपत्ति)', D3: 'D3 - द्रेष्काण (भाई-बहन)', D4: 'D4 - चतुर्थांश (भाग्य)',
    D7: 'D7 - सप्तमांश (संतान)', D9: 'D9 - नवांश (जीवनसाथी)', D10: 'D10 - दशमांश (करियर/व्यवसाय)', D12: 'D12 - द्वादशांश (माता-पिता)',
    D16: 'D16 - षोडशांश (वाहन/सुख)', D20: 'D20 - विंशांश (उपासना)', D24: 'D24 - चतुर्विंशांश (विद्या)',
    D27: 'D27 - भांश (बल/शक्ति)', D30: 'D30 - त्रिंशांश (अरिष्ट/संकट)', D40: 'D40 - खवेदांश (शुभ फल)',
    D45: 'D45 - अक्षवेदांश (सर्व सुख)', D60: 'D60 - षष्ठियांश (पूर्वजन्म कर्म)',
  },
};

const UI_TEXTS: Record<Language, {
  ganeshayNamah: string;
  home: string;
  subTitle: string;
  printPdf: string;
  lagna: string;
  moonSign: string;
  nakshatra: string;
  mahadasha: string;
  gocharTitle: string;
  gocharSub: string;
  chartModeLabel: string;
  natalOnly: string;
  gocharOnly: string;
  natalGocharBoth: string;
  transitComparisonTitle: string;
  colPlanet: string;
  colTransitSign: string;
  colHouseLagna: string;
  colHouseMoon: string;
  colNatalSign: string;
  mainChartsHeader: string;
  vargaSelectLabel: string;
  dashaChainTitle: string;
  dashaTimelineTitle: string;
  bhogyaText: string;
  activeNow: string;
  sadesatiTitle: string;
  sadesatiSub: string;
  colType: string;
  colSaturnSign: string;
  colDates: string;
  colStatus: string;
  colPaya: string;
  planetPositionsTitle: string;
  colDegree: string;
  colNakshatraPada: string;
  panchangTitle: string;
  remediesTitle: string;
  bphsTitle: string;
  bphsSub: string;
  strongPlanetsTitle: string;
  weakPlanetsTitle: string;
  noStrongPlanets: string;
  noWeakPlanets: string;
  colShadbalaRupas: string;
  colRequiredRupas: string;
  colRatio: string;
  colSthana: string;
  colDig: string;
  colKala: string;
  colCheshta: string;
  colNaisargika: string;
  colDrik: string;
  tithi: string;
  yoga: string;
  karana: string;
  mulank: string;
  bhagyank: string;
  friendlyNumbers: string;
  enemyNumbers: string;
  auspiciousYears: string;
  auspiciousDays: string;
  auspiciousGemstone: string;
  subGemstone: string;
  fortuneGemstone: string;
  auspiciousDeity: string;
  auspiciousMetal: string;
  auspiciousColor: string;
  auspiciousDirection: string;
  tabs: {
    gochar: string;
    charts: string;
    dashas: string;
    sadesati: string;
    planets: string;
    remedies: string;
  };
  chartNames: {
    d1: string;
    chalit: string;
    cusp: string;
    moon: string;
    d9: string;
  };
  statusMap: Record<string, string>;
  payaMap: Record<string, string>;
}> = {
  EN: {
    ganeshayNamah: '॥ Shree Ganeshay Namah ॥',
    home: 'Home',
    subTitle: 'Vedic Astrology Consultation Workspace',
    printPdf: 'Print Customer PDF',
    lagna: 'Lagna',
    moonSign: 'Moon Sign',
    nakshatra: 'Nakshatra',
    mahadasha: 'MahaDasha',
    gocharTitle: 'Current Planetary Transits Overlay (Live Gochar)',
    gocharSub: 'Real-time planetary transits compared against natal birth placements.',
    chartModeLabel: 'Display Chart Mode:',
    natalOnly: 'Natal Only',
    gocharOnly: 'Current Gochar Only',
    natalGocharBoth: 'Natal + Gochar Overlay',
    transitComparisonTitle: 'Live Transit vs Natal Placement Comparison',
    colPlanet: 'Planet',
    colTransitSign: 'Transit Sign',
    colHouseLagna: 'House (Lagna)',
    colHouseMoon: 'House (Moon)',
    colNatalSign: 'Natal Sign',
    mainChartsHeader: 'Core 5 Vedic Charts & Shodashavarga Selector',
    vargaSelectLabel: 'Select Additional Divisional Chart (Varga):',
    dashaChainTitle: 'Current 5-Level Active Dasha Chain',
    dashaTimelineTitle: '120-Year Vimshottari Dasha Timeline',
    bhogyaText: 'Bhogya at Birth:',
    activeNow: 'Active Now',
    sadesatiTitle: 'Saturn Sade Sati & Nani Panoti Chronological Timeline',
    sadesatiSub: 'Comprehensive lifetime Saturn transits, phases, status, and metal payas.',
    colType: 'Transit Type',
    colSaturnSign: 'Saturn Sign',
    colDates: 'Start Date → End Date',
    colStatus: 'Current Status',
    colPaya: 'Paya (Metal)',
    planetPositionsTitle: 'Planetary Positions & Degree Details Table',
    colDegree: 'Degree in Sign',
    colNakshatraPada: 'Nakshatra & Pada',
    panchangTitle: 'Birth Panchanga Details',
    remediesTitle: 'Auspicious Guide & Astrological Remedies Table',
    bphsTitle: 'Parashari Strong & Weak Planets Analysis (BPHS Shadbala)',
    bphsSub: 'Strictly computed per Brihat Parasara Hora Shastra (Ch. 27). Combines 6-fold Shadbala potencies in Rupas, Exaltation/Debilitation & Combustion status.',
    strongPlanetsTitle: 'Strong Planets (Balavan Grahas)',
    weakPlanetsTitle: 'Weak Planets (Nirbala Grahas)',
    noStrongPlanets: 'No planets meet BPHS strong threshold.',
    noWeakPlanets: 'No weak planets detected.',
    colShadbalaRupas: 'Shadbala (Rupas)',
    colRequiredRupas: 'Required (Rupas)',
    colRatio: 'SMR Ratio',
    colSthana: 'Sthana',
    colDig: 'Dig',
    colKala: 'Kala',
    colCheshta: 'Cheshta',
    colNaisargika: 'Naisargika',
    colDrik: 'Drik',
    tithi: 'Tithi',
    yoga: 'Yoga',
    karana: 'Karana',
    mulank: 'Radical Number (Mulank)',
    bhagyank: 'Destiny Number (Bhagyank)',
    friendlyNumbers: 'Friendly Numbers',
    enemyNumbers: 'Enemy Numbers',
    auspiciousYears: 'Auspicious Years',
    auspiciousDays: 'Auspicious Days',
    auspiciousGemstone: 'Auspicious Gemstone',
    subGemstone: 'Sub-Gemstone',
    fortuneGemstone: 'Fortune Gemstone',
    auspiciousDeity: 'Auspicious Deity',
    auspiciousMetal: 'Auspicious Metal',
    auspiciousColor: 'Auspicious Color',
    auspiciousDirection: 'Auspicious Direction',
    tabs: {
      gochar: '0. Gochar Overlay',
      charts: '1. Kundli Charts',
      dashas: '2. Vimshottari Dasha',
      sadesati: '3. Sade Sati & Panoti',
      planets: '4. Planets & BPHS Strengths',
      remedies: '5. Panchang & Remedies',
    },
    chartNames: {
      d1: '1. Birth Lagna Chart (D1)',
      chalit: '2. Bhav Chalit Chart',
      cusp: '3. KP Cusp Chart',
      moon: '4. Chandra Rashi Kundli (Moon)',
      d9: '5. Navamsha Chart (D9)',
    },
    statusMap: { Active: 'Active Now', Completed: 'Completed', Upcoming: 'Upcoming' },
    payaMap: { Gold: 'Gold (સોનુ)', Silver: 'Silver (રૂપું)', Copper: 'Copper (તાંબુ)', Iron: 'Iron (લોઢું)' },
  },
  GU: {
    ganeshayNamah: '॥ શ્રી ગણેશાય નમઃ ॥',
    home: 'મુખ્ય પૃષ્ઠ',
    subTitle: 'વૈદિક જ્યોતિષ ગણતરી અને પરામર્શ',
    printPdf: 'ગ્રાહક PDF પ્રિન્ટ કરો',
    lagna: 'લગ્ન રાશિ',
    moonSign: 'ચંદ્ર રાશિ',
    nakshatra: 'નક્ષત્ર',
    mahadasha: 'મહાદશા',
    gocharTitle: 'વર્તમાન ગ્રહ ગોચર ઓવરલે (લાઈવ ટ્રાન્ઝિટ)',
    gocharSub: 'જન્મ સમયના ગ્રહો સામે વર્તમાન ગોચર ગ્રહોની લાઈવ તુલના.',
    chartModeLabel: 'ચાર્ટ મોડ પસંદ કરો:',
    natalOnly: 'માત્ર જન્મ ગ્રહો',
    gocharOnly: 'માત્ર વર્તમાન ગોચર',
    natalGocharBoth: 'જન્મ + ગોચર ઓવરલે',
    transitComparisonTitle: 'વર્તમાન ગોચર અને જન્મ ગ્રહ સ્થિતિ તુલના કોષ્ટક',
    colPlanet: 'ગ્રહ',
    colTransitSign: 'ગોચર રાશિ',
    colHouseLagna: 'ભાવ (લગ્નથી)',
    colHouseMoon: 'ભાવ (ચંદ્રથી)',
    colNatalSign: 'જન્મ રાશિ',
    mainChartsHeader: 'મુખ્ય ૫ વૈદિક ચાર્ટ અને વર્ગ કુંડળી પસંદગી',
    vargaSelectLabel: 'અન્ય ષોડશવર્ગ કુંડળી પસંદ કરો:',
    dashaChainTitle: 'વર્તમાન ૫-સ્તરીય સક્રિય દશા સ્રંખલા',
    dashaTimelineTitle: '૧૨૦-વર્ષીય સંપૂર્ણ વિંશોત્તરી દશા સમયરેખા',
    bhogyaText: 'જન્મ સમયે ભોગ્ય દશા:',
    activeNow: 'વર્તમાન સક્રિય',
    sadesatiTitle: 'શનિ સાડાસાતી અને નાની પનોતી (ઢૈયા) સમયરેખા',
    sadesatiSub: 'આયુષ્યભરની શનિ સાડાસાતી તબક્કા, સ્થિતિ અને ધાતુ પાયા કોષ્ટક.',
    colType: 'ગોચર પ્રકાર',
    colSaturnSign: 'શનિની રાશિ',
    colDates: 'પ્રારંભ તારીખ → અંત તારીખ',
    colStatus: 'વર્તમાન સ્થિતિ',
    colPaya: 'પાયા (ધાતુ)',
    planetPositionsTitle: 'ગ્રહ સ્પષ્ટ અંશ અને નક્ષત્ર પદ કોષ્ટક',
    colDegree: 'રાશિમાં અંશ',
    colNakshatraPada: 'નક્ષત્ર અને પદ',
    panchangTitle: 'જન્મ પંચાંગ વિગત',
    remediesTitle: 'અનુકૂળતા માર્ગદર્શિકા અને શુભ ઉપાય કોષ્ટક',
    bphsTitle: 'પરાશરી બળવાન અને નિર્બળ ગ્રહો વિશ્લેષણ (બૃહત્ પરાશર હોરા શાસ્ત્ર)',
    bphsSub: 'બૃહત્ પરાશર હોરા શાસ્ત્ર (અધ્યાય ૨૭) મુજબ ષડ્બળ (Virupas/Rupas), ઉચ્ચ/નીચ સ્થાન અને અસ્ત સ્થિતિનું ગણિત.',
    strongPlanetsTitle: 'બળવાન ગ્રહો (Balavan Grahas)',
    weakPlanetsTitle: 'નિર્બળ ગ્રહો (Nirbala Grahas)',
    noStrongPlanets: 'કોઈપણ ગ્રહ પરાશરી બળવાન માનદંડ સુધી પહોંચતો નથી.',
    noWeakPlanets: 'કોઈપણ નિર્બળ ગ્રહ નથી.',
    colShadbalaRupas: 'ષડ્બળ (રૂપઃ)',
    colRequiredRupas: 'જરૂરી (રૂપઃ)',
    colRatio: 'SMR ગુણોત્તર',
    colSthana: 'સ્થાન',
    colDig: 'દિગ્',
    colKala: 'કાલ',
    colCheshta: 'ચેષ્ટા',
    colNaisargika: 'નૈસર્ગિક',
    colDrik: 'દૃગ્',
    tithi: 'તિથિ',
    yoga: 'યોગ',
    karana: 'કરણ',
    mulank: 'મૂળાંક (Radical Number)',
    bhagyank: 'ભાગ્યાંક (Destiny Number)',
    friendlyNumbers: 'મિત્ર અંક',
    enemyNumbers: 'શત્રુ અંક',
    auspiciousYears: 'શુભ વર્ષ',
    auspiciousDays: 'શુભ વાર',
    auspiciousGemstone: 'શુભ રત્ન',
    subGemstone: 'ઉપ-રત્ન',
    fortuneGemstone: 'ભાગ્ય રત્ન',
    auspiciousDeity: 'ઇષ્ટદેવ / પૂજ્ય દેવ',
    auspiciousMetal: 'શુભ ધાતુ',
    auspiciousColor: 'શુભ રંગ',
    auspiciousDirection: 'શુભ દિશા',
    tabs: {
      gochar: '૦. લાઈવ ગોચર ઓવરલે',
      charts: '૧. કુંડળી ચાર્ટ્સ (મુખ્ય ૫ + વર્ગ)',
      dashas: '૨. વિંશોત્તરી દશા',
      sadesati: '૩. સાડાસાતી અને પનોતી',
      planets: '૪. ગ્રહ સ્થિતિ અને પરાશરી બળ વિશ્લેષણ',
      remedies: '૫. પંચાંગ અને ઉપાય',
    },
    chartNames: {
      d1: '૧. જન્મ લગ્ન કુંડળી (D1)',
      chalit: '૨. ભાવ ચાલિત કુંડળી',
      cusp: '૩. કસ્પ કુંડળી (KP Cusp)',
      moon: '૪. ચંદ્ર રાશિ કુંડળી',
      d9: '૫. નવાંશ કુંડળી (D9)',
    },
    statusMap: { Active: 'વર્તમાન સક્રિય', Completed: 'પૂર્ણ થયેલ', Upcoming: 'આવનારી' },
    payaMap: { Gold: 'સોનુ (Gold)', Silver: 'રૂપું (Silver)', Copper: 'તાંબુ (Copper)', Iron: 'લોઢું (Iron)' },
  },
  HI: {
    ganeshayNamah: '॥ श्री गणेशाय नमः ॥',
    home: 'मुख्य पृष्ठ',
    subTitle: 'वैदिक ज्योतिष गणना एवं परामर्श',
    printPdf: 'ग्राहक PDF प्रिंट करें',
    lagna: 'लग्न राशि',
    moonSign: 'चंद्र राशि',
    nakshatra: 'नक्षत्र',
    mahadasha: 'महादशा',
    gocharTitle: 'वर्तमान ग्रह गोचर ओवरले (लाइव गोचर)',
    gocharSub: 'जन्म ग्रहों के सापेक्ष वर्तमान गोचर ग्रहों की लाइव तुलना।',
    chartModeLabel: 'चार्ट मोड चुनें:',
    natalOnly: 'केवल जन्म ग्रह',
    gocharOnly: 'केवल वर्तमान गोचर',
    natalGocharBoth: 'जन्म + गोचर ओवरले',
    transitComparisonTitle: 'वर्तमान गोचर एवं जन्म ग्रह स्थिति तुलना तालिका',
    colPlanet: 'ग्रह',
    colTransitSign: 'गोचर राशि',
    colHouseLagna: 'भाव (लग्न से)',
    colHouseMoon: 'भाव (चंद्र से)',
    colNatalSign: 'जन्म राशि',
    mainChartsHeader: 'मुख्य 5 वैदिक चार्ट एवं वर्ग कुंडली चयन',
    vargaSelectLabel: 'अन्य षोडशवर्ग कुंडली चुनें:',
    dashaChainTitle: 'वर्तमान 5-स्तरीय सक्रिय दशा श्रृंखला',
    dashaTimelineTitle: '120-वर्षीय संपूर्ण विंशोत्तरी दशा समयरेखा',
    bhogyaText: 'जन्म समय भोग्य दशा:',
    activeNow: 'वर्तमान सक्रिय',
    sadesatiTitle: 'शनि साढ़ेसाती एवं छोटी पनौती (ढैय्या) समयरेखा',
    sadesatiSub: 'जीवनपर्यंत शनि गोचर, चरण, स्थिति एवं धातु पाया तालिका।',
    colType: 'गोचर प्रकार',
    colSaturnSign: 'शनि की राशि',
    colDates: 'प्रारंभ तिथि → अंत तिथि',
    colStatus: 'वर्तमान स्थिति',
    colPaya: 'पाया (धातु)',
    planetPositionsTitle: 'ग्रह स्पष्ट अंश एवं नक्षत्र पद तालिका',
    colDegree: 'राशि में अंश',
    colNakshatraPada: 'नक्षत्र एवं पद',
    panchangTitle: 'जन्म पंचांग विवरण',
    remediesTitle: 'अनुकूलता मार्गदर्शिका एवं शुभ उपाय तालिका',
    bphsTitle: 'पराशरी बलवान एवं दुर्बल ग्रह विश्लेषण (बृहत् पराशर होरा शास्त्र)',
    bphsSub: 'बृहत् पराशर होरा शास्त्र (अध्याय 27) अनुसार षड्बल (Virupas/Rupas), उच्च/नीच एवं अस्त स्थिति का गणित।',
    strongPlanetsTitle: 'बलवान ग्रह (Balavan Grahas)',
    weakPlanetsTitle: 'दुर्बल ग्रह (Nirbala Grahas)',
    noStrongPlanets: 'कोई भी ग्रह पराशरी बलवान मानक तक नहीं पहुंचता।',
    noWeakPlanets: 'कोई दुर्बल ग्रह नहीं है।',
    colShadbalaRupas: 'षड्बल (रूपः)',
    colRequiredRupas: 'आवश्यक (रूपः)',
    colRatio: 'SMR अनुपात',
    colSthana: 'स्थान',
    colDig: 'दिग्',
    colKala: 'काल',
    colCheshta: 'चेष्टा',
    colNaisargika: 'नैसर्गिक',
    colDrik: 'दृग्',
    tithi: 'तिथि',
    yoga: 'योग',
    karana: 'करण',
    mulank: 'मूलांक (Radical Number)',
    bhagyank: 'भाग्यांक (Destiny Number)',
    friendlyNumbers: 'मित्र अंक',
    enemyNumbers: 'शत्रु अंक',
    auspiciousYears: 'शुभ वर्ष',
    auspiciousDays: 'शुभ वार',
    auspiciousGemstone: 'शुभ रत्न',
    subGemstone: 'उप-रत्न',
    fortuneGemstone: 'भाग्य रत्न',
    auspiciousDeity: 'इष्टदेव / पूज्य देव',
    auspiciousMetal: 'शुभ धातु',
    auspiciousColor: 'शुभ रंग',
    auspiciousDirection: 'शुभ दिशा',
    tabs: {
      gochar: '0. लाइव गोचर ओवरले',
      charts: '1. कुंडली चार्ट्स (मुख्य 5 + वर्ग)',
      dashas: '2. विंशोत्तरी दशा',
      sadesati: '3. साढ़ेसाती एवं पनौती',
      planets: '4. ग्रह स्थिति एवं अंश',
      remedies: '5. पंचांग एवं उपाय',
    },
    chartNames: {
      d1: '1. जन्म लग्न कुंडली (D1)',
      chalit: '2. भाव चलित कुंडली',
      cusp: '3. कस्प कुंडली (KP Cusp)',
      moon: '4. चंद्र राशि कुंडली',
      d9: '5. नवांश कुंडली (D9)',
    },
    statusMap: { Active: 'वर्तमान सक्रिय', Completed: 'पूर्ण', Upcoming: 'आगामी' },
    payaMap: { Gold: 'सोना (Gold)', Silver: 'चांदी (Silver)', Copper: 'तांबा (Copper)', Iron: 'लोहा (Iron)' },
  },
};

export default function KundliReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [lang, setLang] = useState<Language>('GU');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [kundliData, setKundliData] = useState<any>(null);

  // Active Tab & State
  const [activeTab, setActiveTab] = useState<'gochar' | 'charts' | 'dashas' | 'sadesati' | 'planets' | 'remedies'>('gochar');
  const [overlayMode, setOverlayMode] = useState<'natal' | 'gochar' | 'both'>('both');
  const [selectedVarga, setSelectedVarga] = useState<string>('D2');

  // 5-Level Interactive Dasha Tree State
  const [expandedMdIndex, setExpandedMdIndex] = useState<number | null>(null);
  const [expandedAdKey, setExpandedAdKey] = useState<string | null>(null);
  const [expandedPdKey, setExpandedPdKey] = useState<string | null>(null);
  const [expandedSdKey, setExpandedSdKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchKundli = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/kundli?id=${id}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch Kundli report');
        }

        setKundliData(result);

        // Auto-expand active Dasha chain down to 5th level on load
        if (result.currentDashaChain && result.dasha?.mahadashas) {
          const chain = result.currentDashaChain;
          const mdIdx = result.dasha.mahadashas.findIndex(
            (md: any) => md.lord === chain.mahadasha.lord
          );
          if (mdIdx !== -1) {
            setExpandedMdIndex(mdIdx);
            const targetMd = result.dasha.mahadashas[mdIdx];
            const adIdx = targetMd.antardashas?.findIndex(
              (ad: any) => ad.lord === chain.antardasha.lord
            );
            if (adIdx !== undefined && adIdx !== -1) {
              const adKey = `${mdIdx}-${adIdx}`;
              setExpandedAdKey(adKey);

              const targetAd = targetMd.antardashas[adIdx];
              const pdIdx = targetAd.pratyantardashas?.findIndex(
                (pd: any) => pd.lord === chain.pratyantardasha.lord
              );
              if (pdIdx !== undefined && pdIdx !== -1) {
                const pdKey = `${mdIdx}-${adIdx}-${pdIdx}`;
                setExpandedPdKey(pdKey);

                const targetPd = targetAd.pratyantardashas[pdIdx];
                const sds = calculateSookshmadashas(
                  new Date(targetPd.startDate),
                  new Date(targetPd.endDate),
                  targetPd.lord
                );
                const sdIdx = sds.findIndex((sd) => sd.lord === chain.sookshmadasha.lord);
                if (sdIdx !== -1) {
                  setExpandedSdKey(`${mdIdx}-${adIdx}-${pdIdx}-${sdIdx}`);
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading Kundli report:', err);
        setError(err.message || 'Error loading Kundli report');
      } finally {
        setLoading(false);
      }
    };

    fetchKundli();
  }, [id]);

  const t = UI_TEXTS[lang];
  const getRashiName = (idx: number) => RASHI_NAMES[lang][idx % 12] || '';
  const getPlanetName = (name: string) => PLANET_NAMES[lang][name] || name;

  const formatDegStr = (deg: number) => {
    const degInSign = deg % 30;
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign % 1) * 60);
    const s = Math.floor((((degInSign % 1) * 60) % 1) * 60);
    return `${d}° ${m}' ${s}"`;
  };

  const formatDateShort = (dStr: any) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    return d.toLocaleDateString(lang === 'EN' ? 'en-GB' : 'gu-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleHomeClick = () => {
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-10 h-10 text-[#A14E15] animate-spin mx-auto stroke-[1.75]" />
          <p className="text-sm font-semibold text-stone-600">Loading Kundli details...</p>
        </div>
      </div>
    );
  }

  if (error || !kundliData) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center">
        <Card className="max-w-md w-full p-8 bg-white rounded-3xl border border-stone-200 shadow-lg space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto font-bold">!</div>
          <h2 className="text-lg font-bold text-stone-900">Unable to Load Kundli Report</h2>
          <p className="text-xs text-stone-500 font-medium">{error || 'Record does not exist'}</p>
          <Button onClick={handleHomeClick} className="w-full">{t.home}</Button>
        </Card>
      </div>
    );
  }

  const { client, astro, currentDashaChain, transits, currentGochar, vargasData, cuspPlacements } = kundliData;

  // Additional Selected Varga Chart Data
  const activeVargaInfo = vargasData?.[selectedVarga] || { lagnaSign: kundliData.lagnaSignIndex, placements: astro.planets };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 antialiased flex flex-col justify-between">
      
      {/* Top Sacred Chanting Bar - Center Top in small text size, single horizontal line without wrapping */}
      <div className="w-full bg-[#FAF6EE] border-b border-amber-200/60 py-1 text-center whitespace-nowrap overflow-hidden print:hidden">
        <span className="text-[11px] sm:text-xs font-bold text-[#A14E15] font-serif tracking-widest">
          {t.ganeshayNamah}
        </span>
      </div>

      {/* Navigation Header - Fixed 1 single horizontal bar on mobile & desktop */}
      <header className="bg-white border-b border-stone-200/60 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-xs print:hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={handleHomeClick}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-stone-100 transition-colors cursor-pointer text-stone-600 flex items-center gap-1 text-xs font-bold shrink-0"
            title={t.home}
          >
            <Home className="w-4 h-4 text-[#A14E15]" />
            <span className="hidden sm:inline">{t.home}</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-stone-900 truncate max-w-[90px] sm:max-w-xs">{client.name}</h1>
            <p className="hidden sm:block text-xs text-stone-500 font-medium truncate">{t.subTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* 3-Way Language Selector Switcher */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-stone-200/60 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-stone-300/60 shadow-2xs">
            {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  lang === l
                    ? 'bg-[#7A1C28] text-white shadow-xs'
                    : 'text-stone-700 hover:text-[#1F1E1B] hover:bg-stone-300/50'
                }`}
              >
                {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
              </button>
            ))}
          </div>

          <Button onClick={() => window.print()} variant="outline" size="sm" className="h-8 px-2 sm:px-3">
            <Printer className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">{t.printPdf}</span>
          </Button>
        </div>
      </header>

      {/* EXECUTIVE SUMMARY BANNER */}
      <div className="bg-white border-b border-stone-200/60 px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight">{client.name}</h2>
              <Badge variant="default" className="text-[10px] py-0.5 bg-[#7A1C28]">Vedic Kundli</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#A14E15]" />
                {client.birthDetails.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A14E15]" />
                {client.birthDetails.time} (IST +{client.birthDetails.tzOffset})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate max-w-[200px]" title={client.birthDetails.place}>
                <MapPin className="w-3.5 h-3.5 text-[#A14E15]" />
                {client.birthDetails.place}
              </span>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400 block">{t.lagna}</span>
              <span className="text-xs sm:text-sm font-extrabold text-stone-900">{getRashiName(kundliData.lagnaSignIndex)}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400 block">{t.moonSign}</span>
              <span className="text-xs sm:text-sm font-extrabold text-stone-900">{getRashiName(astro.planets.Moon.sign)}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400 block">{t.nakshatra}</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#A14E15] truncate max-w-[70px] sm:max-w-[100px] block mx-auto">
                {NAKSHATRA_NAMES[lang][Math.floor((astro.planets.Moon.longitude % 360) / (360 / 27))]}
              </span>
            </div>

            {currentDashaChain && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center">
                <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-800/70 block">{t.mahadasha}</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#A14E15]">{getPlanetName(currentDashaChain.mahadasha.lord)}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Bar (Pressable Sacred Pill Buttons) */}
      <nav className="bg-white border-b border-stone-200/80 sticky top-0 z-20 px-3 sm:px-6 py-2.5 overflow-x-auto scrollbar-none shadow-xs print:hidden">
        <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm font-bold max-w-6xl mx-auto items-center">
          {[
            { id: 'gochar', label: t.tabs.gochar },
            { id: 'charts', label: t.tabs.charts },
            { id: 'dashas', label: t.tabs.dashas },
            { id: 'sadesati', label: t.tabs.sadesati },
            { id: 'planets', label: t.tabs.planets },
            { id: 'remedies', label: t.tabs.remedies },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 sm:px-4 rounded-2xl whitespace-nowrap cursor-pointer transition-all duration-200 border-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] text-white border-amber-300 shadow-md shadow-amber-900/20 scale-105'
                    : 'bg-amber-50/70 text-stone-800 border-amber-200/80 hover:bg-amber-100/80 hover:border-amber-300 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        
        {/* TAB 0: LIVE GOCHAR OVERLAY */}
        <div className={activeTab === 'gochar' ? 'block' : 'hidden print:hidden'}>
          <div className="space-y-6">
            
            {/* Gochar Overlay Header Banner (Tagline removed) */}
            <div className="bg-[#FAF6EE] border-2 border-amber-300 rounded-3xl p-5 sm:p-6 relative space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#7A1C28] text-amber-100 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-extrabold text-[#59141D] tracking-tight">
                      {t.gocharTitle}
                    </h2>
                    <p className="text-xs text-stone-600 font-medium">{t.gocharSub}</p>
                  </div>
                </div>
              </div>

              {/* Overlay Toggle Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-amber-200/80">
                <span className="text-xs font-bold text-stone-700">{t.chartModeLabel}</span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-amber-300 self-start sm:self-auto">
                  <button
                    onClick={() => setOverlayMode('natal')}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      overlayMode === 'natal' ? 'bg-[#7A1C28] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {t.natalOnly}
                  </button>
                  <button
                    onClick={() => setOverlayMode('gochar')}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      overlayMode === 'gochar' ? 'bg-[#7A1C28] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {t.gocharOnly}
                  </button>
                  <button
                    onClick={() => setOverlayMode('both')}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      overlayMode === 'both' ? 'bg-[#7A1C28] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {t.natalGocharBoth}
                  </button>
                </div>
              </div>
            </div>

            {/* Chart + Gochar Table Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Overlay Chart */}
              <NorthIndianChart
                title={overlayMode === 'natal' ? t.chartNames.d1 : overlayMode === 'gochar' ? t.gocharTitle : t.natalGocharBoth}
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={overlayMode === 'gochar' ? currentGochar?.planets : astro.planets}
                overlayPlanetsMap={overlayMode === 'both' ? currentGochar?.planets : undefined}
                lang={lang}
              />

              {/* Transit vs Natal Planet Details Table */}
              {currentGochar && (
                <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
                  <div className="p-4 bg-stone-50/80 border-b border-stone-200/80">
                    <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#A14E15]" />
                      <span>{t.transitComparisonTitle}</span>
                    </h3>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[500px] text-xs text-left whitespace-nowrap">
                      <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80 text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="p-3">{t.colPlanet}</th>
                          <th className="p-3">{t.colTransitSign}</th>
                          <th className="p-3 text-center">{t.colHouseLagna}</th>
                          <th className="p-3 text-center">{t.colHouseMoon}</th>
                          <th className="p-3">{t.colNatalSign}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {Object.entries(currentGochar.planets).map(([pName, pObj]: [string, any]) => {
                          const natalP = astro.planets[pName];
                          return (
                            <tr key={pName} className="hover:bg-amber-50/20">
                              <td className="p-3 font-bold text-stone-900 text-sm">{getPlanetName(pName)}</td>
                              <td className="p-3 font-bold text-amber-800 text-sm">
                                {getRashiName(pObj.sign)} {pObj.isRetrograde ? '(વ)' : ''}
                              </td>
                              <td className="p-3 text-center font-bold text-stone-900 bg-amber-50/30">
                                {pObj.transitHouseFromLagna}
                              </td>
                              <td className="p-3 text-center font-bold text-[#A14E15] bg-stone-50/50">
                                {pObj.transitHouseFromMoon}
                              </td>
                              <td className="p-3 font-semibold text-stone-600 text-sm">
                                {natalP ? getRashiName(natalP.sign) : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

            </div>
          </div>
        </div>

        {/* TAB 1: 5 CORE CHARTS + SHODASHAVARGA SELECTOR */}
        <div className={activeTab === 'charts' ? 'block' : 'hidden print:block'}>
          <div className="space-y-8">
            
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900">{t.mainChartsHeader}</h3>
            </div>

            {/* Grid of 5 Basic Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              
              {/* Chart 1: Birth Lagna Chart (D1) */}
              <NorthIndianChart
                title={t.chartNames.d1}
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={astro.planets}
                lang={lang}
              />

              {/* Chart 2: Bhav Chalit Chart */}
              <NorthIndianChart
                title={t.chartNames.chalit}
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={cuspPlacements || astro.planets}
                lang={lang}
              />

              {/* Chart 3: KP Cusp Chart */}
              <NorthIndianChart
                title={t.chartNames.cusp}
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={cuspPlacements || astro.planets}
                lang={lang}
              />

              {/* Chart 4: Chandra Rashi Kundli (Moon Chart) */}
              <NorthIndianChart
                title={t.chartNames.moon}
                lagnaSign={astro.planets.Moon.sign}
                planetsMap={astro.planets}
                lang={lang}
              />

              {/* Chart 5: Navamsha Chart (D9) */}
              <NorthIndianChart
                title={t.chartNames.d9}
                lagnaSign={vargasData?.['D9']?.lagnaSign ?? kundliData.lagnaSignIndex}
                planetsMap={vargasData?.['D9']?.placements ?? astro.planets}
                lang={lang}
              />

            </div>

            {/* Additional Shodashavarga Dropdown Selector */}
            <Card className="p-5 sm:p-6 bg-white border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-stone-900">{t.vargaSelectLabel}</h4>
                  <p className="text-xs text-stone-500 font-medium">Select any of the 11 additional Parashari Varga charts.</p>
                </div>

                <select
                  value={selectedVarga}
                  onChange={(e) => setSelectedVarga(e.target.value)}
                  className="px-3.5 py-2 rounded-2xl bg-stone-100 border border-stone-300 font-bold text-xs sm:text-sm text-stone-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A14E15]"
                >
                  {['D2', 'D3', 'D4', 'D7', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'].map((code) => (
                    <option key={code} value={code}>
                      {VARGA_LABELS[lang][code] || code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center pt-2">
                <NorthIndianChart
                  title={VARGA_LABELS[lang][selectedVarga] || selectedVarga}
                  lagnaSign={activeVargaInfo.lagnaSign}
                  planetsMap={activeVargaInfo.placements}
                  lang={lang}
                />
              </div>
            </Card>

          </div>
        </div>

        {/* TAB 2: VIMSHOTTARI DASHA */}
        <div className={activeTab === 'dashas' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            
            {/* Current Active Dasha Hierarchy */}
            {currentDashaChain && (
              <Card className="space-y-4 bg-white border border-stone-200 shadow-xs p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">{t.dashaChainTitle}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">MahaDasha</span>
                    <span className="text-base font-bold text-[#A14E15] block mt-0.5">{getPlanetName(currentDashaChain.mahadasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.mahadasha.startDate)} — {formatDateShort(currentDashaChain.mahadasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Antra Dasha</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.antardasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.antardasha.startDate)} — {formatDateShort(currentDashaChain.antardasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pratyantra</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.pratyantardasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.pratyantardasha.startDate)} — {formatDateShort(currentDashaChain.pratyantardasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Sookshma</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.sookshmadasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.sookshmadasha.startDate)} — {formatDateShort(currentDashaChain.sookshmadasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pran Dasha</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.prandasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.prandasha.startDate)} — {formatDateShort(currentDashaChain.prandasha.endDate)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* 120-Year Vimshottari Timeline Accordion */}
            <Card className="space-y-4 p-5 sm:p-6 bg-white border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-stone-900">{t.dashaTimelineTitle}</h3>
                <Badge variant="secondary" className="font-mono text-xs self-start sm:self-auto">
                  {t.bhogyaText} {kundliData.dasha.bhogyaDasha.formatted}
                </Badge>
              </div>

              <div className="divide-y divide-stone-100">
                {kundliData.dasha.mahadashas.map((md: any, idx: number) => {
                  const isExpanded = expandedMdIndex === idx;
                  const isCurrent = currentDashaChain && currentDashaChain.mahadasha.lord === md.lord;

                  return (
                    <div key={idx} className="py-3.5 space-y-3">
                      {/* LEVEL 1: MAHADASHA */}
                      <div
                        onClick={() => setExpandedMdIndex(isExpanded ? null : idx)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border-2 ${
                          isCurrent
                            ? 'bg-amber-100/90 border-amber-400 text-[#59141D] shadow-xs'
                            : 'bg-stone-50/80 border-stone-200/80 hover:bg-amber-50/70 hover:border-amber-300 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-amber-200/80 font-extrabold text-xs flex items-center justify-center text-[#A14E15] shrink-0 border border-amber-300">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-extrabold text-sm sm:text-base block text-stone-900">
                              {getPlanetName(md.lord)} MahaDasha
                            </span>
                            <span className="text-xs text-stone-600 font-mono font-medium">
                              {formatDateShort(md.startDate)} → {formatDateShort(md.endDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCurrent && (
                            <Badge variant="default" className="bg-[#7A1C28] text-white text-[10px] font-bold px-2 py-0.5 shadow-2xs">
                              {t.activeNow}
                            </Badge>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                        </div>
                      </div>

                      {/* LEVEL 2: ANTARDASHAS */}
                      {isExpanded && md.antardashas && (
                        <div className="pl-3 sm:pl-6 space-y-2 pt-1 border-l-3 border-amber-300 ml-3 sm:ml-4">
                          <h4 className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                            <span>અંતરદશા (Antardashas under {getPlanetName(md.lord)})</span>
                            <span className="text-[10px] text-stone-400 font-normal">(Tap to view Pratyantardasha)</span>
                          </h4>
                          <div className="space-y-2">
                            {md.antardashas.map((ad: any, aIdx: number) => {
                              const adKey = `${idx}-${aIdx}`;
                              const isAdExpanded = expandedAdKey === adKey;
                              const isAdActive = currentDashaChain && currentDashaChain.antardasha.lord === ad.lord && isCurrent;

                              return (
                                <div key={aIdx} className="space-y-2">
                                  <div
                                    onClick={() => setExpandedAdKey(isAdExpanded ? null : adKey)}
                                    className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all text-xs ${
                                      isAdActive
                                        ? 'bg-amber-100 border-amber-400 font-bold text-[#59141D]'
                                        : 'bg-white border-stone-200 hover:bg-amber-50/60 text-stone-800'
                                    }`}
                                  >
                                    <div>
                                      <span className="font-bold text-sm block">
                                        {getPlanetName(ad.lord)} Antardasha
                                      </span>
                                      <span className="text-[11px] text-stone-600 font-mono">
                                        {formatDateShort(ad.startDate)} → {formatDateShort(ad.endDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isAdActive && (
                                        <span className="text-[10px] bg-[#7A1C28] text-white px-2 py-0.5 rounded-md font-bold">
                                          {t.activeNow}
                                        </span>
                                      )}
                                      {isAdExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
                                    </div>
                                  </div>

                                  {/* LEVEL 3: PRATYANTARDASHAS */}
                                  {isAdExpanded && ad.pratyantardashas && (
                                    <div className="pl-3 sm:pl-5 space-y-2 border-l-2 border-amber-400 ml-2.5">
                                      <h5 className="text-[10px] font-extrabold text-stone-600 uppercase tracking-wider">
                                        પ્રત્યંતર દશા (Pratyantardashas under {getPlanetName(ad.lord)})
                                      </h5>
                                      <div className="space-y-1.5">
                                        {ad.pratyantardashas.map((pd: any, pIdx: number) => {
                                          const pdKey = `${idx}-${aIdx}-${pIdx}`;
                                          const isPdExpanded = expandedPdKey === pdKey;
                                          const isPdActive = currentDashaChain && currentDashaChain.pratyantardasha.lord === pd.lord && isAdActive;

                                          const sookshmaList = isPdExpanded ? calculateSookshmadashas(new Date(pd.startDate), new Date(pd.endDate), pd.lord) : [];

                                          return (
                                            <div key={pIdx} className="space-y-1.5">
                                              <div
                                                onClick={() => setExpandedPdKey(isPdExpanded ? null : pdKey)}
                                                className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all text-xs ${
                                                  isPdActive
                                                    ? 'bg-amber-100/90 border-amber-400 font-bold text-[#59141D]'
                                                    : 'bg-stone-50 border-stone-200 hover:bg-amber-50/50 text-stone-800'
                                                }`}
                                              >
                                                <div>
                                                  <span className="font-bold text-xs block">
                                                    {getPlanetName(pd.lord)} Pratyantara
                                                  </span>
                                                  <span className="text-[10px] text-stone-500 font-mono">
                                                    {formatDateShort(pd.startDate)} → {formatDateShort(pd.endDate)}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                  {isPdActive && (
                                                    <span className="text-[9px] bg-[#7A1C28] text-white px-1.5 py-0.5 rounded-md font-bold">
                                                      {t.activeNow}
                                                    </span>
                                                  )}
                                                  {isPdExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                                                </div>
                                              </div>

                                              {/* LEVEL 4: SOOKSHMADASHAS */}
                                              {isPdExpanded && (
                                                <div className="pl-3 sm:pl-4 space-y-1.5 border-l-2 border-stone-300 ml-2">
                                                  <h6 className="text-[9px] font-extrabold text-stone-500 uppercase tracking-wider">
                                                    સૂક્ષ્મ દશા (Sookshmadashas under {getPlanetName(pd.lord)})
                                                  </h6>
                                                  <div className="space-y-1">
                                                    {sookshmaList.map((sd: any, sIdx: number) => {
                                                      const sdKey = `${idx}-${aIdx}-${pIdx}-${sIdx}`;
                                                      const isSdExpanded = expandedSdKey === sdKey;
                                                      const isSdActive = currentDashaChain && currentDashaChain.sookshmadasha.lord === sd.lord && isPdActive;

                                                      const pranaList = isSdExpanded ? calculatePranadashas(new Date(sd.startDate), new Date(sd.endDate), sd.lord) : [];

                                                      return (
                                                        <div key={sIdx} className="space-y-1">
                                                          <div
                                                            onClick={() => setExpandedSdKey(isSdExpanded ? null : sdKey)}
                                                            className={`p-2 rounded-md border flex items-center justify-between cursor-pointer transition-all text-[11px] ${
                                                              isSdActive
                                                                ? 'bg-amber-100 border-amber-300 font-bold text-[#59141D]'
                                                                : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                                                            }`}
                                                          >
                                                            <div>
                                                              <span className="font-bold block">
                                                                {getPlanetName(sd.lord)} Sookshma
                                                              </span>
                                                              <span className="text-[9px] text-stone-500 font-mono">
                                                                {formatDateShort(sd.startDate)} → {formatDateShort(sd.endDate)}
                                                              </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                              {isSdActive && (
                                                                <span className="text-[8px] bg-[#7A1C28] text-white px-1 py-0.5 rounded-xs font-bold">
                                                                  {t.activeNow}
                                                                </span>
                                                              )}
                                                              {isSdExpanded ? <ChevronUp className="w-3 h-3 text-stone-400" /> : <ChevronDown className="w-3 h-3 text-stone-400" />}
                                                            </div>
                                                          </div>

                                                          {/* LEVEL 5: PRANADASHAS */}
                                                          {isSdExpanded && (
                                                            <div className="pl-3 space-y-1 border-l border-amber-400 ml-1.5">
                                                              <span className="text-[9px] font-bold text-amber-900 block">
                                                                પ્રાણ દશા (Pranadashas under {getPlanetName(sd.lord)}):
                                                              </span>
                                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                                {pranaList.map((pr: any, prIdx: number) => {
                                                                  const isPrActive = currentDashaChain && currentDashaChain.prandasha.lord === pr.lord && isSdActive;
                                                                  return (
                                                                    <div
                                                                      key={prIdx}
                                                                      className={`p-1.5 rounded-md border text-[10px] flex items-center justify-between ${
                                                                        isPrActive
                                                                          ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-950 shadow-2xs'
                                                                          : 'bg-stone-50 border-stone-200/80 text-stone-600'
                                                                      }`}
                                                                    >
                                                                      <div>
                                                                        <span className="font-bold block">{getPlanetName(pr.lord)} Prana</span>
                                                                        <span className="text-[8px] font-mono block text-stone-500">
                                                                          {formatDateShort(pr.startDate)} - {formatDateShort(pr.endDate)}
                                                                        </span>
                                                                      </div>
                                                                      {isPrActive && (
                                                                        <span className="text-[8px] bg-emerald-700 text-white font-bold px-1 py-0.5 rounded-xs">
                                                                          ⚡ Active
                                                                        </span>
                                                                      )}
                                                                    </div>
                                                                  );
                                                                })}
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 3: SADE SATI & NANI PANOTI TIMELINE */}
        <div className={activeTab === 'sadesati' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6">
            <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
              <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#A14E15] shrink-0" />
                    <span>{t.sadesatiTitle}</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">{t.sadesatiSub}</p>
                </div>
              </div>

              {/* Sade Sati Table - Strict single line horizontal row per entry with overflow-x scroll */}
              <div className="overflow-x-auto w-full scrollbar-thin">
                <table className="w-full min-w-[640px] text-xs text-left whitespace-nowrap">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 sm:p-4">{t.colType}</th>
                      <th className="p-3.5 sm:p-4">{t.colSaturnSign}</th>
                      <th className="p-3.5 sm:p-4">{t.colDates}</th>
                      <th className="p-3.5 sm:p-4 text-center">{t.colStatus}</th>
                      <th className="p-3.5 sm:p-4 text-right">{t.colPaya}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {transits && transits.map((item: any, idx: number) => {
                      const isActive = item.status === 'Active';
                      const statusLabel = t.statusMap[item.status] || item.status;
                      const payaLabel = t.payaMap[item.paya] || item.paya;
                      return (
                        <tr key={idx} className={isActive ? 'bg-amber-100/60 font-bold' : 'hover:bg-stone-50'}>
                          <td className="p-3.5 sm:p-4 font-bold text-[#7A1C28]">
                            {item.type}
                            {item.sadesatiPhase && <span className="text-[10px] text-stone-500 font-normal ml-1">(Phase {item.sadesatiPhase})</span>}
                          </td>
                          <td className="p-3.5 sm:p-4 font-bold text-stone-900">{getRashiName(item.saturnSign)}</td>
                          <td className="p-3.5 sm:p-4 font-mono text-stone-700 text-xs">{formatDateShort(item.startDate)} → {formatDateShort(item.endDate)}</td>
                          <td className="p-3.5 sm:p-4 text-center">
                            <Badge variant={isActive ? 'default' : item.status === 'Completed' ? 'secondary' : 'outline'} className="whitespace-nowrap">
                              {statusLabel}
                            </Badge>
                          </td>
                          <td className="p-3.5 sm:p-4 text-right font-bold text-stone-800">{payaLabel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 4: PLANETARY POSITIONS & BPHS STRENGTHS */}
        <div className={activeTab === 'planets' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6">
            
            {/* UNIFIED BPHS PLANETARY STRENGTHS SECTION (STRONG & WEAK PLANETS TOGETHER) */}
            {kundliData.bphsStrengths && (
              <Card className="p-5 sm:p-6 bg-white border border-stone-200 shadow-xs space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#A14E15]" />
                    <span>{t.bphsTitle}</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">{t.bphsSub}</p>
                </div>

                {/* Unified Strong & Weak Section Under One Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Strong Planets (Balavan Grahas) */}
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{t.strongPlanetsTitle}</span>
                      </h4>
                      <Badge className="bg-emerald-700 text-white text-[10px]">
                        {kundliData.bphsStrengths.strongPlanets.length} {lang === 'EN' ? 'Planets' : 'ગ્રહો'}
                      </Badge>
                    </div>

                    {kundliData.bphsStrengths.strongPlanets.length === 0 ? (
                      <p className="text-xs text-stone-500 italic">{t.noStrongPlanets}</p>
                    ) : (
                      <div className="space-y-2.5">
                        {kundliData.bphsStrengths.strongPlanets.map((sp: any) => {
                          const pName = getPlanetName(sp.planet);
                          const signName = lang === 'EN' ? sp.signNameEN : lang === 'HI' ? sp.signNameHI : sp.signNameGU;
                          const dignityStr = lang === 'EN' ? sp.dignityFormattedEN : lang === 'HI' ? sp.dignityFormattedHI : sp.dignityFormattedGU;
                          const reasonStr = lang === 'EN' ? sp.bphsReasonEN : lang === 'HI' ? sp.bphsReasonHI : sp.bphsReasonGU;
                          return (
                            <div key={sp.planet} className="p-3 bg-white rounded-xl border border-emerald-200/70 text-xs space-y-1 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-stone-900 text-sm">{pName}</span>
                                <span className="font-mono font-bold text-emerald-700">
                                  {sp.totalRupas} Rupas ({Math.round(sp.shadbalaRatio * 100)}%)
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-600 font-medium">
                                <span>{signName} (House {sp.houseFromLagna})</span> • <span className="font-bold text-emerald-800">{dignityStr}</span>
                              </div>
                              <p className="text-[10px] text-stone-500 leading-normal">{reasonStr}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Weak Planets (Nirbala Grahas) */}
                  <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-rose-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>{t.weakPlanetsTitle}</span>
                      </h4>
                      <Badge variant="destructive" className="bg-rose-700 text-white text-[10px]">
                        {kundliData.bphsStrengths.weakPlanets.length} {lang === 'EN' ? 'Planets' : 'ગ્રહો'}
                      </Badge>
                    </div>

                    {kundliData.bphsStrengths.weakPlanets.length === 0 ? (
                      <p className="text-xs text-stone-500 italic">{t.noWeakPlanets}</p>
                    ) : (
                      <div className="space-y-2.5">
                        {kundliData.bphsStrengths.weakPlanets.map((wp: any) => {
                          const pName = getPlanetName(wp.planet);
                          const signName = lang === 'EN' ? wp.signNameEN : lang === 'HI' ? wp.signNameHI : wp.signNameGU;
                          const dignityStr = lang === 'EN' ? wp.dignityFormattedEN : lang === 'HI' ? wp.dignityFormattedHI : wp.dignityFormattedGU;
                          const reasonStr = lang === 'EN' ? wp.bphsReasonEN : lang === 'HI' ? wp.bphsReasonHI : wp.bphsReasonGU;
                          return (
                            <div key={wp.planet} className="p-3 bg-white rounded-xl border border-rose-200/70 text-xs space-y-1 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-stone-900 text-sm">{pName}</span>
                                <span className="font-mono font-bold text-rose-700">
                                  {wp.totalRupas} Rupas ({Math.round(wp.shadbalaRatio * 100)}%)
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-600 font-medium">
                                <span>{signName} (House {wp.houseFromLagna})</span> • <span className="font-bold text-rose-800">{dignityStr}</span>
                              </div>
                              <p className="text-[10px] text-stone-500 leading-normal">{reasonStr}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* 6-Fold Parashari Shadbala Table */}
                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider mb-3">
                    BPHS 6-Fold Shadbala Breakdown Table (in Rupas)
                  </h4>
                  <div className="overflow-x-auto w-full scrollbar-thin">
                    <table className="w-full min-w-[600px] text-xs text-left whitespace-nowrap">
                      <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80 text-[11px] uppercase tracking-wider">
                        <tr>
                          <th className="p-3">{t.colPlanet}</th>
                          <th className="p-3">{t.colSthana}</th>
                          <th className="p-3">{t.colDig}</th>
                          <th className="p-3">{t.colKala}</th>
                          <th className="p-3">{t.colCheshta}</th>
                          <th className="p-3">{t.colNaisargika}</th>
                          <th className="p-3">{t.colDrik}</th>
                          <th className="p-3 text-center">{t.colShadbalaRupas}</th>
                          <th className="p-3 text-center">{t.colRequiredRupas}</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {kundliData.bphsStrengths.allPlanets.map((p: any) => {
                          const pName = getPlanetName(p.planet);
                          const statusLabel = lang === 'EN' ? p.statusFormattedEN : lang === 'HI' ? p.statusFormattedHI : p.statusFormattedGU;
                          return (
                            <tr key={p.planet} className={p.isStrongBphs ? 'hover:bg-emerald-50/20' : 'bg-rose-50/30 hover:bg-rose-50/50'}>
                              <td className="p-3 font-bold text-stone-900">{pName}</td>
                              <td className="p-3 font-mono">{(p.sthanaBala / 60).toFixed(2)}</td>
                              <td className="p-3 font-mono">{(p.digBala / 60).toFixed(2)}</td>
                              <td className="p-3 font-mono">{(p.kalaBala / 60).toFixed(2)}</td>
                              <td className="p-3 font-mono">{(p.cheshtaBala / 60).toFixed(2)}</td>
                              <td className="p-3 font-mono">{(p.naisargikaBala / 60).toFixed(2)}</td>
                              <td className="p-3 font-mono">{(p.drikBala / 60).toFixed(2)}</td>
                              <td className="p-3 text-center font-extrabold font-mono text-stone-900">{p.totalRupas}</td>
                              <td className="p-3 text-center font-mono text-stone-500">{p.requiredRupas}</td>
                              <td className="p-3 text-center">
                                <Badge variant={p.isStrongBphs ? 'default' : 'destructive'} className={p.isStrongBphs ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}>
                                  {statusLabel}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            )}

            {/* Planetary Positions & Degree Details Table */}
            <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
              <div className="p-4 bg-stone-50/80 border-b border-stone-200/80">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#A14E15]" />
                  <span>{t.planetPositionsTitle}</span>
                </h3>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-xs text-left whitespace-nowrap">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 sm:p-4">{t.colPlanet}</th>
                      <th className="p-3.5 sm:p-4">{t.colTransitSign}</th>
                      <th className="p-3.5 sm:p-4">{t.colDegree}</th>
                      <th className="p-3.5 sm:p-4">{t.colNakshatraPada}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {astro && astro.planets && Object.entries(astro.planets).map(([pName, pObj]: [string, any]) => {
                      const nakIdx = Math.floor((pObj.longitude % 360) / (360 / 27));
                      const pada = Math.floor(((pObj.longitude % 360) % (360 / 27)) / (360 / 108)) + 1;
                      return (
                        <tr key={pName} className="hover:bg-amber-50/20">
                          <td className="p-3.5 sm:p-4 font-bold text-stone-900 text-sm">
                            {getPlanetName(pName)} {pObj.isRetrograde ? '(વ)' : ''}
                          </td>
                          <td className="p-3.5 sm:p-4 font-bold text-[#A14E15] text-sm">
                            {getRashiName(pObj.sign)}
                          </td>
                          <td className="p-3.5 sm:p-4 font-mono text-stone-700">
                            {formatDegStr(pObj.longitude)}
                          </td>
                          <td className="p-3.5 sm:p-4 text-stone-800 font-semibold">
                            {NAKSHATRA_NAMES[lang][nakIdx]} (Pada {pada})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 5: PANCHANG & REMEDIES */}
        <div className={activeTab === 'remedies' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6">
            
            {/* Birth Panchanga */}
            <Card className="space-y-4 p-5 sm:p-6 bg-white border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-900">{t.panchangTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.tithi}</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.tithi.formatted || kundliData.panchanga.tithi.name}</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.nakshatra}</span>
                  <span className="font-bold text-stone-900 text-base">
                    {kundliData.panchanga.nakshatra.formatted || kundliData.panchanga.nakshatra.name} (Pada {Math.floor(((astro.planets.Moon.longitude % 360) % 13.333) / 3.333) + 1})
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.yoga}</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.yoga.formatted || kundliData.panchanga.yoga.name}</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.karana}</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.karana.formatted || kundliData.panchanga.karana.name}</span>
                </div>
              </div>
            </Card>

            {/* Remedies & Numerology */}
            <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-sm text-stone-900">{t.remediesTitle}</h3>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-xs text-left whitespace-nowrap">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                    <tr>
                      <th className="p-3.5 sm:p-4">Astrological Parameter</th>
                      <th className="p-3.5 sm:p-4 text-right">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {[
                      { k: t.mulank, v: kundliData.shubha.mulank },
                      { k: t.bhagyank, v: kundliData.shubha.bhagyank },
                      { k: t.friendlyNumbers, v: kundliData.shubha.friendlyNumbers },
                      { k: t.enemyNumbers, v: kundliData.shubha.enemyNumbers },
                      { k: t.auspiciousYears, v: kundliData.shubha.auspiciousYears },
                      { k: t.auspiciousDays, v: kundliData.shubha.auspiciousDays },
                      { k: t.auspiciousGemstone, v: kundliData.shubha.gemstone },
                      { k: t.subGemstone, v: kundliData.shubha.subGemstone },
                      { k: t.fortuneGemstone, v: kundliData.shubha.fortuneGemstone },
                      { k: t.auspiciousDeity, v: kundliData.shubha.deity },
                      { k: t.auspiciousMetal, v: kundliData.shubha.metal },
                      { k: t.auspiciousColor, v: kundliData.shubha.color },
                      { k: t.auspiciousDirection, v: kundliData.shubha.direction },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/20">
                        <td className="p-3.5 sm:p-4 font-semibold text-stone-600">{item.k}</td>
                        <td className="p-3.5 sm:p-4 font-bold text-stone-900 text-sm text-right">{item.v || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
}
