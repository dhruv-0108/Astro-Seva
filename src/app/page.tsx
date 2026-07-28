'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '../components/ui/shadcn/button';
import { Card } from '../components/ui/shadcn/card';
import { Input } from '../components/ui/shadcn/input';
import { Badge } from '../components/ui/shadcn/badge';
import {
  Globe,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Check,
  Award,
  BookOpen,
  Users,
  MessageCircle,
  HeartHandshake,
  Compass,
  AlertCircle,
} from 'lucide-react';

interface BirthDetails {
  date: string;
  time: string;
  place: string;
  lat: number;
  lng: number;
  tzOffset: number;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
];

const SERVICES = [
  {
    id: '3-questions',
    titleEN: '3 Questions Consultation',
    titleGU: '૩ પ્રશ્નો પરામર્શ (3 Questions)',
    price: 251,
    descEN: 'Direct astrological answers to 3 specific life or career questions.',
    descGU: 'તમારા ૩ ચોક્કસ જીવન અથવા કારકિર્દીના પ્રશ્નોના જવાબો.',
    icon: Sparkles,
    popular: false,
  },
  {
    id: '5-questions',
    titleEN: '5 Questions Consultation',
    titleGU: '૫ પ્રશ્નો પરામર્શ (5 Questions)',
    price: 501,
    descEN: 'Comprehensive analysis for 5 life questions + Kundli overview.',
    descGU: 'તમારા ૫ જીવન પ્રશ્નોનું વિગતવાર વિશ્લેષણ અને કુંડળી વિહંગાવલોકન.',
    icon: BookOpen,
    popular: true,
  },
  {
    id: '30-min-call',
    titleEN: '30 Mins Live Call Consultation',
    titleGU: '૩૦ મિનિટ લાઇવ કૉલ (30 Mins Call)',
    price: 999,
    descEN: 'Personal 1-on-1 30-minute phone call consultation with Guruji.',
    descGU: 'ગુરુજી સાથે સીધો ૩૦ મિનિટનો ૧-ઓન-૧ ફોન કૉલ પરામર્શ.',
    icon: PhoneCall,
    popular: false,
  },
];

