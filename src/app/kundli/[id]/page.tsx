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
  ArrowLeft,
  RefreshCw,
  Award,
  BookOpen,
  Compass,
  FileText,
  Loader2,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Home,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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
    'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
    'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती'
  ],
};

const PLANET_NAMES: Record<Language, Record<string, string>> = {
  EN: {
    Sun: 'Sun',
    Moon: 'Moon',
    Mars: 'Mars',
    Mercury: 'Mercury',
    Jupiter: 'Jupiter',
    Venus: 'Venus',
    Saturn: 'Saturn',
    Rahu: 'Rahu',
    Ketu: 'Ketu',
  },
  GU: {
    Sun: 'સૂર્ય',
    Moon: 'ચંદ્ર',
    Mars: 'મંગળ',
    Mercury: 'બુધ',
    Jupiter: 'ગુરુ',
    Venus: 'શુક્ર',
    Saturn: 'શનિ',
    Rahu: 'રાહુ',
    Ketu: 'કેતુ',
  },
  HI: {
    Sun: 'सूर्य',
    Moon: 'चंद्र',
    Mars: 'मंगल',
    Mercury: 'बुध',
    Jupiter: 'गुरु',
    Venus: 'शुक्र',
    Saturn: 'शनि',
    Rahu: 'राहु',
    Ketu: 'केतु',
  },
};

