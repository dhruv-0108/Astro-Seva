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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Language = 'EN' | 'GU' | 'HI';

const TRANSLATIONS: Record<Language, {
  title: string;
  subtitle: string;
  heroHeading: string;
  heroParagraph: string;
  heroCta: string;
  practicesTitle: string;
  practicesNote: string;
  step0Title: string;
  step0Subtitle: string;
  practicesList: string[];
}> = {
  EN: {
    title: 'Shree Ganeshambika Jyotish',
    subtitle: 'Vedic Astrology Consultation & Upasana Wisdom',
    heroHeading: 'Behind every consultation is decades of mantra sadhana, scriptural study, meditation, and guidance received through a traditional Guru–Shishya parampara.',
    heroParagraph: 'For our Guru, astrology is not merely a profession—it is the culmination of years of spiritual practice, mantra sadhana, and traditional learning.',
    heroCta: 'Consult Guruji Now',
    practicesTitle: 'Spiritual Practices',
    practicesNote: 'These disciplines were undertaken under the guidance of his Guru within the traditional Guru–Shishya lineage and continue to inform his spiritual practice today.',
    step0Title: 'Choose Your Consultation Option',
    step0Subtitle: 'Select your consultation category to proceed with sacred dakshina offering & payment.',
    practicesList: [
      'Shri Vidya Sadhana',
      'Hanuman Sadhana',
      'Bhairava Sadhana',
      'Karna Pishachini Sadhana',
    ],
  },
  GU: {
    title: 'શ્રી ગણેશામ્બિકા જ્યોતિષ',
    subtitle: 'વૈદિક જ્યોતિષ પરામર્શ અને આધ્યાત્મિક સાધના',
    heroHeading: 'દરેક પરામર્શ પાછળ દાયકાઓની મંત્ર સાધના, શાસ્ત્ર અભ્યાસ, ધ્યાન અને પરંપરાગત ગુરુ-શિષ્ય પરંપરા દ્વારા પ્રાપ્ત માર્ગદર્શન છે.',
    heroParagraph: 'અમારા ગુરુજી માટે, જ્યોતિષ એ માત્ર એક વ્યવસાય નથી—તે વર્ષોની આધ્યાત્મિક સાધના, મંત્ર જાપ અને પ્રામાણિક જ્ઞાનનું પવિત્ર ફળ છે.',
    heroCta: 'ગુરુજી સાથે પરામર્શ કરો',
    practicesTitle: 'આધ્યાત્મિક સાધનાઓ',
    practicesNote: 'આ તમામ સાધનાઓ તેમણે પોતાના ગુરુજીના પવિત્ર માર્ગદર્શન હેઠળ ગુરુ-શિષ્ય પરંપરામાં સંપાદિત કરી છે.',
    step0Title: 'તમારું પરામર્શ ફોર્મેટ પસંદ કરો',
    step0Subtitle: 'દક્ષિણા અર્પણ અને ચૂકવણી સાથે આગળ વધવા માટે તમારો પરામર્શ વિકલ્પ પસંદ કરો.',
    practicesList: [
      'શ્રી વિદ્યા સાધના',
      'હનુમાન સાધના',
      'ભૈરવ સાધના',
      'કર્ણ પિશાચિની સાધના',
    ],
  },
  HI: {
    title: 'श्री गणेशाम्बिका ज्योतिष',
    subtitle: 'वैदिक ज्योतिष परामर्श एवं आध्यात्मिक साधना',
    heroHeading: 'प्रत्येक परामर्श के पीछे दशकों की मंत्र साधना, शास्त्र अध्ययन, ध्यान एवं पारंपरिक गुरु-शिष्य परंपरा द्वारा प्राप्त मार्गदर्शन है।',
    heroParagraph: 'हमारे गुरुजी के लिए, ज्योतिष केवल एक व्यवसाय नहीं है—यह वर्षों की आध्यात्मिक साधना, मंत्र जप एवं प्रामाणिक ज्ञान का पवित्र फल है।',
    heroCta: 'गुरुजी से परामर्श करें',
    practicesTitle: 'आध्यात्मिक साधनाएँ',
    practicesNote: 'ये सभी साधनाएँ उन्होंने अपने गुरुजी के पवित्र मार्गदर्शन में पारंपरिक गुरु-शिष्य परंपरा के अंतर्गत संपन्न की हैं।',
    step0Title: 'अपना परामर्श विकल्प चुनें',
    step0Subtitle: 'दक्षिणा अर्पित करने एवं भुगतान के साथ आगे बढ़ने के लिए अपना परामर्श विकल्प चुनें।',
    practicesList: [
      'श्री विद्या साधना',
      'हनुमान साधना',
      'भैरव साधना',
      'कर्ण पिशाचिनी साधना',
    ],
  }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('GU');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto rotate Giri Kaka photos every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const [selectedPlanTab, setSelectedPlanTab] = useState<number>(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const pricingScrollRef = useRef<HTMLDivElement>(null);
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

  // Touch Swipe for Meet Guru Ji Carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 50) {
      setCurrentSlide((prev) => (prev + 1) % 3);
    } else if (diffX < -50) {
      setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
    }
    setTouchStartX(null);
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] font-sans selection:bg-amber-100 antialiased">
      
      {/* Serene Navigation Header */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-30 px-6 sm:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-[#A14E15]">
            <Sparkles className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold tracking-tight text-[#1F1E1B]">{t.title}</h1>
            <p className="text-[12px] text-stone-500 font-normal">{t.subtitle}</p>
          </div>
        </div>

        {/* 3-Way Language Selector Switcher */}
        <div className="flex items-center gap-1 bg-stone-200/60 p-1 rounded-2xl border border-stone-300/60 shadow-2xs">
          {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                lang === l
                  ? 'bg-[#7A1C28] text-white shadow-xs'
                  : 'text-stone-700 hover:text-[#1F1E1B] hover:bg-stone-300/50'
              }`}
            >
              {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
            </button>
          ))}
        </div>
      </header>

      {/* 1. UNIFIED HERO SECTION WITH AUTO-ROTATING GIRI KAKA PHOTOS */}
      <section className="bg-[#FAF8F5] pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center text-left w-full">
          
          {/* Auto-Rotating Giri Kaka Photos (Excluding Image 2) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-amber-300/80 group">
              {[
                { src: '/images/giri-kaka/guru-2.jpeg', label: 'Guruji • 30+ Yrs Sadhana' },
                { src: '/images/giri-kaka/guru-3.jpeg', label: 'Sacred Upasana Siddhi' },
                { src: '/images/giri-kaka/guru-4.jpeg', label: 'Shastric Lineage & Practice' },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentSlide % 3 === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                    <span className="text-[12px] font-bold font-mono tracking-wider block text-amber-200">
                      {img.label}
                    </span>
                    <span className="text-[11px] font-medium text-stone-300 block">
                      Authentic Vedic Practice
                    </span>
                  </div>
                </div>
              ))}

              {/* Photo Indicator Dots */}
              <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide % 3 === idx ? 'w-5 bg-amber-300' : 'w-2 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Unified Copy & Spiritual Practices Checklist */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="text-[24px] sm:text-[32px] lg:text-[36px] font-black text-[#1C1817] leading-[125%] tracking-tight">
                {t.heroHeading}
              </h2>

              <p className="text-[15px] sm:text-[17px] font-normal text-[#4A423F] leading-relaxed">
                {t.heroParagraph}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-amber-200/60">
              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#7A1C28] uppercase tracking-wider font-mono">
                {t.practicesTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.practicesList.map((practice, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[11px] border border-emerald-300">
                      ✓
                    </div>
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#1C1817]">
                      {practice}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[13px] sm:text-[14px] text-[#5A514E] font-medium leading-relaxed">
              {t.practicesNote}
            </p>

            <div className="pt-2">
              <Button onClick={scrollToPlans} className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-bold px-8 py-3.5 text-base shadow-md rounded-2xl">
                <span>{t.heroCta}</span>
                <ArrowRight className="w-5 h-5 stroke-[2]" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CONSULTATION PLANS SECTION */}
      <section ref={plansRef} id="plans" className="bg-white py-20 sm:py-24 border-y border-stone-200/50">
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

      {/* 3. FOOTER */}
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
              Authentic Vedic astrology consultation & Sri Vidya spiritual guidance based on Brihat Parashara Hora Shastra principles.
            </p>
          </div>

          <div className="sm:col-span-3 space-y-3 text-[14px]">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[12px]">Consultations</h5>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">Kundli Jova Na (₹250)</button></li>
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