const TRANSLATIONS = {
  EN: {
    title: 'Astro-Seva',
    subtitle: 'Vedic Consultation & Life Guidance',
    heroTagline: 'Seeking clarity in career, marriage, or life decisions?',
    heroSubtitle: 'Receive calm, authentic Vedic guidance rooted in Brihat Parashara Hora Shastra principles from a dedicated Sri Vidya practitioner.',
    heroCta: 'Consult Guru Ji',
    meetTitle: 'Meet Guru Ji',
    meetRole: 'Sri Vidya Sadhak • 30+ Years Dedicated Wisdom',
    meetBio: 'For over three decades, Guru Ji has guided thousands of individuals through complex life phases using authentic Vedic astrology calculations and spiritual wisdom.',
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
    step1Title: 'Dakshina Offering',
    step2Title: 'Tell Us About Yourself',
    step3Title: 'Details Received',
    selectServiceBtn: 'Proceed with Selected Service',
    nameLabel: 'Full Name',
    phoneLabel: 'WhatsApp Number',
    payBtn: 'Open UPI App to Offer Dakshina',
    qrDesktopText: 'Or scan using GPay / PhonePe / Paytm:',
    paidBtn: 'I Have Completed Payment',
    birthDateLabel: 'Date of Birth',
    birthTimeLabel: 'Exact Time of Birth',
    birthPlaceLabel: 'Place of Birth (City / Town)',
    tzLabel: 'Timezone (Default: IST +5.5 India)',
    submitBtn: 'Submit Consultation Details',
    successMsg: 'Hari Om. Your birth details & payment notification have been submitted to Guruji.',
    successSub: 'Guruji will verify the payment and share your complete Kundli report directly to your WhatsApp.',
    searching: 'Searching location...',
    loading: 'Submitting...',
    language: 'ગુજરાતી',
  },
  GU: {
    title: 'એસ્ટ્રો-સેવા',
    subtitle: 'વૈદિક પરામર્શ અને જીવન માર્ગદર્શન',
    heroTagline: 'કારકિર્દી, લગ્ન કે જીવનના નિર્ણયોમાં સ્પષ્ટતા શોધી રહ્યા છો?',
    heroSubtitle: 'શ્રી વિદ્યા સાધક પાસેથી બૃહત્ પરાશર હોરા શાસ્ત્ર સિદ્ધાંતો પર આધારિત શાંત અને પ્રામાણિક વૈદિક માર્ગદર્શન મેળવો.',
    heroCta: 'ગુરુજી સાથે પરામર્શ કરો',
    meetTitle: 'ગુરુજી વિશે જાણો',
    meetRole: 'શ્રી વિદ્યા સાધક • ૩૦+ વર્ષનો સમર્પિત અનુભવ',
    meetBio: 'ત્રણ દાયકાથી વધુ સમયથી, ગુરુજીએ પ્રામાણિક વૈદિક જ્યોતિષ ગણતરીઓ અને આધ્યાત્મિક જ્ઞાનનો ઉપયોગ કરીને હજારો લોકોને માર્ગદર્શન આપ્યું છે.',
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
    step1Title: 'દક્ષિણા અર્પણ',
    step2Title: 'તમારી વિગતો જણાવો',
    step3Title: 'વિગતો પ્રાપ્ત થઈ',
    selectServiceBtn: 'સેવા પસંદ કરો અને આગળ વધો',
    nameLabel: 'આખું નામ',
    phoneLabel: 'વોટ્સએપ નંબર',
    payBtn: 'ચુકવણી કરવા માટે યુપીઆઈ એપ ખોલો',
    qrDesktopText: 'અથવા જીપે/ફોનપે/પેટીએમ વડે આ ક્યુઆર કોડ સ્કેન કરો:',
    paidBtn: 'મેં દક્ષિણા અર્પણ કરી દીધી છે',
    birthDateLabel: 'જન્મ તારીખ',
    birthTimeLabel: 'ચોક્કસ જન્મ સમય',
    birthPlaceLabel: 'જન્મ સ્થળ (શહેર/ગામ)',
    tzLabel: 'ટાઇમઝોન (Default: IST +5.5 India)',
    submitBtn: 'સંપૂર્ણ વિગતો ગુરુજીને સબમિટ કરો',
    successMsg: 'હરિ ઓમ. તમારી જન્મ વિગતો અને ચુકવણી નોટિફિકેશન ગુરુજીને મોકલી દેવાયા છે.',
    successSub: 'ગુરુજી ચુકવણીની ખાતરી કરીને ટૂંક સમયમાં તમારા વોટ્સએપ પર કુંડળી મોકલશે.',
    searching: 'સ્થળ શોધી રહ્યા છીએ...',
    loading: 'મોકલી રહ્યા છીએ...',
    language: 'English',
  }
};

const GURU_UPI_ID = 'verify@ybl';

