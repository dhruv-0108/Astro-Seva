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
    title: 'Shree Ganeshambika Jyotish',
    subtitle: 'Vedic Astrology Consultation & Upasana Wisdom',
    heroTagline: 'Seeking Authentic Vedic Guidance & Divine Foresight?',
    heroSubtitle: 'Calm, authentic astrological guidance rooted in Brihat Parashara Hora Shastra principles by Guruji — Hanuman Ji & Bhairav Upasak, Shri Vidya Practitioner & Karna Pishachini Sadhak.',
    heroCta: 'Consult Guruji Now',
    meetTitle: 'About Guruji',
    meetRole: 'Hanuman Ji, Bhairav & Shri Vidya Upasak • Karna Pishachini Sadhana',
    meetBio: 'Guruji is a dedicated Hanuman Ji, Bhairav, and Shri Vidya Upasak with profound Karna Pishachini Sadhana intuition. For over three decades, Guruji has guided individuals using authentic BPHS planetary calculations and intense spiritual sadhana.',
    whyTitle: 'Why Trust Shree Ganeshambika Jyotish',
    whySubtitle: 'Consultations are strictly based on classical Brihat Parashara Hora Shastra rules, divine upasana insights, and genuine spiritual guidance — without fear tactics or artificial remedies.',
    step0Title: 'Choose Your Consultation Option',
    language: 'ગુજરાતી',
  },
  GU: {
    title: 'શ્રી ગણેશામ્બિકા જ્યોતિષ',
    subtitle: 'વૈદિક જ્યોતિષ પરામર્શ અને આધ્યાત્મિક સાધના',
    heroTagline: 'કારકિર્દી, લગ્ન કે જીવનના પ્રશ્નોમાં સાચી દિશા શોધી રહ્યા છો?',
    heroSubtitle: 'હનુમાનજી ઉપાસક, ભૈરવ ઉપાસક, શ્રી વિદ્યા ઉપાસક અને કર્ણ પિશાચિની સાધના ધરાવતા ગુરુજી પાસેથી બૃહત્ પરાશર હોરા શાસ્ત્ર અને પવિત્ર ગણતરીઓ પર આધારિત સીધું માર્ગદર્શન મેળવો.',
    heroCta: 'ગુરુજી સાથે પરામર્શ કરો',
    meetTitle: 'ગુરુજી વિશે જાણો',
    meetRole: 'હનુમાનજી, ભૈરવ અને શ્રી વિદ્યા ઉપાસક • કર્ણ પિશાચિની સાધના',
    meetBio: 'ગુરુજી હનુમાનજી, ભૈરવદેવ અને શ્રી વિદ્યા માતાજીના સમર્પિત ઉપાસક છે તથા કર્ણ પિશાચિની સાધનાની સૂક્ષ્મ દ્રષ્ટિ ધરાવે છે. ત્રણ દાયકાથી વધુ સમયથી પ્રામાણિક ગણતરીઓ અને સાધનાના આધારે સચોટ માર્ગદર્શન આપે છે.',
    whyTitle: 'શા માટે લોકો શ્રી ગણેશામ્બિકા જ્યોતિષ પર વિશ્વાસ કરે છે',
    whySubtitle: 'પરામર્શ સંપૂર્ણપણે બૃહત્ પરાશર હોરા શાસ્ત્ર નિયમો, આધ્યાત્મિક સાધના અને પવિત્ર ઉપાસના પર આધારિત છે — કોઈ પણ પ્રકારના ડર કે બિનજરૂરી ખર્ચ વગર.',
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

      {/* 1. TOP HERO SECTION: UNBOXED MOVING CAROUSEL WITH GIRI KAKA PHOTOS */}
      <section className="bg-[#FAF8F5] pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        
        {/* Carousel Navigation Tabs & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-200/60 pb-4 text-left">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`px-4 py-2.5 rounded-2xl text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer ${
                currentSlide === 0
                  ? 'bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] text-white shadow-sm'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/80'
              }`}
            >
              1. Guru–Shishya Parampara
            </button>
            <button
              onClick={() => setCurrentSlide(1)}
              className={`px-4 py-2.5 rounded-2xl text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer ${
                currentSlide === 1
                  ? 'bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] text-white shadow-sm'
                  : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/80'
              }`}
            >
              2. Spiritual Practices
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-stone-500 font-mono hidden sm:inline">
              Slide {currentSlide + 1} of 2
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                aria-label="Previous Slide"
                className="p-2.5 rounded-2xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 1 ? 0 : 1))}
                aria-label="Next Slide"
                className="p-2.5 rounded-2xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Unboxed Moving Carousel (Direct Canvas, No Inner Card Outline) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="min-h-[420px] transition-all duration-300 touch-pan-y relative"
        >
          
          {/* Slide 1: Guru–Shishya Parampara */}
          {currentSlide === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center text-left w-full animate-fadeIn">
              
              {/* Photo Display (Moving Giri Kaka Photo: guru-2.jpeg) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden shadow-lg border border-amber-300/80 group">
                  <img
                    src="/images/giri-kaka/guru-2.jpeg"
                    alt="Guruji Guru-Shishya Parampara"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                    <span className="text-[12px] font-bold font-mono tracking-wider block text-amber-200">
                      Guruji • Traditional Lineage
                    </span>
                    <span className="text-[11px] font-medium text-stone-300 block">
                      Decades of Dedicated Mantra Sadhana
                    </span>
                  </div>
                </div>
              </div>

              {/* Typography Content */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-3">
                  <Badge variant="secondary" className="bg-amber-100 text-[#7A1C28] border-amber-300 px-3.5 py-1 text-[12px] font-bold">
                    Guru–Shishya Parampara
                  </Badge>
                  
                  <h2 className="text-[24px] sm:text-[32px] lg:text-[38px] font-black text-[#1C1817] leading-[125%] tracking-tight">
                    Behind every consultation is decades of mantra sadhana, scriptural study, meditation, and guidance received through a traditional Guru–Shishya parampara.
                  </h2>
                </div>

                <p className="text-[16px] sm:text-[18px] font-normal text-[#4A423F] leading-relaxed">
                  For our Guru, astrology is not merely a profession—it is the culmination of years of spiritual practice, mantra sadhana, and traditional learning.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button onClick={scrollToPlans} className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-bold px-7 py-3 text-base shadow-md rounded-2xl">
                    <span>Consult Guruji Now</span>
                    <ArrowRight className="w-5 h-5 stroke-[2]" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Spiritual Practices & Lineage */}
          {currentSlide === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center text-left w-full animate-fadeIn">
              
              {/* Photo Display (Moving Giri Kaka Photo: guru-3.jpeg & guru-4.jpeg) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden shadow-lg border border-amber-300/80 group">
                  <img
                    src="/images/giri-kaka/guru-3.jpeg"
                    alt="Guruji Spiritual Upasana"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-0.5">
                    <span className="text-[12px] font-bold font-mono tracking-wider block text-amber-200">
                      Spiritual Upasana Siddhi
                    </span>
                    <span className="text-[11px] font-medium text-stone-300 block">
                      Authentic Shastric Discipline
                    </span>
                  </div>
                </div>
              </div>

              {/* Typography & Checklist Content */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-[12px] font-bold text-[#7A1C28] uppercase tracking-wider font-mono">
                    Sacred Lineage & Discipline
                  </span>
                  <h2 className="text-[28px] sm:text-[38px] font-black text-[#1C1817] tracking-tight">
                    Spiritual Practices
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {[
                    'Shri Vidya Sadhana',
                    'Hanuman Sadhana',
                    'Bhairava Sadhana',
                    'Karna Pishachini Sadhana',
                  ].map((practice, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[12px] border border-emerald-300">
                        ✓
                      </div>
                      <span className="text-[15px] font-bold text-[#1C1817]">
                        {practice}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[14px] sm:text-[15px] text-[#5A514E] font-medium leading-relaxed pt-3 border-t border-amber-200/60">
                  These disciplines were undertaken under the guidance of his Guru within the traditional Guru–Shishya lineage and continue to inform his spiritual practice today.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button onClick={scrollToPlans} className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-bold px-7 py-3 text-base shadow-md rounded-2xl">
                    <span>Consult Guruji Now</span>
                    <ArrowRight className="w-5 h-5 stroke-[2]" />
                  </Button>
                </div>
              </div>
            </div>
          )}

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
