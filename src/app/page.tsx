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
  CreditCard,
  PhoneCall,
  Award,
  BookOpen,
  Users,
  MessageCircle,
  Compass,
  ChevronDown,
  MessageSquare,
  Check,
} from 'lucide-react';

const FAQS = [
  {
    qEN: 'What birth details are required for consultation?',
    qGU: 'પરામર્શ માટે કઈ જન્મ વિગતો જરૂરી છે?',
    aEN: 'You need to provide your Full Name, Date of Birth, Exact Time of Birth, and Birth Place (City/Town). These parameters are required for precise BPHS planetary calculations.',
    aGU: 'તમારે તમારું આખું નામ, જન્મ તારીખ, ચોક્કસ જન્મ સમય અને જન્મ સ્થળ (શહેર/ગામ) આપવાની જરૂર છે. બૃહત્ પરાશર ગણતરીઓ માટે આ જરૂરી છે.',
  },
  {
    qEN: 'How will I receive my consultation report?',
    qGU: 'મને મારો પરામર્શ રિપોર્ટ કેવી રીતે મળશે?',
    aEN: 'Once Guruji verifies your dakshina and calculates your birth chart, your complete Kundli digital report link will be sent directly to your WhatsApp number.',
    aGU: 'ગુરુજી તમારી દક્ષિણા ચકાસીને જન્મ કુંડળી તૈયાર કરશે પછી, તમારો કુંડળી રિપોર્ટ સીધો તમારા વોટ્સએપ નંબર પર મોકલવામાં આવશે.',
  },
  {
    qEN: 'What if I do not know my exact birth time?',
    qGU: 'જો મને મારો ચોક્કસ જન્મ સમય ખબર ન હોય તો?',
    aEN: 'If exact time is unknown, provide your approximate time window. Guruji utilizes Prashna (Horary) chart calculations to provide guidance.',
    aGU: 'જો ચોક્કસ સમય ખબર ન હોય તો આશરે સમય જણાવો. ગુરુજી પ્રશ્ન કુંડળી ગણતરીનો ઉપયોગ કરીને તમને માર્ગદર્શન આપશે.',
  },
  {
    qEN: 'Is my birth data and phone number secure?',
    qGU: 'શું મારી જન્મ વિગતો અને ફોન નંબર સુરક્ષિત છે?',
    aEN: 'Absolutely. All client records are strictly confidential, protected against public access, and automatically purged after 30 days.',
    aGU: 'ચોક્કસ. તમામ ગ્રાહક માહિતી ગોપનીય રહે છે, સુરક્ષિત છે અને ૩૦ દિવસ પછી આપમેળે દૂર થઈ જાય છે.',
  },
];

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
    howTitle: 'How Consultation Works',
    howStep1: 'Choose Consultation',
    howStep1Desc: 'Select the guidance format that fits your current questions',
    howStep2: 'Dakshina Offering',
    howStep2Desc: 'Offer sacred dakshina securely via any UPI application',
    howStep3: 'Tell Us About Yourself',
    howStep3Desc: 'Provide accurate birth details for calculations',
    howStep4: 'Personal Guidance',
    howStep4Desc: 'Receive your detailed report directly on WhatsApp',
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
    howTitle: 'પરામર્શ પ્રક્રિયા કેવી રીતે કાર્ય કરે છે',
    howStep1: 'પરામર્શ પસંદ કરો',
    howStep1Desc: 'તમારા પ્રશ્નો અનુસાર પરામર્શ ફોર્મેટ પસંદ કરો',
    howStep2: 'દક્ષિણા અર્પણ',
    howStep2Desc: 'કોઈપણ યુપીઆઈ એપ દ્વારા સુરક્ષિત રીતે દક્ષિણા અર્પણ કરો',
    howStep3: 'તમારી વિગતો જણાવો',
    howStep3Desc: 'ચોક્કસ ગણતરીઓ માટે જન્મ વિગતો દાખલ કરો',
    howStep4: 'વ્યક્તિગત માર્ગદર્શન',
    howStep4Desc: 'તમારા વોટ્સએપ પર વિગતવાર કુંડળી રિપોર્ટ મેળવો',
    step0Title: 'તમારું પરામર્શ ફોર્મેટ પસંદ કરો',
    language: 'English',
  }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'GU'>('GU');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

      {/* 1. HERO SECTION — Focuses User directly on Consultation Selection */}
      <section className="bg-[#FAF8F5] pt-20 sm:pt-24 pb-24 px-6 text-center max-w-4xl mx-auto space-y-8">
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

      {/* 2. TRUST SECTION */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">
                Authentic Vedic Foundation
              </span>
              <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight leading-tight">
                Why Thousands Trust Guru Ji
              </h3>
              <p className="text-[16px] font-normal text-stone-600 leading-relaxed max-w-[65ch]">
                Consultations are strictly based on Brihat Parashara Hora Shastra principles and genuine spiritual discipline, without fear-based tactics or unnecessary ritual costs.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { title: '30+ Years Dedicated Experience', desc: 'Over three decades of precision horoscope calculation and client guidance.' },
                { title: 'BPHS Principles & Math', desc: 'Calculations adhere strictly to ancient Brihat Parashara Hora Shastra rules.' },
                { title: 'Sri Vidya Sadhak Discipline', desc: 'Spiritual grounding ensures calm, trustworthy, and sacred life insights.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[12px]">
                    ✓
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[16px] font-semibold text-[#1F1E1B]">{item.title}</h4>
                    <p className="text-[14px] font-normal text-stone-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-6 text-left border-l-0 md:border-l border-stone-200/80 md:pl-10">
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
              <p className="text-[14px] font-normal text-stone-500 leading-relaxed">
                Your birth charts are personally analyzed by Guru Ji. Records are automatically purged after 30 days.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CONSULTATION PLANS SECTION — Focus target for "Consult Guru Ji" */}
      <section ref={plansRef} id="plans" className="bg-white py-20 sm:py-24 border-y border-stone-200/50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          {/* Asymmetric Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/60 pb-6 text-left">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">Professional Consultation Fees</span>
              <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
                {t.step0Title}
              </h3>
            </div>
            <p className="text-[14px] font-normal text-stone-500 max-w-[50ch]">
              Select your consultation format to proceed with sacred dakshina offering & payment.
            </p>
          </div>

          {/* Consultation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GURU_SERVICES.map((s) => {
              return (
                <Card
                  key={s.id}
                  onClick={() => handleSelectService(s)}
                  className={`p-6 rounded-2xl transition-all duration-200 cursor-pointer relative flex flex-col justify-between bg-white text-left ${
                    s.popular
                      ? 'shadow-md border-2 border-[#A14E15] md:-translate-y-1'
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
                        <Sparkles className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-[24px] font-bold text-[#A14E15] font-mono">
                        ₹{s.price}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[20px] font-semibold text-[#1F1E1B]">
                        {lang === 'GU' ? s.titleGU : s.titleEN}
                      </h4>
                      <p className="text-[14px] font-normal text-stone-600 leading-relaxed">
                        {lang === 'GU' ? s.descGU : s.descEN}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-stone-100">
                      {(lang === 'GU' ? s.featuresGU : s.featuresEN).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[13px] text-stone-600 font-normal">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2]" />
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

      {/* 4. HOW IT WORKS */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-left space-y-2 border-b border-stone-200/60 pb-6">
          <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">Simple Steps</span>
          <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">{t.howTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
          {[
            { num: '01', title: t.howStep1, desc: t.howStep1Desc, icon: Sparkles },
            { num: '02', title: t.howStep2, desc: t.howStep2Desc, icon: CreditCard },
            { num: '03', title: t.howStep3, desc: t.howStep3Desc, icon: User },
            { num: '04', title: t.howStep4, desc: t.howStep4Desc, icon: Compass },
          ].map((item, idx) => (
            <div key={idx} className="space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold text-[#A14E15] font-mono bg-amber-100/80 border border-amber-200 px-3 py-1 rounded-xl">
                  {item.num}
                </span>
                <item.icon className="w-5 h-5 stroke-[1.75] text-stone-400" />
              </div>
              <h4 className="text-[16px] font-semibold text-[#1F1E1B] pt-1">{item.title}</h4>
              <p className="text-[14px] font-normal text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT GURU JI */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-left">
          
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
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-4xl mx-auto text-left space-y-8">
        <div className="space-y-2 text-left border-b border-stone-200/60 pb-6">
          <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">Clarifications</span>
          <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-[14px] font-normal text-stone-500 max-w-[50ch]">
            Everything you need to know about preparing your birth details and receiving your consultation.
          </p>
        </div>

        <div className="divide-y divide-stone-200/80">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="py-5 cursor-pointer text-left group transition-colors"
              >
                <div className="flex justify-between items-center gap-4">
                  <h4 className="text-[16px] sm:text-[18px] font-semibold text-[#1F1E1B] group-hover:text-[#A14E15] transition-colors">
                    {lang === 'GU' ? faq.qGU : faq.qEN}
                  </h4>
                  <ChevronDown className={`w-5 h-5 stroke-[1.75] text-stone-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#A14E15]' : ''}`} />
                </div>
                {isOpen && (
                  <p className="text-[14px] sm:text-[16px] font-normal text-stone-600 mt-3 leading-relaxed max-w-[65ch]">
                    {lang === 'GU' ? faq.aGU : faq.aEN}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER */}
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
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">3 Questions Consultation</button></li>
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">5 Questions + Kundli</button></li>
              <li><button onClick={scrollToPlans} className="hover:text-amber-400 transition-colors">30 Mins Live Phone Call</button></li>
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