export default function Home() {
  const [lang, setLang] = useState<'EN' | 'GU'>('GU');
  const [step, setStep] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0]>(SERVICES[1]);

  const [name, setName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneRaw, setPhoneRaw] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    date: '',
    time: '',
    place: '',
    lat: 0,
    lng: 0,
    tzOffset: 5.5,
  });

  const [placeSearch, setPlaceSearch] = useState<string>('');
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Buttery Smooth Scroll Zoom ONLY (No Rotation)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const mandalaScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.30]);
  const mandalaY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Close place suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setPlaceSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Geocoding Search using OpenStreetMap Nominatim with English locale
  useEffect(() => {
    if (placeSearch.length < 3) {
      setPlaceSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            placeSearch
          )}&accept-language=en&limit=5`
        );
        const data = await response.json();
        setPlaceSuggestions(data || []);
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [placeSearch]);

  const handleSelectPlace = (item: any) => {
    const parts = item.display_name.split(',').map((s: string) => s.trim());
    const cleanName = parts.length > 3 ? `${parts[0]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}` : item.display_name;

    setBirthDetails((prev) => ({
      ...prev,
      place: cleanName,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
    setPlaceSearch(cleanName);
    setPlaceSuggestions([]);
  };

  const fullPhoneNumber = `${countryCode} ${phoneRaw.trim()}`;
  const upiLink = `upi://pay?pa=${GURU_UPI_ID}&pn=AstroSeva&am=${selectedService.price}&tn=AstroSeva-${encodeURIComponent(
    selectedService.id
  )}&cu=INR`;

  const scrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter your full name (minimum 2 characters).');
      return;
    }
    const cleanPhone = phoneRaw.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 15) {
      setFormError('Please enter a valid phone number (7 to 15 digits).');
      return;
    }
    if (!birthDetails.date) {
      setFormError('Please select your date of birth.');
      return;
    }
    if (!birthDetails.time) {
      setFormError('Please enter your exact time of birth.');
      return;
    }
    if (!birthDetails.place || birthDetails.lat === 0) {
      setFormError('Please select a valid birth place location from the suggestions dropdown.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const deleteAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const docRef = await addDoc(collection(db, 'submissions'), {
        name: name.trim(),
        phone: fullPhoneNumber,
        serviceSelected: {
          id: selectedService.id,
          title: lang === 'GU' ? selectedService.titleGU : selectedService.titleEN,
          price: selectedService.price,
        },
        birthDetails: {
          ...birthDetails,
          date: birthDetails.date,
          time: birthDetails.time,
        },
        paymentStatus: 'pending',
        createdAt: now,
        deleteAt: deleteAt,
      });

      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: fullPhoneNumber,
          submissionId: docRef.id,
          serviceTitle: selectedService.titleEN,
          servicePrice: selectedService.price,
          birthDetails,
        }),
      });

      setStep(3);
    } catch (err) {
      console.error('Submission failed:', err);
      setFormError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'GU' ? 'EN' : 'GU'));
  };

  return (
    <div ref={containerRef} className="flex flex-col flex-1 min-h-screen text-stone-900 font-sans relative overflow-hidden selection:bg-amber-100">
      
      {/* BUTTERY SMOOTH SCROLL ZOOM MANDALA BACKGROUND (NO ROTATION) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          style={{
            scale: mandalaScale,
            y: mandalaY,
          }}
          className="w-full h-full min-h-screen flex items-center justify-center transform-gpu will-change-transform"
        >
          <img
            src="/mandala-bg.jpg"
            alt="Golden Mandala Background"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        
        {/* Transparent Tint to preserve text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/40 via-[#FAF9F6]/25 to-[#FAF9F6]/50" />
      </div>

      {/* Serene Navigation Header */}
      <header className="w-full bg-white/85 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-30 px-6 sm:px-10 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-[#A14E15]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">{t.title}</h1>
            <p className="text-xs text-stone-500 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={toggleLanguage}>
          <Globe className="w-3.5 h-3.5 text-stone-600" />
          <span>{t.language}</span>
        </Button>
      </header>

      {/* Content wrapper floating over smooth background */}
      <div className="relative z-10 flex flex-col flex-1">
        
        {/* 1. WELCOME & REASSURANCE HERO SECTION */}
        <section className="w-full max-w-3xl mx-auto pt-16 pb-10 px-6 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="default" className="mx-auto bg-amber-100/90 text-[#A14E15] border-amber-300">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Personal Vedic Astrology Consultation</span>
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight drop-shadow-xs">
              {t.heroTagline}
            </h2>
            <p className="text-base text-stone-800 leading-relaxed font-semibold max-w-xl mx-auto drop-shadow-xs">
              {t.heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button size="lg" onClick={scrollToBooking} className="shadow-lg">
              <span>{t.heroCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </section>

        {/* 2. MEET GURU JI CREDIBILITY SECTION */}
        <section className="w-full max-w-3xl mx-auto py-8 px-6">
          <Card className="p-8 sm:p-10 space-y-6 text-center bg-white/92 backdrop-blur-md shadow-xl border border-stone-200">
            <div className="space-y-2">
              <Badge variant="secondary" className="mx-auto">{t.meetRole}</Badge>
              <h3 className="text-2xl font-bold text-stone-900">{t.meetTitle}</h3>
            </div>

            {/* Photo Placeholder Container (ready for Guruji's photo when shared) */}
            <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-amber-50 to-stone-100 border-2 border-amber-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center justify-center text-amber-800/70 gap-1">
                <User className="w-12 h-12 stroke-[1.5]" />
              </div>
            </div>

            <p className="text-sm text-stone-600 font-medium leading-relaxed max-w-xl mx-auto">
              {t.meetBio}
            </p>

            {/* 4 Trust Pillars Architecture Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
              {[
                { icon: Award, title: 'Sri Vidya', sub: 'Traditional Sadhana' },
                { icon: BookOpen, title: 'BPHS Logic', sub: 'Authentic Principles' },
                { icon: Users, title: '30+ Years', sub: 'Vedic Practice' },
                { icon: MessageCircle, title: 'Direct', sub: 'WhatsApp Guidance' },
              ].map((pillar, i) => (
                <div key={i} className="bg-stone-50/90 border border-stone-200/60 rounded-2xl p-4 space-y-1">
                  <pillar.icon className="w-4 h-4 text-[#A14E15]" />
                  <div className="text-xs font-bold text-stone-900">{pillar.title}</div>
                  <div className="text-[10px] text-stone-500 font-medium">{pillar.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 3. HOW CONSULTATION WORKS SECTION */}
        <section className="w-full max-w-3xl mx-auto py-8 px-6 space-y-6">
          <div className="text-center space-y-1">
            <Badge variant="secondary" className="mx-auto">Simple Process</Badge>
            <h3 className="text-xl font-bold text-stone-900">{t.howTitle}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { num: '01', title: t.howStep1, desc: t.howStep1Desc, icon: Sparkles },
              { num: '02', title: t.howStep2, desc: t.howStep2Desc, icon: CreditCard },
              { num: '03', title: t.howStep3, desc: t.howStep3Desc, icon: User },
              { num: '04', title: t.howStep4, desc: t.howStep4Desc, icon: Compass },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 flex items-start gap-4 bg-white/92 backdrop-blur-md shadow-md border border-stone-200">
                <span className="text-base font-extrabold text-[#A14E15] font-mono bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl shrink-0">
                  {item.num}
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. INTERACTIVE CONSULTATION WORKFLOW */}
        <main ref={bookingRef} className="w-full max-w-xl mx-auto py-10 px-4 sm:px-6">
          
          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-3 mb-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    step === i
                      ? 'bg-[#A14E15] text-white ring-4 ring-amber-100 shadow-md scale-110'
                      : step > i
                      ? 'bg-amber-900 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {step > i ? '✓' : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 sm:w-16 h-1 rounded-full transition-all duration-300 ${
                      step > i ? 'bg-[#A14E15]' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Card with Motion Transitions */}
          <Card className="w-full relative bg-white/95 backdrop-blur-md shadow-2xl border border-stone-200">
            <AnimatePresence mode="wait">
              
              {/* STEP 0: CHOOSE CONSULTATION FORMAT */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1.5">
                    <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#A14E15] mb-1">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <h3 className="text-xl font-bold text-stone-900">{t.step0Title}</h3>
                    <p className="text-xs text-stone-500 font-medium">Select the consultation format that fits your questions</p>
                  </div>

                  <div className="space-y-3.5">
                    {SERVICES.map((s) => {
                      const isSelected = selectedService.id === s.id;
                      const IconComponent = s.icon;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedService(s)}
                          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex items-start gap-4 ${
                            isSelected
                              ? 'border-[#A14E15] bg-amber-50/60 ring-1 ring-[#A14E15]/30 shadow-xs'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          {s.popular && (
                            <span className="absolute -top-3 right-4 bg-[#A14E15] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                              Most Popular
                            </span>
                          )}
                          
                          <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-[#A14E15] shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <h4 className="font-bold text-base text-stone-900 truncate">
                                {lang === 'GU' ? s.titleGU : s.titleEN}
                              </h4>
                              <span className="text-base font-extrabold text-[#A14E15] shrink-0">
                                ₹{s.price}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                              {lang === 'GU' ? s.descGU : s.descEN}
                            </p>
                          </div>

                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                            isSelected ? 'border-[#A14E15] bg-[#A14E15] text-white' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button onClick={() => setStep(1)} className="w-full h-14 rounded-2xl text-base">
                    <span>Proceed to Pay ₹{selectedService.price}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 1: DAKSHINA OFFERING */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-2">
                    <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#A14E15] mb-1">
                      <CreditCard className="w-5 h-5" />
                    </span>
                    <h3 className="text-xl font-bold text-stone-900">{t.step1Title}</h3>
                    <div className="mt-2 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 inline-block">
                      <span className="text-xs text-stone-600 block font-medium">Selected Format:</span>
                      <span className="text-base font-bold text-[#A14E15]">
                        {lang === 'GU' ? selectedService.titleGU : selectedService.titleEN} — ₹{selectedService.price}
                      </span>
                    </div>
                  </div>

                  {/* Mobile UPI Intent Button */}
                  <div className="block sm:hidden">
                    <a
                      href={upiLink}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#A14E15] text-white font-bold py-4 px-6 rounded-2xl text-base shadow-md"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{selectedService.price} via UPI App</span>
                    </a>
                  </div>

                  {/* Desktop QR Code */}
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xs text-stone-500 font-semibold sm:block hidden">
                      {t.qrDesktopText}
                    </p>
                    <div className="border-4 border-amber-200 rounded-3xl p-2.5 bg-white shadow-xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          upiLink
                        )}`}
                        alt="UPI QR Code"
                        className="w-44 h-44"
                      />
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      UPI ID: {GURU_UPI_ID} (Amount: ₹{selectedService.price})
                    </Badge>
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full h-14 rounded-2xl text-base">
                    {t.paidBtn}
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: TELL US ABOUT YOURSELF */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleSubmitDetails} className="space-y-5">
                    <div className="text-center space-y-1">
                      <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#A14E15] mb-1">
                        <User className="w-5 h-5" />
                      </span>
                      <h3 className="text-xl font-bold text-stone-900">{t.step2Title}</h3>
                      <p className="text-xs text-stone-500 font-medium">Provide exact birth details so Guruji can calculate your chart</p>
                    </div>

                    {formError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#A14E15]" />
                        <span>{t.nameLabel}</span>
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Vijaysinh Varachhiya"
                        required
                      />
                    </div>

                    {/* WhatsApp Number with Country Code Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#A14E15]" />
                        <span>{t.phoneLabel}</span>
                      </label>
                      <div className="flex gap-2.5">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="border border-stone-200 bg-stone-50 rounded-2xl px-3.5 py-4 text-sm font-bold text-stone-800 outline-none focus:border-[#A14E15] cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>

                        <input
                          type="tel"
                          value={phoneRaw}
                          onChange={(e) => setPhoneRaw(e.target.value.replace(/[^\d\s-]/g, ''))}
                          placeholder="98765 43210"
                          className="flex-1 bg-white border border-stone-200 rounded-2xl p-4 text-base font-mono text-stone-900 outline-none focus:border-[#A14E15] focus:ring-4 focus:ring-amber-500/10 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Date of Birth — Click anywhere to open date picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#A14E15]" />
                        <span>{t.birthDateLabel}</span>
                      </label>
                      <Input
                        type="date"
                        value={birthDetails.date}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        onChange={(e) => setBirthDetails((prev) => ({ ...prev, date: e.target.value }))}
                        className="cursor-pointer"
                        required
                      />
                    </div>

                    {/* Time of Birth — Click anywhere to open time picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A14E15]" />
                        <span>{t.birthTimeLabel}</span>
                      </label>
                      <Input
                        type="time"
                        step="1"
                        value={birthDetails.time}
                        onClick={(e) => (e.currentTarget as any).showPicker?.()}
                        onChange={(e) => setBirthDetails((prev) => ({ ...prev, time: e.target.value }))}
                        className="cursor-pointer"
                        required
                      />
                    </div>

                    {/* Birth Place Search with English Locale */}
                    <div className="space-y-1.5 relative" ref={searchContainerRef}>
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A14E15]" />
                        <span>{t.birthPlaceLabel}</span>
                      </label>
                      <input
                        type="text"
                        value={placeSearch}
                        onChange={(e) => {
                          setPlaceSearch(e.target.value);
                          setBirthDetails((prev) => ({ ...prev, place: '', lat: 0, lng: 0 }));
                        }}
                        placeholder="e.g. Surat, Gujarat, India"
                        className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-base text-stone-900 outline-none focus:border-[#A14E15] focus:ring-4 focus:ring-amber-500/10 transition-all"
                        required
                      />
                      
                      {isSearching && (
                        <span className="absolute right-4 top-11 text-xs text-[#A14E15] font-semibold animate-pulse">
                          {t.searching}
                        </span>
                      )}

                      {placeSuggestions.length > 0 && (
                        <ul className="absolute z-30 top-[82px] left-0 w-full bg-white border border-stone-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-stone-100">
                          {placeSuggestions.map((item, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSelectPlace(item)}
                              className="p-4 hover:bg-amber-50/50 cursor-pointer text-xs font-medium text-stone-800 transition-colors flex items-center gap-2.5"
                            >
                              <MapPin className="w-4 h-4 text-[#A14E15] shrink-0" />
                              <span className="truncate">{item.display_name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Timezone Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A14E15]" />
                        <span>{t.tzLabel}</span>
                      </label>
                      <select
                        value={birthDetails.tzOffset}
                        onChange={(e) => setBirthDetails((prev) => ({ ...prev, tzOffset: parseFloat(e.target.value) }))}
                        className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-base font-medium text-stone-900 outline-none focus:border-[#A14E15] focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                      >
                        <option value={5.5}>🇮🇳 India Standard Time (IST) — UTC +5:30 (Default)</option>
                        <option value={-5.0}>🇺🇸 US Eastern (EST/EDT) — UTC -5:00</option>
                        <option value={-6.0}>🇺🇸 US Central (CST/CDT) — UTC -6:00</option>
                        <option value={-7.0}>🇺🇸 US Mountain (MST/MDT) — UTC -7:00</option>
                        <option value={-8.0}>🇺🇸 US Pacific (PST/PDT) — UTC -8:00</option>
                        <option value={0.0}>🇬🇧 UK / London (GMT/BST) — UTC +0:00</option>
                        <option value={1.0}>🇪🇺 Central Europe (Paris/Berlin) — UTC +1:00</option>
                        <option value={4.0}>🇦🇪 UAE / Dubai (GST) — UTC +4:00</option>
                        <option value={8.0}>🇸🇬 Singapore (SGT) — UTC +8:00</option>
                        <option value={10.0}>🇦🇺 Australia / Sydney (AEST) — UTC +10:00</option>
                        <option value={5.75}>🇳🇵 Nepal (NPT) — UTC +5:45</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !birthDetails.place}
                      className="w-full h-14 rounded-2xl text-base mt-2"
                    >
                      {isSubmitting ? t.loading : t.submitBtn}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: SUBMISSION CONFIRMED */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-stone-900">{t.step3Title}</h3>
                    <p className="text-stone-800 text-base font-semibold leading-relaxed max-w-md mx-auto">
                      {t.successMsg}
                    </p>
                    <p className="text-stone-500 text-xs leading-relaxed max-w-sm mx-auto font-medium">
                      {t.successSub}
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </Card>
        </main>

      </div>
    </div>
  );
}