const PAGE_TRANSLATIONS: Record<Language, {
  home: string;
  reportSuffix: string;
  subtitle: string;
  print: string;
  lagna: string;
  moonSign: string;
  nakshatra: string;
  mahadasha: string;
  gurujiGocharTitle: string;
  gurujiGocharBadge: string;
  gurujiGocharSub: string;
  tabs: {
    gochar: string;
    charts: string;
    dashas: string;
    planets: string;
    dosha: string;
    panchanga: string;
    remedies: string;
  };
  chartTitles: {
    lagna: string;
    chandra: string;
    navamsha: string;
    chalit: string;
  };
  dashaTitle: string;
  dashaTimelineTitle: string;
  planetTable: {
    title: string;
    colPlanet: string;
    colStatus: string;
    colSign: string;
    colDeg: string;
    colNakshatra: string;
    direct: string;
    retrograde: string;
  };
  dosha: {
    manglikTitle: string;
    manglikPresent: string;
    manglikAbsent: string;
    manglikPresentDesc: string;
    manglikAbsentDesc: string;
    sadeSatiTitle: string;
    sadeSatiBadge: string;
    sadeSatiDesc: string;
    panotiTitle: string;
    panotiBadge: string;
    colType: string;
    colSign: string;
    colDates: string;
    colStatus: string;
    colPaya: string;
  };
  panchanga: {
    title: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
  };
  remedies: {
    title: string;
    colParam: string;
    colRec: string;
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
  };
}> = {
  EN: {
    home: 'Home',
    reportSuffix: "'s Kundli Report",
    subtitle: 'Vedic Astrology Digital Analysis',
    print: 'Print Complete Report',
    lagna: 'Lagna',
    moonSign: 'Moon Sign',
    nakshatra: 'Nakshatra',
    mahadasha: 'MahaDasha',
    gurujiGocharTitle: 'Current Planetary Transits (Live Gochar)',
    gurujiGocharBadge: 'Guruji Private View • Live Timestamp',
    gurujiGocharSub: 'Real-time planetary transits calculated for consultation. Excluded from customer PDF.',
    tabs: {
      gochar: '0. Live Gochar (Guruji)',
      charts: '1. Kundli Charts',
      dashas: '2. Vimshottari Dasha',
      planets: '3. Planetary Positions',
      dosha: '4. Sade Sati & Panoti',
      panchanga: '5. Panchanga & Cusps',
      remedies: '6. Remedies & Strengths',
    },
    chartTitles: {
      lagna: 'Lagna Chart (Birth Kundli)',
      chandra: 'Chandra Kundli (Moon Chart)',
      navamsha: 'Navamsha Chart (D9)',
      chalit: 'Bhav Chalit Chart (Cusps)',
    },
    dashaTitle: 'Current Active Dasha Hierarchy',
    dashaTimelineTitle: '120-Year Vimshottari Dasha Timeline',
    planetTable: {
      title: 'Planetary Positions & Degrees Table',
      colPlanet: 'Planet',
      colStatus: 'Status',
      colSign: 'Zodiac Sign',
      colDeg: 'Degrees',
      colNakshatra: 'Nakshatra & Pada',
      direct: 'Direct',
      retrograde: 'Retrograde (R)',
    },
    dosha: {
      manglikTitle: 'Manglik Dosha Status',
      manglikPresent: 'Present',
      manglikAbsent: 'Not Present',
      manglikPresentDesc: 'Mars is placed in House {house}. Specific Vedic shanti remedies and gemstone alignment are recommended.',
      manglikAbsentDesc: 'Mars is safely placed. No primary Manglik affliction detected in Lagna chart.',
      sadeSatiTitle: 'Saturn Sade Sati Chronological Timeline',
      sadeSatiBadge: '7.5 Years Transit',
      sadeSatiDesc: 'Lifetime Saturn transit timeline computed for Moon Sign ({sign}).',
      panotiTitle: 'Nani Panoti (Dhaiya) Timeline',
      panotiBadge: '2.5 Years Transit',
      colType: 'Transit Type',
      colSign: 'Saturn Sign',
      colDates: 'Transit Dates',
      colStatus: 'Current Status',
      colPaya: 'Paya (Metal)',
    },
    panchanga: {
      title: 'Birth Panchanga Details',
      tithi: 'Tithi',
      nakshatra: 'Nakshatra',
      yoga: 'Yoga',
      karana: 'Karana',
    },
    remedies: {
      title: 'Auspicious Guide & Astrological Remedies Table',
      colParam: 'Astrological Parameter',
      colRec: 'Auspicious Value / Recommendation',
      mulank: 'Radical Number (Mulank)',
      bhagyank: 'Destiny Number (Bhagyank)',
      friendlyNumbers: 'Friendly Numbers',
      enemyNumbers: 'Enemy Numbers',
      auspiciousYears: 'Auspicious Years',
      auspiciousDays: 'Auspicious Days',
      auspiciousGemstone: 'Auspicious Gemstone',
      subGemstone: 'Sub-gemstone',
      fortuneGemstone: 'Fortune Gemstone',
      auspiciousDeity: 'Auspicious Deity',
      auspiciousMetal: 'Auspicious Metal',
      auspiciousColor: 'Auspicious Color',
      auspiciousDirection: 'Auspicious Direction',
    },
  },
  GU: {
    home: 'મુખ્ય પૃષ્ઠ',
    reportSuffix: ' ની જન્મ કુંડળી વિશ્લેષણ',
    subtitle: 'વૈદિક જ્યોતિષ ગણતરી અને પરામર્શ',
    print: 'સંપૂર્ણ કુંડળી પ્રિન્ટ કરો',
    lagna: 'લગ્ન રાશિ',
    moonSign: 'ચંદ્ર રાશિ',
    nakshatra: 'નક્ષત્ર',
    mahadasha: 'મહાદશા',
    gurujiGocharTitle: 'વર્તમાન ગ્રહ ગોચર (લાઈવ ટ્રાન્ઝિટ)',
    gurujiGocharBadge: 'ગુરુજી પરામર્શ હેતુ • લાઈવ સમય',
    gurujiGocharSub: 'ગુરુજી માટે વર્તમાન સમયની ગોચર ગ્રહ સ્થિતિ. આ માહિતી ગ્રાહક PDF પ્રિન્ટમાં સમાવિષ્ટ નથી.',
    tabs: {
      gochar: '૦. લાઈવ ગોચર (ગુરુજી)',
      charts: '૧. જન્મ કુંડળી ચાર્ટ',
      dashas: '૨. વિંશોત્તરી દશા સ્રંખલા',
      planets: '૩. ગ્રહ સ્થિતિ અને અંશ',
      dosha: '૪. સાડાસાતી અને પનોતી',
      panchanga: '૫. જન્મ પંચાંગ વિગત',
      remedies: '૬. શુભ અંક અને ઉપાય',
    },
    chartTitles: {
      lagna: 'લગ્ન કુંડળી (જન્મ ચાર્ટ)',
      chandra: 'ચંદ્ર કુંડળી (Moon Chart)',
      navamsha: 'નવાંશ કુંડળી (D9 Chart)',
      chalit: 'ભાવ ચાલિત કુંડળી (Chalit)',
    },
    dashaTitle: 'વર્તમાન ૫-સ્તરીય દશા સ્રંખલા',
    dashaTimelineTitle: '૧૨૦-વર્ષીય સંપૂર્ણ વિંશોત્તરી દશા સમયરેખા',
    planetTable: {
      title: 'ગ્રહ સ્થિતિ, રાશિ અને અંશ કોષ્ટક',
      colPlanet: 'ગ્રહ',
      colStatus: 'સ્થિતિ',
      colSign: 'રાશિ',
      colDeg: 'અંશ (Degrees)',
      colNakshatra: 'નક્ષત્ર અને પદ',
      direct: 'માર્ગી (Direct)',
      retrograde: 'વક્રી (Retrograde)',
    },
    dosha: {
      manglikTitle: 'મંગળ દોષ સ્થિતિ',
      manglikPresent: 'મંગળ દોષ હાજર',
      manglikAbsent: 'મંગળ દોષ નથી',
      manglikPresentDesc: 'મંગળ ગ્રહ {house} મા ભાવમાં સ્થિત છે. મંગળ શાંતિ ઉપાય અને પ્રામાણિક પૂજા અર્ચના સલાહભર્યું છે.',
      manglikAbsentDesc: 'મંગળ ગ્રહ અનુકૂળ સ્થાન પર છે. જન્મ કુંડળીમાં મુખ્ય મંગળ દોષ નથી.',
      sadeSatiTitle: 'શનિ સાડાસાતી સંપૂર્ણ સમયરેખા',
      sadeSatiBadge: '૭.૫ વર્ષ ગોચર',
      sadeSatiDesc: 'ચંદ્ર રાશિ ({sign}) પર આધારિત શનિ ગોચર અને સાડાસાતી સમયરેખા.',
      panotiTitle: 'નાની પનોતી (ઢૈયા) સમયરેખા',
      panotiBadge: '૨.૫ વર્ષ ગોચર',
      colType: 'ગોચર પ્રકાર',
      colSign: 'શનિની રાશિ',
      colDates: 'સમયગાળો',
      colStatus: 'વર્તમાન સ્થિતિ',
      colPaya: 'પાયા (ધાતુ)',
    },
    panchanga: {
      title: 'જન્મ સમયનું પંચાંગ વિગત',
      tithi: 'તિથિ',
      nakshatra: 'નક્ષત્ર',
      yoga: 'યોગ',
      karana: 'કરણ',
    },
    remedies: {
      title: 'શુભ અંક, રત્ન અને ઉપાય કોષ્ટક',
      colParam: 'જ્યોતિષીય પરિમાણ',
      colRec: 'શુભ મૂલ્ય / માર્ગદર્શન',
      mulank: 'મુળાંક (Radical Number)',
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
    },
  },
  HI: {
    home: 'मुख्य पृष्ठ',
    reportSuffix: ' की जन्म कुंडली विश्लेषण',
    subtitle: 'वैदिक ज्योतिष गणना एवं परामर्श',
    print: 'संपूर्ण कुंडली प्रिंट करें',
    lagna: 'लग्न राशि',
    moonSign: 'चंद्र राशि',
    nakshatra: 'नक्षत्र',
    mahadasha: 'महादशा',
    gurujiGocharTitle: 'वर्तमान ग्रह गोचर (लाइव गोचर)',
    gurujiGocharBadge: 'गुरुजी परामर्श हेतु • लाइव समय',
    gurujiGocharSub: 'गुरुजी के लिए वर्तमान समय की गोचर ग्रह स्थिति। यह जानकारी ग्राहक PDF में शामिल नहीं है।',
    tabs: {
      gochar: '0. लाइव गोचर (गुरुजी)',
      charts: '1. जन्म कुंडली चार्ट',
      dashas: '2. विंशोत्तरी दशा श्रृंखला',
      planets: '3. ग्रह स्थिति एवं अंश',
      dosha: '4. साढ़ेसाती एवं पनौती',
      panchanga: '5. जन्म पंचांग विवरण',
      remedies: '6. शुभ अंक एवं उपाय',
    },
    chartTitles: {
      lagna: 'लग्न कुंडली (जन्म चार्ट)',
      chandra: 'चंद्र कुंडली (Moon Chart)',
      navamsha: 'नवांश कुंडली (D9 Chart)',
      chalit: 'भाव चलित कुंडली (Chalit)',
    },
    dashaTitle: 'वर्तमान 5-स्तरीय दशा श्रृंखला',
    dashaTimelineTitle: '120-वर्षीय संपूर्ण विंशोत्तरी दशा समयरेखा',
    planetTable: {
      title: 'ग्रह स्थिति, राशि एवं अंश तालिका',
      colPlanet: 'ग्रह',
      colStatus: 'स्थिति',
      colSign: 'राशि',
      colDeg: 'अंश (Degrees)',
      colNakshatra: 'नक्षत्र एवं पद',
      direct: 'मार्गी (Direct)',
      retrograde: 'वक्र (Retrograde)',
    },
    dosha: {
      manglikTitle: 'मंगल दोष स्थिति',
      manglikPresent: 'मंगल दोष उपस्थित',
      manglikAbsent: 'मंगल दोष नहीं',
      manglikPresentDesc: 'मंगल ग्रह {house} वें भाव में स्थित है। मंगल शांति उपाय अनुशंसित हैं।',
      manglikAbsentDesc: 'मंगल ग्रह अनुकूल स्थान पर है। लग्न कुंडली में मुख्य मंगल दोष नहीं है।',
      sadeSatiTitle: 'शनि साढ़ेसाती संपूर्ण समयरेखा',
      sadeSatiBadge: '7.5 वर्ष गोचर',
      sadeSatiDesc: 'चंद्र राशि ({sign}) पर आधारित शनि गोचर एवं साढ़ेसाती समयरेखा।',
      panotiTitle: 'छोटी पनौती (ढैय्या) समयरेखा',
      panotiBadge: '2.5 वर्ष गोचर',
      colType: 'गोचर प्रकार',
      colSign: 'शनि की राशि',
      colDates: 'समय अवधि',
      colStatus: 'वर्तमान स्थिति',
      colPaya: 'पाया (धातु)',
    },
    panchanga: {
      title: 'जन्म समय का पंचांग विवरण',
      tithi: 'तिथि',
      nakshatra: 'नक्षत्र',
      yoga: 'योग',
      karana: 'करण',
    },
    remedies: {
      title: 'शुभ अंक, रत्न एवं उपाय तालिका',
      colParam: 'ज्योतिषीय पैरामीटर',
      colRec: 'शुभ मूल्य / मार्गदर्शन',
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
    },
  }
};

