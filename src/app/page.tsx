'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/shadcn/button';
import { Card } from '../components/ui/shadcn/card';
import { Badge } from '../components/ui/shadcn/badge';
import { GURU_SERVICES, ServiceItem } from '../lib/services';
import {
  Globe,
  Sparkles,
  User,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  BookOpen,
  MessageSquare,
  Check,
  UserCheck,
  Briefcase,
  Heart,
  TrendingUp,
  Users,
  GraduationCap,
  Sun,
  HelpCircle,
  Award,
} from 'lucide-react';

type Language = 'EN' | 'GU' | 'HI';

interface PracticeItem {
  title: string;
}

interface CategoryItem {
  label: string;
  desc?: string;
  iconName: 'Briefcase' | 'Heart' | 'TrendingUp' | 'Users' | 'GraduationCap' | 'Sparkles' | 'Sun';
}

const TRANSLATIONS: Record<Language, {
  ganeshayNamah: string;
  title: string;
  subtitle: string;
  guru30YrBox: string;
  heroHeading: string;
  heroParagraph: string;
  heroNote: string;
  practicesTitle: string;
  practicesList: PracticeItem[];
  categoriesTitle: string;
  categories: CategoryItem[];
  servicesBannerTitle: string;
  servicesRibbon: { title: string; desc: string }[];
  priceTag: string;
  bookNow: string;
  step0Title: string;
  step0Subtitle: string;
}> = {
  EN: {
    ganeshayNamah: '॥ Shree Ganeshay Namah ॥',
    title: 'Shree Ganeshambika Jyotish',
    subtitle: 'Vedic Astrology Consultation & Upasana Wisdom',
    guru30YrBox: 'For over 30 years, Guruji has guided individuals and families through Vedic astrology, mantra sadhana, and traditional spiritual wisdom.',
    heroHeading: 'Behind every consultation is decades of mantra sadhana, scriptural study, meditation, and guidance received through a traditional Guru–Shishya parampara.',
    heroParagraph: 'For Narendragiri Goswami Ji, astrology is not merely a profession, it is the culmination of years of spiritual practice, mantra sadhana, and traditional learning.',
    heroNote: 'These disciplines were undertaken under the guidance of his Guru within the traditional Guru–Shishya lineage and continue to inform Narendragiri Goswami Ji\'s spiritual practice today.',
    practicesTitle: 'Sacred Upasana & Siddhi',
    practicesList: [
      { title: 'Shaakta Upasak' },
      { title: 'Hanuman Upasak' },
      { title: 'Bhairav Upasak' },
      { title: 'Karna Pishachini Upasak' },
    ],
    categoriesTitle: 'Areas Where Guidance is Available',
    categories: [
      { label: 'Career & Profession', desc: 'Job promotions, business growth & career transitions', iconName: 'Briefcase' },
      { label: 'Marriage & Relationship', desc: 'Kundli matching, delay in marriage & marital peace', iconName: 'Heart' },
      { label: 'Business & Financial Wealth', desc: 'Business expansion, trade decisions & financial stability', iconName: 'TrendingUp' },
      { label: 'Family & Home Peace', desc: 'Family harmony, property & domestic peace', iconName: 'Users' },
      { label: 'Education & Higher Studies', desc: 'Academic success, higher studies & concentration', iconName: 'GraduationCap' },
      { label: 'Health & Vitality', desc: 'Wellbeing, stress reduction & vital remedies', iconName: 'Sparkles' },
      { label: 'Spiritual Remedies & Puja', desc: 'Mantra sadhana, Grah Shanti & authentic remedies', iconName: 'Sun' },
    ],
    servicesBannerTitle: 'Available Consultations',
    servicesRibbon: [
      { title: 'Kundli Reading', desc: 'Birth chart & Dasha reading' },
      { title: 'Personal Consultation', desc: '1-on-1 direct phone/video' },
      { title: 'Additional Questions', desc: 'Targeted specific queries' },
    ],
    priceTag: 'FEES STARTING AT ₹250 ONLY',
    bookNow: 'BOOK CONSULTATION NOW',
    step0Title: 'Choose Your Consultation Option',
    step0Subtitle: 'Select your consultation category to proceed with sacred dakshina offering & payment.',
  },
  GU: {
    ganeshayNamah: '॥ શ્રી ગણેશાય નમઃ ॥',
    title: 'શ્રી ગણેશામ્બિકા જ્યોતિષ',
    subtitle: 'વૈદિક જ્યોતિષ પરામર્શ અને આધ્યાત્મિક સાધના',
    guru30YrBox: '૩૦ થી વધુ વર્ષોથી, ગુરુજી વૈદિક જ્યોતિષ, મંત્ર સાધના અને પરંપરાગત આધ્યાત્મિક જ્ઞાન દ્વારા અનેક પરિવારોને સાચી દિશા બતાવી રહ્યા છે.',
    heroHeading: 'દરેક પરામર્શ પાછળ દાયકાઓની મંત્ર સાધના, શાસ્ત્ર અભ્યાસ, ધ્યાન અને પરંપરાગત ગુરુ-શિષ્ય પરંપરા દ્વારા પ્રાપ્ત માર્ગદર્શન છે.',
    heroParagraph: 'નરેન્દ્રગિરી ગોસ્વામી જી માટે, જ્યોતિષ એ માત્ર એક વ્યવસાય નથી, તે વર્ષોની આધ્યાત્મિક સાધના, મંત્ર જાપ અને પ્રામાણિક જ્ઞાનનું પવિત્ર ફળ છે.',
    heroNote: 'આ તમામ સાધનાઓ તેમણે પોતાના ગુરુજીના પવિત્ર માર્ગદર્શન હેઠળ ગુરુ-શિષ્ય પરંપરામાં સંપાદિત કરી છે અને આજે પણ તેમની સાધનાનો મુખ્ય આધાર છે.',
    practicesTitle: 'પવિત્ર ઉપાસના અને સિદ્ધિ',
    practicesList: [
      { title: 'શાક્ત ઉપાસક' },
      { title: 'હનુમાન ઉપાસક' },
      { title: 'ભૈરવ ઉપાસક' },
      { title: 'કર્ણ પિશાચિની ઉપાસક' },
    ],
    categoriesTitle: 'પરામર્શ માટેના મુખ્ય ક્ષેત્રો',
    categories: [
      { label: 'કારકિર્દી અને વ્યવસાય', desc: 'નોકરી, પ્રમોશન અને વ્યાપાર વૃદ્ધિ', iconName: 'Briefcase' },
      { label: 'લગ્ન જીવન અને સગાઈ', desc: 'કુંડળી મેળપ, લગ્નમાં વિલંબ અને સુખી દંપતી જીવન', iconName: 'Heart' },
      { label: 'વ્યાપાર અને આર્થિક સમૃદ્ધિ', desc: 'વ્યાપાર વિકાસ અને નાણાકીય સ્થિરતા', iconName: 'TrendingUp' },
      { label: 'પરિવાર અને ગૃહ શાંતિ', desc: 'કૌટુંબિક સુમેળ અને સંપત્તિ વિવાદ નિવારણ', iconName: 'Users' },
      { label: 'શિક્ષણ અને ઉચ્ચ અભ્યાસ', desc: 'અભ્યાસમાં સફળતા અને વિદેશ અભ્યાસ', iconName: 'GraduationCap' },
      { label: 'સ્વાસ્થ્ય અને નિવારણ', desc: 'શારીરિક અને માનસિક શાંતિ માટે વૈદિક ઉપાય', iconName: 'Sparkles' },
      { label: 'આધ્યાત્મિક ઉપાય અને પૂજા', desc: 'શાસ્ત્રોક્ત મંત્ર સાધના અને ગ્રહ શાંતિ ઉપાય', iconName: 'Sun' },
    ],
    servicesBannerTitle: 'ઉપલબ્ધ પરામર્શ વિકલ્પો',
    servicesRibbon: [
      { title: 'કુંડળી જોવાના', desc: 'સંપૂર્ણ જન્મ કુંડળી વિશ્લેષણ' },
      { title: 'વ્યક્તિગત પરામર્શ', desc: '૩૦ મિનિટ ફોન/વીડિયો કૉલ' },
      { title: 'વધારાના પ્રશ્નો', desc: 'ચોક્કસ શંકાઓનું સમાધાન' },
    ],
    priceTag: 'દક્ષિણા માત્ર ₹૨૫૦ થી શરૂ',
    bookNow: 'અત્યારે જ પરામર્શ બુક કરો',
    step0Title: 'તમારું પરામર્શ ફોર્મેટ પસંદ કરો',
    step0Subtitle: 'દક્ષિણા અર્પણ અને ચૂકવણી સાથે આગળ વધવા માટે તમારો પરામર્શ વિકલ્પ પસંદ કરો.',
  },
  HI: {
    ganeshayNamah: '॥ श्री गणेशाय नमः ॥',
    title: 'श्री गणेशाम्बिका ज्योतिष',
    subtitle: 'वैदिक ज्योतिष परामर्श एवं आध्यात्मिक साधना',
    guru30YrBox: '30 से अधिक वर्षों से, गुरुजी वैदिक ज्योतिष, मंत्र साधना एवं पारंपरिक आध्यात्मिक ज्ञान द्वारा परिवारों को सही दिशा दिखा रहे हैं।',
    heroHeading: 'प्रत्येक परामर्श के पीछे दशकों की मंत्र साधना, शास्त्र अध्ययन, ध्यान एवं पारंपरिक गुरु-शिष्य परंपरा द्वारा प्राप्त मार्गदर्शन है।',
    heroParagraph: 'नरेन्द्रगिरि गोस्वामी जी के लिए, ज्योतिष केवल एक व्यवसाय नहीं है, यह वर्षों की आध्यात्मिक साधना, मंत्र जप एवं प्रामाणिक ज्ञान का पवित्र फल है।',
    heroNote: 'ये सभी साधनाएँ उन्होंने अपने गुरुजी के पवित्र मार्गदर्शन में पारंपरिक गुरु-शिष्य परंपरा के अंतर्गत संपन्न की हैं और आज भी उनकी साधना का मुख्य आधार हैं।',
    practicesTitle: 'पवित्र उपासना एवं सिद्धि',
    practicesList: [
      { title: 'शक्ति उपासक' },
      { title: 'हनुमान उपासक' },
      { title: 'भैरव उपासक' },
      { title: 'कर्ण पिशाचिनी उपासक' },
    ],
    categoriesTitle: 'मार्गदर्शन हेतु प्रमुख क्षेत्र',
    categories: [
      { label: 'करियर एवं व्यवसाय', desc: 'नौकरी, पदोन्नति एवं व्यापार वृद्धि', iconName: 'Briefcase' },
      { label: 'विवाह एवं संबंध', desc: 'कुंडली मिलान, विवाह में विलंब एवं सुखी दाम्पत्य', iconName: 'Heart' },
      { label: 'व्यापार एवं आर्थिक समृद्धि', desc: 'व्यापार विस्तार एवं वित्तीय स्थिरता', iconName: 'TrendingUp' },
      { label: 'परिवार एवं गृह शांति', desc: 'पारिवारिक सामंजस्य एवं संपत्ति विवाद समाधान', iconName: 'Users' },
      { label: 'शिक्षा एवं उच्च अध्ययन', desc: 'शैक्षणिक सफलता एवं उच्च शिक्षा', iconName: 'GraduationCap' },
      { label: 'स्वास्थ्य एवं निवारण', desc: 'मानसिक शांति एवं उत्तम स्वास्थ्य हेतु उपाय', iconName: 'Sparkles' },
      { label: 'आध्यात्मिक उपाय एवं पूजा', desc: 'मंत्र साधना, ग्रह शांति एवं प्रामाणिक शास्त्रीय उपाय', iconName: 'Sun' },
    ],
    servicesBannerTitle: 'उपलब्ध परामर्श विकल्प',
    servicesRibbon: [
      { title: 'कुंडली देखना', desc: 'जन्म कुंडली एवं ग्रह फल' },
      { title: 'व्यक्तिगत परामर्श', desc: '30 मिनट सीधा कॉल' },
      { title: 'अतिरिक्त प्रश्न', desc: 'विशिष्ट शंका समाधान' },
    ],
    priceTag: 'दक्षिणा मात्र ₹250 से प्रारंभ',
    bookNow: 'अभी परामर्श बुक करें',
    step0Title: 'अपना परामर्श विकल्प चुनें',
    step0Subtitle: 'दक्षिणा अर्पित करने एवं भुगतान के साथ आगे बढ़ने के लिए अपना परामर्श विकल्प चुनें।',
  }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('GU');

  const pricingScrollRef = useRef<HTMLDivElement>(null);
  const [selectedPlanTab, setSelectedPlanTab] = useState<number>(1);
  const t = TRANSLATIONS[lang];
  const plansRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    if (plansRef.current) {
      plansRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    router.push(`/pay/${service.id}`);
  };

  // Pricing Scroll & Pill Sync
  const scrollToPlanIndex = (idx: number) => {
    setSelectedPlanTab(idx);
    if (pricingScrollRef.current) {
      const container = pricingScrollRef.current;
      const cardWidth = container.clientWidth;
      container.scrollTo({
        left: cardWidth * idx,
        behavior: 'smooth',
      });
    }
  };

  const handlePricingScroll = () => {
    if (pricingScrollRef.current) {
      const container = pricingScrollRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth;
      const activeIdx = Math.round(scrollLeft / cardWidth);
      if (activeIdx >= 0 && activeIdx < GURU_SERVICES.length && activeIdx !== selectedPlanTab) {
        setSelectedPlanTab(activeIdx);
      }
    }
  };

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 stroke-[1.75]" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 stroke-[1.75]" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 stroke-[1.75]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 stroke-[1.75]" />;
    }
  };

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#853E0F]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#853E0F]" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-[#853E0F]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#853E0F]" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#853E0F]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#853E0F]" />;
      case 'Sun': return <Sun className="w-5 h-5 text-[#853E0F]" />;
      default: return <Sparkles className="w-5 h-5 text-[#853E0F]" />;
    }
  };

  const getServiceTitle = (s: ServiceItem) => {
    if (lang === 'HI') return s.titleHI;
    if (lang === 'GU') return s.titleGU;
    return s.titleEN;
  };

  const getServiceDesc = (s: ServiceItem) => {
    if (lang === 'HI') return s.descHI;
    if (lang === 'GU') return s.descGU;
    return s.descEN;
  };

  const getServiceFeatures = (s: ServiceItem) => {
    if (lang === 'HI') return s.featuresHI;
    if (lang === 'GU') return s.featuresGU;
    return s.featuresEN;
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1F1E1B] font-sans selection:bg-amber-100 antialiased">
      
      {/* Serene Navigation Header with Centered Title & 3-Way Language Switcher Directly Below */}
      <header className="w-full bg-[#FAF6EE] border-b border-amber-200/70 relative z-10 px-4 py-3.5 flex flex-col items-center text-center gap-2.5 shadow-2xs">
        
        {/* Sacred Chanting Header */}
        <span className="text-[12px] sm:text-[13px] font-bold text-[#A14E15] font-serif tracking-widest">
          {t.ganeshayNamah}
        </span>

        {/* Full-Width Centered Title & Subtitle */}
        <div className="w-full max-w-xl mx-auto space-y-0.5">
          <h1 className="text-[18px] sm:text-[22px] md:text-[24px] font-extrabold tracking-tight text-[#59141D] leading-tight w-full">
            {t.title}
          </h1>
          <p className="text-[11px] sm:text-[13px] text-stone-600 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Centered 3-Way Language Selector Switcher Pill directly below */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl border border-stone-300/70 shadow-2xs">
          {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                lang === l
                  ? 'bg-[#7A1C28] text-white shadow-xs scale-[1.02]'
                  : 'text-stone-700 hover:text-[#1F1E1B] hover:bg-stone-300/50'
              }`}
            >
              {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
            </button>
          ))}
        </div>

      </header>

      {/* 1. TRILINGUAL POSTER HERO SECTION (FULL WEBSITE WIDTH) */}
      <section className="w-full text-center cursor-pointer relative" onClick={scrollToPlans}>
        <div className="w-full relative overflow-hidden group">
          <img
            src={lang === 'HI' ? '/images/posters/poster-hi.png' : lang === 'GU' ? '/images/posters/poster-gu.png' : '/images/posters/poster-en.png'}
            alt={`Shree Ganeshambika Jyotish - ${lang} Poster`}
            className="w-full h-auto object-cover block select-none transition-opacity duration-300"
          />

          {/* Interactive Tap/Click Overlay Banner at bottom of poster */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-8 flex flex-col items-center justify-end text-white">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                scrollToPlans();
              }}
              className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-black px-10 py-4 text-base sm:text-lg shadow-2xl rounded-2xl cursor-pointer"
            >
              <span>{t.bookNow} (₹250)</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TEXT DETAILS SECTION (BELOW POSTER) */}
      <section className="py-10 px-4 sm:px-8 max-w-5xl mx-auto space-y-8">
        
        {/* Sacred Om Bio Box */}
        <div className="bg-[#FFFDF9] border-2 border-amber-300/90 rounded-3xl p-6 sm:p-10 relative space-y-5 shadow-md">
          <div className="hidden sm:block absolute top-5 right-6 text-amber-700/20 font-serif text-6xl font-black select-none">
            ॐ
          </div>

          <p className="text-[16px] sm:text-[18px] font-bold text-[#59141D] leading-relaxed border-b border-amber-200/90 pb-4">
            {t.guru30YrBox}
          </p>

          <div className="space-y-4">
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#421218] leading-snug">
              {t.heroHeading}
            </h3>

            <p className="text-[14px] sm:text-[16px] text-stone-800 leading-relaxed font-normal">
              {t.heroParagraph}
            </p>

            <p className="text-[13px] sm:text-[15px] text-amber-900/90 leading-relaxed italic font-medium pt-3 border-t border-amber-200/80">
              {t.heroNote}
            </p>
          </div>
        </div>

        {/* Quick CTA Scroll Button */}
        <div className="text-center pt-2">
          <Button
            onClick={scrollToPlans}
            className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-bold px-10 py-4 text-base shadow-md rounded-2xl cursor-pointer"
          >
            <span>{t.bookNow} (₹250)</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Button>
        </div>

      </section>

      {/* 3. CONSULTATION PLANS SECTION */}
      <section ref={plansRef} id="plans" className="bg-[#FAF6EE] py-16 sm:py-24 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/60 pb-6 text-left">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">Professional Consultation Fees</span>
              <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
                {t.step0Title}
              </h3>
            </div>
            <p className="text-[14px] font-normal text-stone-500 max-w-[50ch]">
              {t.step0Subtitle}
            </p>
          </div>

          {/* Mobile Swipable Pricing Cards View (Visible on Mobile) */}
          <div className="block md:hidden space-y-4 text-left">
            {/* Top Plan Selector Segment Pills displaying all 3 prices at a glance */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/80 text-center shadow-xs">
              {GURU_SERVICES.map((s, idx) => {
                const isSelected = selectedPlanTab === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToPlanIndex(idx)}
                    className={`py-2.5 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#A14E15] text-white shadow-xs font-semibold scale-[1.02]'
                        : 'text-stone-700 hover:bg-stone-200/60 font-medium'
                    }`}
                  >
                    <span className="text-[11px] font-semibold tracking-tight truncate max-w-full">
                      {idx === 0 ? 'Quick' : idx === 1 ? 'Standard' : 'Detailed'}
                    </span>
                    <span className={`text-[13px] font-bold font-mono ${isSelected ? 'text-amber-100' : 'text-[#A14E15]'}`}>
                      ₹{s.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Horizontal Touch Swipable Snap Container */}
            <div
              ref={pricingScrollRef}
              onScroll={handlePricingScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 py-2 px-1 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {GURU_SERVICES.map((s) => (
                <Card
                  key={s.id}
                  onClick={() => handleSelectService(s)}
                  className={`w-[88%] shrink-0 snap-center p-5 rounded-2xl relative flex flex-col justify-between bg-white text-left shadow-sm border-2 transition-all ${
                    s.popular ? 'border-[#A14E15]' : 'border-stone-200/90'
                  }`}
                >
                  {s.popular && (
                    <span className="absolute -top-3 left-5 bg-[#A14E15] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                      Most Popular Choice
                    </span>
                  )}

                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[#A14E15]">
                          {renderServiceIcon(s.iconName)}
                        </div>
                        <div>
                          <h4 className="text-[17px] font-bold text-[#1F1E1B] leading-tight">
                            {getServiceTitle(s)}
                          </h4>
                          <span className="text-[12px] text-stone-500 font-medium">Selected Plan</span>
                        </div>
                      </div>
                      <span className="text-[22px] font-bold text-[#A14E15] font-mono shrink-0">
                        ₹{s.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-[13px] font-normal text-stone-600 leading-relaxed">
                      {getServiceDesc(s)}
                    </p>

                    <ul className="space-y-1.5 pt-2.5 border-t border-stone-100">
                      {getServiceFeatures(s).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-stone-600 font-normal">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2] mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectService(s);
                      }}
                      className="w-full text-[14px] font-semibold py-3"
                    >
                      <span>Select & Proceed (₹{s.price.toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-4 h-4 stroke-[1.75]" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Mobile Touch Swipe Indicator Dots */}
            <div className="flex justify-center items-center gap-1.5 pt-1">
              {GURU_SERVICES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToPlanIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    selectedPlanTab === idx ? 'w-6 bg-[#A14E15]' : 'w-2 bg-stone-300'
                  }`}
                  aria-label={`Scroll to plan ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop 3-Column Grid (Visible on Desktop) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {GURU_SERVICES.map((s) => {
              return (
                <Card
                  key={s.id}
                  onClick={() => handleSelectService(s)}
                  className={`p-6 rounded-2xl transition-all duration-200 cursor-pointer relative flex flex-col justify-between bg-white text-left ${
                    s.popular
                      ? 'shadow-md border-2 border-[#A14E15] lg:-translate-y-1'
                      : 'shadow-xs border border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
                  }`}
                >
                  {s.popular && (
                    <span className="absolute -top-3.5 left-6 bg-[#A14E15] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                      Most Popular Choice
                    </span>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-[#A14E15]">
                        {renderServiceIcon(s.iconName)}
                      </div>
                      <span className="text-[22px] font-bold text-[#A14E15] font-mono">
                        ₹{s.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[18px] sm:text-[20px] font-semibold text-[#1F1E1B]">
                        {getServiceTitle(s)}
                      </h4>
                      <p className="text-[13px] sm:text-[14px] font-normal text-stone-600 leading-relaxed">
                        {getServiceDesc(s)}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-3 border-t border-stone-100">
                      {getServiceFeatures(s).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-stone-600 font-normal">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2] mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectService(s);
                      }}
                      className="w-full text-[14px] font-semibold"
                    >
                      <span>Select & Proceed</span>
                      <ArrowRight className="w-4 h-4 stroke-[1.75]" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#1D1D1F] text-stone-300 py-16 px-6 sm:px-12 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          <div className="sm:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-900/50 border border-amber-700/60 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4 stroke-[1.75]" />
              </div>
              <span className="text-[16px] font-semibold text-white tracking-tight">{t.title}</span>
            </div>
            <p className="text-[14px] text-stone-400 font-normal leading-relaxed max-w-sm">
              Authentic Vedic astrology consultation & Sri Vidya spiritual guidance by Narendragiri Goswami Ji based on Brihat Parashara Hora Shastra principles.
            </p>
          </div>

          <div className="sm:col-span-3 space-y-3 text-[14px]">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[12px]">Consultations</h5>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">Kundli Reading (₹250)</button></li>
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">30 Mins Live Session (₹250)</button></li>
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">Extra Questions (₹100)</button></li>
            </ul>
          </div>

          <div className="sm:col-span-4 space-y-3 text-[14px]">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[12px]">Direct Contact & Support</h5>
            <p className="text-stone-400 font-normal flex items-center gap-2">
              <MessageSquare className="w-4 h-4 stroke-[1.75] text-emerald-400" />
              <span>WhatsApp Delivery & Verification</span>
            </p>
            <p className="text-stone-500 text-[12px] font-mono">
              Data Security: 30-Day Auto Purge Policy
            </p>
          </div>

        </div>

        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[14px] text-stone-500 font-normal">
          <p>© {new Date().getFullYear()} Shree Ganeshambika Jyotish. All rights reserved.</p>
          <div className="flex items-center gap-2 text-stone-400">
            <Globe className="w-4 h-4 stroke-[1.75]" />
            {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[12px] font-semibold transition-colors px-2 py-1 rounded-md cursor-pointer ${
                  lang === l ? 'text-amber-400 bg-stone-800' : 'text-stone-400 hover:text-white'
                }`}
              >
                {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
