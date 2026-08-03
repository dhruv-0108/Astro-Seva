'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef } from 'react';
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

const TRANSLATIONS = {
  EN: {
    title: 'Astro-Seva',
    subtitle: 'Vedic Consultation & Life Guidance',
    heroTagline: 'Seeking Clarity in Career, Marriage, or Life Decisions?',
    heroSubtitle: 'Receive calm, authentic Vedic guidance rooted in Brihat Parashara Hora Shastra principles from a dedicated Sri Vidya practitioner with 30+ years experience.',
    heroCta: 'Consult Guru Ji',
    meetTitle: 'Meet Guru Ji',
    meetRole: 'Sri Vidya Sadhak • 30+ Years Dedicated Wisdom',
    meetBio: 'For over three decades, Guru Ji has guided thousands of individuals through complex life phases using authentic Vedic astrology calculations and Shodasha Samskara spiritual wisdom.',
    whyTitle: 'Why Thousands Trust Guru Ji',
    whySubtitle: 'Consultations are strictly based on Brihat Parashara Hora Shastra principles and genuine spiritual discipline, without fear-based tactics or unnecessary ritual costs.',
    step0Title: 'Choose Your Consultation Format',
    language: 'ગુજરાતી',
  },
  GU: {
    title: 'એસ્ટ્રો-સેવા',
    subtitle: 'વૈદિક પરામર્શ અને જીવન માર્ગદર્શન',
    heroTagline: 'કારકિર્દી, લગ્ન કે જીવનના નિર્ણયોમાં સ્પષ્ટતા શોધી રહ્યા છો?',
    heroSubtitle: '૩૦+ વર્ષનો સમર્પિત અનુભવ ધરાવતા શ્રી વિદ્યા સાધક પાસેથી બૃહત્ પરાશર હોરા શાસ્ત્ર સિદ્ધાંતો પર આધારિત શાંત અને પ્રામાણિક વૈદિક માર્ગદર્શન મેળવો.',
    heroCta: 'ગુરુજી સાથે પરામર્શ કરો',
    meetTitle: 'ગુરુજી વિશે જાણો',
    meetRole: 'શ્રી વિદ્યા સાધક • ૩૦+ વર્ષનો સમર્પિત અનુભવ',
    meetBio: 'ત્રણ દાયકાથી વધુ સમયથી, ગુરુજીએ પ્રામાણિક વૈદિક જ્યોતિષ ગણતરીઓ અને ષોડશ સંસ્કાર આધ્યાત્મિક જ્ઞાનનો ઉપયોગ કરીને હજારો લોકોને માર્ગદર્શન આપ્યું છે.',
    whyTitle: 'શા માટે હજારો લોકો ગુરુજી પર વિશ્વાસ કરે છે',
    whySubtitle: 'પરામર્શ સંપૂર્ણપણે બૃહત્ પરાશર હોરા શાસ્ત્ર સિદ્ધાંતો અને સાચી આધ્યાત્મિક સાધના પર આધારિત છે, કોઈ પણ ડર કે બિનજરૂરી ઉપાયો વગર.',
    step0Title: 'તમારું પરામર્શ ફોર્મેટ પસંદ કરો',
    language: 'English',
  }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'GU'>('GU');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
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

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'GU' ? 'EN' : 'GU'));
  };

  // Touch Swipe for Meet Guru Ji Carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        setCurrentSlide(1);
      } else {
        setCurrentSlide(0);
      }
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

        <Button variant="outline" size="sm" onClick={toggleLanguage}>
          <Globe className="w-4 h-4 stroke-[1.75] text-stone-600" />
          <span>{t.language}</span>
        </Button>
      </header>

      {/* 1. HERO SECTION */}
      <section className="bg-[#FAF8F5] pt-20 sm:pt-24 pb-20 px-6 text-center max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
          <Badge variant="default" className="mx-auto bg-amber-100/90 text-[#A14E15] border-amber-300 px-4 py-1.5 text-[12px] font-medium">
            <Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Sri Vidya Sadhak • 30+ Years Dedicated Experience</span>
          </Badge>

          <h2 className="text-[36px] sm:text-[56px] font-bold text-[#1F1E1B] tracking-tight leading-[110%] max-w-3xl mx-auto">
            {t.heroTagline}
          </h2>

          <p className="text-[18px] sm:text-[22px] text-stone-600 font-medium leading-relaxed max-w-[65ch] mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="pt-2">
          <Button size="lg" onClick={scrollToPlans}>
            <span>{t.heroCta}</span>
            <ArrowRight className="w-5 h-5 stroke-[1.75]" />
          </Button>
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
              Select your consultation category to proceed with sacred dakshina offering & payment.
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
                            {lang === 'GU' ? s.titleGU : s.titleEN}
                          </h4>
                          <span className="text-[12px] text-stone-500 font-medium">Selected Plan</span>
                        </div>
                      </div>
                      <span className="text-[22px] font-bold text-[#A14E15] font-mono shrink-0">
                        ₹{s.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-[13px] font-normal text-stone-600 leading-relaxed">
                      {lang === 'GU' ? s.descGU : s.descEN}
                    </p>

                    <ul className="space-y-1.5 pt-2.5 border-t border-stone-100">
                      {(lang === 'GU' ? s.featuresGU : s.featuresEN).map((f, i) => (
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
                        {lang === 'GU' ? s.titleGU : s.titleEN}
                      </h4>
                      <p className="text-[13px] sm:text-[14px] font-normal text-stone-600 leading-relaxed">
                        {lang === 'GU' ? s.descGU : s.descEN}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-3 border-t border-stone-100">
                      {(lang === 'GU' ? s.featuresGU : s.featuresEN).map((f, i) => (
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

      {/* 3. COMBINED CAROUSEL SECTION: MEET GURU JI -> WHY TRUST */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-5xl mx-auto space-y-8">
        
        {/* Carousel Header & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200/60 pb-6 text-left">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`px-4 py-2 rounded-2xl text-[14px] font-semibold transition-all cursor-pointer ${
                currentSlide === 0
                  ? 'bg-[#A14E15] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              1. {t.meetTitle}
            </button>
            <button
              onClick={() => setCurrentSlide(1)}
              className={`px-4 py-2 rounded-2xl text-[14px] font-semibold transition-all cursor-pointer ${
                currentSlide === 1
                  ? 'bg-[#A14E15] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              2. {t.whyTitle}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
              aria-label="Previous Slide"
              className="p-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[1.75]" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 1 ? 0 : 1))}
              aria-label="Next Slide"
              className="p-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Carousel Container with Touch Swipe Gesture Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-12 shadow-xs transition-all duration-300 min-h-[380px] flex items-center touch-pan-y select-none"
        >
          
          {/* Slide 1: Meet Guru Ji */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-left w-full animate-fadeIn">
              <div className="md:col-span-4 flex justify-center md:justify-start">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-b from-amber-50 to-stone-100 border-2 border-amber-200/80 shadow-sm flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center justify-center text-amber-800/70 gap-2">
                    <User className="w-16 h-16 stroke-[1.5]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80">Guru Ji</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-6">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-[12px] font-medium">{t.meetRole}</Badge>
                  <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
                    {t.meetTitle}
                  </h3>
                </div>

                <p className="text-[16px] font-normal text-stone-600 leading-relaxed max-w-[65ch]">
                  {t.meetBio}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border-l-2 border-[#A14E15] pl-3.5 space-y-0.5">
                    <div className="text-[14px] font-semibold text-[#1F1E1B]">Sri Vidya Sadhana</div>
                    <div className="text-[12px] text-stone-500 font-normal">Traditional Discipline</div>
                  </div>
                  <div className="border-l-2 border-[#A14E15] pl-3.5 space-y-0.5">
                    <div className="text-[14px] font-semibold text-[#1F1E1B]">BPHS Precision</div>
                    <div className="text-[12px] text-stone-500 font-normal">Authentic Math</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={scrollToPlans}>
                    <span>Book Consultation with Guruji</span>
                    <ArrowRight className="w-5 h-5 stroke-[1.75]" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Why Thousands Trust Guru Ji */}
          {currentSlide === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-left w-full animate-fadeIn">
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">
                    Authentic Vedic Foundation
                  </span>
                  <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight leading-tight">
                    {t.whyTitle}
                  </h3>
                  <p className="text-[16px] font-normal text-stone-600 leading-relaxed max-w-[65ch]">
                    {t.whySubtitle}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { title: '30+ Years Dedicated Experience', desc: 'Over three decades of precision horoscope calculation and client guidance.' },
                    { title: 'BPHS Principles & Math', desc: 'Calculations adhere strictly to ancient Brihat Parashara Hora Shastra rules.' },
                    { title: 'Sri Vidya Sadhak Discipline', desc: 'Spiritual grounding ensures calm, trustworthy, and sacred life insights.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[12px]">
                        ✓
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-[15px] font-semibold text-[#1F1E1B]">{item.title}</h4>
                        <p className="text-[13px] font-normal text-stone-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 space-y-6 border-l-0 md:border-l border-stone-200/80 md:pl-10">
                <div className="space-y-2">
                  <div className="text-[48px] sm:text-[56px] font-bold text-[#A14E15] font-mono leading-none">30+</div>
                  <div className="text-[18px] font-semibold text-[#1F1E1B]">Years Dedicated Sadhana</div>
                  <p className="text-[14px] font-normal text-stone-500 leading-relaxed">
                    Authentic calculation of planetary dasha periods and divisional charts.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-emerald-800">
                    <ShieldCheck className="w-5 h-5 stroke-[1.75] text-emerald-600" />
                    <span>Direct WhatsApp Delivery & Privacy Guarantee</span>
                  </div>
                  <p className="text-[13px] font-normal text-stone-500 leading-relaxed">
                    Your birth charts are personally analyzed by Guru Ji. Records are automatically purged after 30 days.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            onClick={() => setCurrentSlide(0)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === 0 ? 'w-8 bg-[#A14E15]' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label="Go to slide 1"
          />
          <button
            onClick={() => setCurrentSlide(1)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === 1 ? 'w-8 bg-[#A14E15]' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label="Go to slide 2"
          />
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
              Authentic Vedic astrology consultation & Sri Vidya spiritual guidance based on Brihat Parashara Hora Shastra principles.
            </p>
          </div>

          <div className="sm:col-span-3 space-y-3 text-[14px]">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[12px]">Consultations</h5>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">Quick Question (₹2,500)</button></li>
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">Standard Full Reading (₹5,000)</button></li>
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">Detailed Life Analysis (₹10,000)</button></li>
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
          <p>© {new Date().getFullYear()} Astro-Seva. All rights reserved.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={toggleLanguage} className="hover:text-white transition-colors flex items-center gap-1">
              <Globe className="w-4 h-4 stroke-[1.75]" />
              <span>{t.language}</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