export default function KundliReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [lang, setLang] = useState<Language>('GU');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [kundliData, setKundliData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'gochar' | 'charts' | 'dashas' | 'planets' | 'dosha' | 'panchanga' | 'remedies'>('gochar');
  const [expandedMdIndex, setExpandedMdIndex] = useState<number | null>(0);

  const t = PAGE_TRANSLATIONS[lang];

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
      } catch (err: any) {
        console.error('Error loading Kundli report:', err);
        setError(err.message || 'Error loading Kundli report');
      } finally {
        setLoading(false);
      }
    };

    fetchKundli();
  }, [id]);

  const getRashiName = (idx: number) => RASHI_NAMES[lang][idx % 12] || '';
  const getPlanetName = (name: string) => PLANET_NAMES[lang][name] || name;

  const formatDegStr = (deg: number) => {
    const degInSign = deg % 30;
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign % 1) * 60);
    const s = Math.floor((((degInSign % 1) * 60) % 1) * 60);
    return `${d}° ${m}' ${s}"`;
  };

  const getNakshatraInfo = (deg: number) => {
    const nakIdx = Math.floor((deg % 360) / (360 / 27));
    const pada = Math.floor(((deg % 360) % (360 / 27)) / (360 / 108)) + 1;
    const nakName = NAKSHATRA_NAMES[lang][nakIdx];
    return `${nakName} (Pada ${pada})`;
  };

  const formatDateShort = (dStr: any) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#A14E15] animate-spin mx-auto stroke-[1.75]" />
          <p className="text-sm font-semibold text-stone-600">Calculating Astronomical Ephemeris Chart...</p>
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
          <Button onClick={handleHomeClick} className="w-full">Return Home</Button>
        </Card>
      </div>
    );
  }

  const { client, astro, currentDashaChain, transits, d9Lagna, currentGochar } = kundliData;

  // Manglik Check (Mars in House 1, 4, 7, 8, 12)
  const marsSign = astro.planets.Mars.sign;
  const lagnaSign = kundliData.lagnaSignIndex;
  const marsHouse = ((marsSign - lagnaSign + 12) % 12) + 1;
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 antialiased flex flex-col justify-between">
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-stone-200/60 px-6 py-3.5 flex justify-between items-center shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-2xl hover:bg-stone-100 transition-colors cursor-pointer text-stone-600 flex items-center gap-1.5 text-xs font-bold"
            title="Go to Home Page"
          >
            <Home className="w-4 h-4 text-[#A14E15]" />
            <span>{t.home}</span>
          </button>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">{client.name}{t.reportSuffix}</h1>
            <p className="text-xs text-stone-500 font-medium">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 3-Way Language Selector Switcher */}
          <div className="flex items-center gap-1 bg-stone-200/60 p-1 rounded-2xl border border-stone-300/60 shadow-2xs">
            {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  lang === l
                    ? 'bg-[#7A1C28] text-white shadow-xs'
                    : 'text-stone-700 hover:text-[#1F1E1B] hover:bg-stone-300/50'
                }`}
              >
                {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
              </button>
            ))}
          </div>

          <Button onClick={() => window.print()} variant="outline" size="sm">
            <Printer className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">{t.print}</span>
          </Button>
        </div>
      </header>

      {/* 1. COMPACT EXECUTIVE SUMMARY BANNER */}
      <div className="bg-white border-b border-stone-200/60 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">{client.name}</h2>
              <Badge variant="default" className="text-[10px] py-0.5">Vedic Kundli</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 font-medium">
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

          {/* Quick First-Eye Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">{t.lagna}</span>
              <span className="text-sm font-extrabold text-stone-900">{getRashiName(kundliData.lagnaSignIndex)}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">{t.moonSign}</span>
              <span className="text-sm font-extrabold text-stone-900">{getRashiName(astro.planets.Moon.sign)}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">{t.nakshatra}</span>
              <span className="text-sm font-extrabold text-[#A14E15] truncate max-w-[100px] block">
                {NAKSHATRA_NAMES[lang][Math.floor((astro.planets.Moon.longitude % 360) / (360 / 27))]}
              </span>
            </div>

            {currentDashaChain && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2 text-center">
                <span className="text-[9px] uppercase font-bold text-amber-800/70 block">{t.mahadasha}</span>
                <span className="text-sm font-extrabold text-[#A14E15]">{getPlanetName(currentDashaChain.mahadasha.lord)}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Navigation Bar (Tabs) */}
      <nav className="bg-white border-b border-stone-200/60 sticky top-0 z-20 px-6 overflow-x-auto scrollbar-none shadow-xs print:hidden">
        <div className="flex gap-6 text-sm font-semibold max-w-6xl mx-auto">
          {[
            { id: 'gochar', label: t.tabs.gochar },
            { id: 'charts', label: t.tabs.charts },
            { id: 'dashas', label: t.tabs.dashas },
            { id: 'planets', label: t.tabs.planets },
            { id: 'dosha', label: t.tabs.dosha },
            { id: 'panchanga', label: t.tabs.panchanga },
            { id: 'remedies', label: t.tabs.remedies },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 relative whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isActive ? 'text-[#A14E15] font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A14E15] rounded-full shadow-[0_0_8px_rgba(161,78,21,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-10">
        
        {/* TAB 0: GURUJI PRIVATE LIVE GOCHAR SECTION (વર્તમાન ગ્રહ ગોચર) */}
        <div className={activeTab === 'gochar' ? 'block' : 'hidden print:hidden'}>
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-[#FAF6EE] border-2 border-amber-300 rounded-3xl p-6 relative space-y-2 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#7A1C28] text-amber-100 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#59141D] tracking-tight">
                      {t.gurujiGocharTitle}
                    </h2>
                    <p className="text-xs text-stone-600 font-medium">{t.gurujiGocharSub}</p>
                  </div>
                </div>

                <Badge variant="default" className="bg-[#7A1C28] text-white px-3 py-1 text-xs self-start sm:self-auto shadow-2xs">
                  <Lock className="w-3 h-3 mr-1" />
                  {t.gurujiGocharBadge}
                </Badge>
              </div>

              {currentGochar && (
                <div className="pt-2 text-[11px] font-mono text-amber-950/80 flex items-center gap-2 border-t border-amber-200/80 mt-3">
                  <Clock className="w-3.5 h-3.5 text-[#A14E15]" />
                  <span>Calculated at: {new Date(currentGochar.calculatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</span>
                </div>
              )}
            </div>

            {/* Live Gochar Planets Table */}
            {currentGochar && (
              <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
                <div className="p-4 bg-stone-50/80 border-b border-stone-200/80 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#A14E15]" />
                    <span>વર્તમાન ગોચર ગ્રહ કોષ્ટક (Current Live Transits)</span>
                  </h3>
                  <span className="text-xs text-stone-500 font-mono font-medium">Sidereal Lahiri Ayanamsa</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Planet</th>
                        <th className="p-3.5">Transit Status</th>
                        <th className="p-3.5">Current Rashi</th>
                        <th className="p-3.5">Exact Degree</th>
                        <th className="p-3.5">Nakshatra & Pada</th>
                        <th className="p-3.5 text-center">House from Lagna</th>
                        <th className="p-3.5 text-center">House from Moon</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {Object.entries(currentGochar.planets).map(([pName, pObj]: [string, any]) => (
                        <tr key={pName} className="hover:bg-amber-50/20">
                          <td className="p-3.5 font-bold text-stone-900 text-sm">{getPlanetName(pName)}</td>
                          <td className="p-3.5">
                            <Badge variant={pObj.isRetrograde ? 'destructive' : 'emerald'}>
                              {pObj.isRetrograde ? 'વક્રી (R)' : 'માર્ગી (Direct)'}
                            </Badge>
                          </td>
                          <td className="p-3.5 font-bold text-[#A14E15] text-sm">{getRashiName(pObj.sign)}</td>
                          <td className="p-3.5 font-mono text-stone-800 text-xs">{formatDegStr(pObj.longitude)}</td>
                          <td className="p-3.5 text-stone-700 text-xs">
                            {NAKSHATRA_NAMES[lang][pObj.nakshatraIdx]} (Pada {pObj.pada})
                          </td>
                          <td className="p-3.5 text-center font-bold text-stone-900 bg-amber-50/30">
                            {pObj.transitHouseFromLagna} મો ભાવ
                          </td>
                          <td className="p-3.5 text-center font-bold text-[#A14E15] bg-stone-50/50">
                            {pObj.transitHouseFromMoon} મો ભાવ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* TAB 1: KUNDLI CHARTS */}
        <div className={activeTab === 'charts' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">{t.tabs.charts}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <NorthIndianChart
                title={t.chartTitles.lagna}
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={astro.planets}
                lang={lang}
              />

              <NorthIndianChart
                title={t.chartTitles.chandra}
                lagnaSign={astro.planets.Moon.sign}
                planetsMap={astro.planets}
                lang={lang}
              />

              <NorthIndianChart
                title={t.chartTitles.navamsha}
                lagnaSign={kundliData.d9Lagna}
                planetsMap={kundliData.d9Placements}
                lang={lang}
              />

              <NorthIndianChart
                title={t.chartTitles.chalit}
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={kundliData.cuspPlacements}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* TAB 2: VIMSHOTTARI DASHA */}
        <div className={activeTab === 'dashas' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">{t.tabs.dashas}</h2>
            </div>

            {/* Current Active Dasha Hierarchy */}
            {currentDashaChain && (
              <Card className="space-y-4 bg-white border border-stone-200 shadow-xs p-6">
                <h3 className="text-base font-bold text-stone-900">{t.dashaTitle}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">MahaDasha</span>
                    <span className="text-base font-bold text-[#A14E15] block mt-0.5">{getPlanetName(currentDashaChain.mahadasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.mahadasha.startDate)} — {formatDateShort(currentDashaChain.mahadasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Antra Dasha</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.antardasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.antardasha.startDate)} — {formatDateShort(currentDashaChain.antardasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pratyantra</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.pratyantardasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.pratyantardasha.startDate)} — {formatDateShort(currentDashaChain.pratyantardasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Sookshma</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{getPlanetName(currentDashaChain.sookshmadasha.lord)}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.sookshmadasha.startDate)} — {formatDateShort(currentDashaChain.sookshmadasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
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
            <Card className="space-y-4 p-6 bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">{t.dashaTimelineTitle}</h3>
                <Badge variant="secondary" className="font-mono text-xs">
                  Bhogya: {kundliData.dasha.bhogyaDasha.formatted}
                </Badge>
              </div>

              <div className="divide-y divide-stone-100">
                {kundliData.dasha.mahadashas.map((md: any, idx: number) => {
                  const isExpanded = expandedMdIndex === idx;
                  const isCurrent = currentDashaChain && currentDashaChain.mahadasha.lord === md.lord;

                  return (
                    <div key={idx} className="py-3.5 space-y-3">
                      <div
                        onClick={() => setExpandedMdIndex(isExpanded ? null : idx)}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-amber-100/70 border border-amber-300 text-[#59141D]'
                            : 'hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-amber-200/60 font-bold text-xs flex items-center justify-center text-[#A14E15]">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-extrabold text-sm block">
                              {getPlanetName(md.lord)} MahaDasha
                            </span>
                            <span className="text-xs text-stone-500 font-mono">
                              {formatDateShort(md.startDate)} → {formatDateShort(md.endDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <Badge variant="default" className="bg-[#7A1C28] text-white text-[10px]">
                              Active Now
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-stone-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Antardashas */}
                      {isExpanded && md.antardashas && (
                        <div className="pl-6 pr-2 space-y-2 pt-1 border-l-2 border-amber-200/80 ml-4">
                          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Antardashas under {getPlanetName(md.lord)}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {md.antardashas.map((ad: any, aIdx: number) => {
                              const isAdActive = currentDashaChain && currentDashaChain.antardasha.lord === ad.lord && isCurrent;
                              return (
                                <div
                                  key={aIdx}
                                  className={`p-2.5 rounded-xl border text-xs ${
                                    isAdActive
                                      ? 'bg-amber-100 border-amber-400 font-bold text-[#59141D]'
                                      : 'bg-stone-50 border-stone-200/70 text-stone-700'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{getPlanetName(ad.lord)}</span>
                                    {isAdActive && <span className="text-[9px] bg-[#7A1C28] text-white px-1.5 py-0.5 rounded-md">Active</span>}
                                  </div>
                                  <span className="text-[10px] text-stone-500 font-mono block mt-1">
                                    {formatDateShort(ad.startDate)} - {formatDateShort(ad.endDate)}
                                  </span>
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

        {/* TAB 3: PLANETARY POSITIONS */}
        <div className={activeTab === 'planets' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">{t.tabs.planets}</h2>
            </div>

            <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-sm text-stone-900">
                  {t.planetTable.title}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                    <tr>
                      <th className="p-4">{t.planetTable.colPlanet}</th>
                      <th className="p-4">{t.planetTable.colStatus}</th>
                      <th className="p-4">{t.planetTable.colSign}</th>
                      <th className="p-4">{t.planetTable.colDeg}</th>
                      <th className="p-4">{t.planetTable.colNakshatra}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {Object.entries(astro.planets).map(([pName, pObj]: [string, any]) => (
                      <tr key={pName} className="hover:bg-amber-50/20">
                        <td className="p-4 font-bold text-stone-900 text-sm">{getPlanetName(pName)}</td>
                        <td className="p-4">
                          <Badge variant={pObj.isRetrograde ? 'destructive' : 'emerald'}>
                            {pObj.isRetrograde ? t.planetTable.retrograde : t.planetTable.direct}
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold text-[#A14E15] text-sm">{getRashiName(pObj.sign)}</td>
                        <td className="p-4 font-mono text-stone-800 text-sm">{formatDegStr(pObj.longitude)}</td>
                        <td className="p-4 text-stone-700 text-sm">{getNakshatraInfo(pObj.longitude)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 4: SADE SATI & NANI PANOTI CHRONOLOGICAL TIMELINE */}
        <div className={activeTab === 'dosha' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">{t.tabs.dosha}</h2>
            </div>

            {/* Manglik Dosha Card */}
            <Card className="space-y-3 p-6 bg-white border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${isManglik ? 'text-amber-600' : 'text-emerald-600'}`} />
                  <h3 className="font-bold text-stone-900 text-base">{t.dosha.manglikTitle}</h3>
                </div>
                <Badge variant={isManglik ? 'default' : 'emerald'}>
                  {isManglik ? t.dosha.manglikPresent : t.dosha.manglikAbsent}
                </Badge>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {isManglik
                  ? t.dosha.manglikPresentDesc.replace('{house}', marsHouse.toString())
                  : t.dosha.manglikAbsentDesc}
              </p>
            </Card>

            {/* Sade Sati & Nani Panoti Chronological Timeline */}
            <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
              <div className="p-4 bg-stone-50/80 border-b border-stone-200/80 flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A14E15]" />
                  <span>{t.dosha.sadeSatiTitle} ({getRashiName(astro.planets.Moon.sign)})</span>
                </h3>
                <Badge variant="secondary">{t.dosha.sadeSatiBadge}</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">{t.dosha.colType}</th>
                      <th className="p-4">{t.dosha.colSign}</th>
                      <th className="p-4">{t.dosha.colDates}</th>
                      <th className="p-4 text-center">{t.dosha.colStatus}</th>
                      <th className="p-4 text-right">{t.dosha.colPaya}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {transits && transits.map((item: any, idx: number) => {
                      const isActive = item.status === 'Active';
                      const isSadeSati = item.type === 'સાડાસાતી';

                      return (
                        <tr key={idx} className={isActive ? 'bg-amber-100/60 font-bold' : 'hover:bg-stone-50'}>
                          <td className="p-4 font-bold">
                            <span className={isSadeSati ? 'text-[#7A1C28]' : 'text-amber-900'}>
                              {item.type}
                            </span>
                            {item.sadesatiPhase && (
                              <span className="text-[10px] text-stone-500 block font-normal">
                                Phase {item.sadesatiPhase} ({item.sadesatiPhase === 1 ? '12th House' : item.sadesatiPhase === 2 ? '1st House (Janma)' : '2nd House'})
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-stone-900">{getRashiName(item.saturnSign)}</td>
                          <td className="p-4 font-mono text-stone-700 text-xs">
                            {formatDateShort(item.startDate)} → {formatDateShort(item.endDate)}
                          </td>
                          <td className="p-4 text-center">
                            <Badge
                              variant={
                                item.status === 'Active'
                                  ? 'default'
                                  : item.status === 'Completed'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {item.status === 'Active' ? 'ACTIVE NOW' : item.status === 'Completed' ? 'Completed' : 'Upcoming'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right font-bold text-stone-800">
                            {item.paya} (Paya)
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

        {/* TAB 5: PANCHANGA & HOUSE CUSPS */}
        <div className={activeTab === 'panchanga' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">{t.tabs.panchanga}</h2>
            </div>

            <Card className="space-y-4 p-6 bg-white border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-900">{t.panchanga.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.panchanga.tithi}</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.tithi.formatted || kundliData.panchanga.tithi.name}</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.panchanga.nakshatra}</span>
                  <span className="font-bold text-stone-900 text-base">
                    {kundliData.panchanga.nakshatra.formatted || kundliData.panchanga.nakshatra.name} (Pada {Math.floor(((astro.planets.Moon.longitude % 360) % 13.333) / 3.333) + 1})
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.panchanga.yoga}</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.yoga.formatted || kundliData.panchanga.yoga.name}</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1">
                  <span className="text-xs text-stone-500 font-semibold block">{t.panchanga.karana}</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.karana.formatted || kundliData.panchanga.karana.name}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 6: REMEDIES & STRENGTHS */}
        <div className={activeTab === 'remedies' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">{t.tabs.remedies}</h2>
            </div>

            <Card className="p-0 overflow-hidden bg-white border border-stone-200 shadow-xs">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-sm text-stone-900">
                  {t.remedies.title}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                    <tr>
                      <th className="p-4">{t.remedies.colParam}</th>
                      <th className="p-4 text-right">{t.remedies.colRec}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {[
                      { k: t.remedies.mulank, v: kundliData.shubha.mulank },
                      { k: t.remedies.bhagyank, v: kundliData.shubha.bhagyank },
                      { k: t.remedies.friendlyNumbers, v: kundliData.shubha.friendlyNumbers },
                      { k: t.remedies.enemyNumbers, v: kundliData.shubha.enemyNumbers },
                      { k: t.remedies.auspiciousYears, v: kundliData.shubha.auspiciousYears },
                      { k: t.remedies.auspiciousDays, v: kundliData.shubha.auspiciousDays },
                      { k: t.remedies.auspiciousGemstone, v: kundliData.shubha.gemstone },
                      { k: t.remedies.subGemstone, v: kundliData.shubha.subGemstone },
                      { k: t.remedies.fortuneGemstone, v: kundliData.shubha.fortuneGemstone },
                      { k: t.remedies.auspiciousDeity, v: kundliData.shubha.deity },
                      { k: t.remedies.auspiciousMetal, v: kundliData.shubha.metal },
                      { k: t.remedies.auspiciousColor, v: kundliData.shubha.color },
                      { k: t.remedies.auspiciousDirection, v: kundliData.shubha.direction },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/20">
                        <td className="p-4 font-semibold text-stone-600">{item.k}</td>
                        <td className="p-4 font-bold text-stone-900 text-sm text-right">{item.v || '-'}</td>
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
