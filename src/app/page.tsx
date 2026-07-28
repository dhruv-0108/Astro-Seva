'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  MessageSquare,
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
    descEN: 'Direct astrological answers to 3 specific life, career, or relationship questions.',
    descGU: 'તમારા ૩ ચોક્કસ જીવન, કારકિર્દી અથવા સંબંધોના પ્રશ્નોના સીધા જવાબો.',
    icon: Sparkles,
    popular: false,
  },
  {
    id: '5-questions',
    titleEN: '5 Questions Consultation',
    titleGU: '૫ પ્રશ્નો પરામર્શ (5 Questions)',
    price: 501,
    descEN: 'Comprehensive analysis for 5 life questions + complete Kundli overview.',
    descGU: 'તમારા ૫ જીવન પ્રશ્નોનું વિગતવાર વિશ્લેષણ અને કુંડળી વિહંગાવલોકન.',
    icon: BookOpen,
    popular: true,
  },
  {
    id: '30-min-call',
    titleEN: '30 Mins Live Call Consultation',
    titleGU: '૩૦ મિનિટ લાઇવ કૉલ (30 Mins Call)',
    price: 999,
    descEN: 'Personal 1-on-1 30-minute direct phone call consultation with Guruji.',
    descGU: 'ગુરુજી સાથે સીધો ૩૦ મિનિટનો ૧-ઓન-૧ ફોન કૉલ પરામર્શ.',
    icon: PhoneCall,
    popular: false,
  },
];

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
  const bookingRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] font-sans selection:bg-amber-100 antialiased">
      
      {/* Serene Navigation Header (#FAF8F5 Canvas) */}
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

      {/* 1. HERO SECTION (Display Hero: 56px, Line Height 110%, Font Weight 700, 96px Bottom Spacing) */}
      <section className="bg-[#FAF8F5] pt-20 sm:pt-24 pb-24 px-6 text-center max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
          <Badge variant="default" className="mx-auto bg-amber-100/90 text-[#A14E15] border-amber-300 px-4 py-1.5 text-[12px] font-medium">
            <Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Sri Vidya Consultation • Traditional BPHS Astrology</span>
          </Badge>

          <h2 className="text-[36px] sm:text-[56px] font-bold text-[#1F1E1B] tracking-tight leading-[110%] max-w-3xl mx-auto">
            {t.heroTagline}
          </h2>

          <p className="text-[18px] sm:text-[22px] text-stone-600 font-medium leading-relaxed max-w-[65ch] mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="pt-2">
          <Button size="lg" onClick={scrollToBooking}>
            <span>{t.heroCta}</span>
            <ArrowRight className="w-5 h-5 stroke-[1.75]" />
          </Button>
        </div>
      </section>

      {/* 2. TRUST SECTION (Section Heading: 36px, Body: 16px max 65ch width, 80px-96px Spacing) */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Left-aligned title + Checklist */}
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

          {/* Right Column: Statistics & Confidentiality Info */}
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

      {/* 3. CONSULTATION PLANS (ONLY #FFFFFF Canvas — Cards Allowed Here — 24px Padding) */}
      <section className="bg-white py-20 sm:py-24 border-y border-stone-200/50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          {/* Asymmetric Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/60 pb-6 text-left">
            <div className="space-y-1">
              <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">Transparent Offerings</span>
              <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
                {t.step0Title}
              </h3>
            </div>
            <p className="text-[14px] font-normal text-stone-500 max-w-[50ch]">
              Choose the format that fits your current questions. Every option includes authentic BPHS planetary calculations.
            </p>
          </div>

          {/* Consultation Cards with 24px Padding (p-6) & Soft Elevation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((s) => {
              const isSelected = selectedService.id === s.id;
              const IconComponent = s.icon;
              return (
                <Card
                  key={s.id}
                  onClick={() => setSelectedService(s)}
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
                        <IconComponent className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-[22px] font-bold text-[#A14E15] font-mono">
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
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(s);
                        scrollToBooking();
                      }}
                      variant={isSelected ? 'default' : 'outline'}
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

      {/* 4. HOW IT WORKS (Background: #FAF8F5 — TIMELINE LAYOUT) */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-left space-y-2 border-b border-stone-200/60 pb-6">
          <span className="text-[12px] font-semibold text-[#A14E15] uppercase tracking-wider font-mono">Simple Steps</span>
          <h3 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">{t.howTitle}</h3>
        </div>

        {/* Clean Timeline Layout */}
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

      {/* 5. ABOUT GURU JI (Background: #FAF8F5 — EDITORIAL SPLIT) */}
      <section className="bg-[#FAF8F5] py-20 sm:py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center text-left">
          
          {/* Left Column: Photo Frame / Avatar */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-b from-amber-50 to-stone-100 border-2 border-amber-200/80 shadow-sm flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center justify-center text-amber-800/70 gap-2">
                <User className="w-16 h-16 stroke-[1.5]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80">Guru Ji</span>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Credentials */}
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
              <Button onClick={scrollToBooking}>
                <span>Book Consultation with Guruji</span>
                <ArrowRight className="w-5 h-5 stroke-[1.75]" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE INTAKE FORM (Background: #FAF8F5) */}
      <main ref={bookingRef} className="bg-[#FAF8F5] py-20 sm:py-24 px-4 sm:px-6 max-w-xl mx-auto">
        
        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  step === i
                    ? 'bg-[#A14E15] text-white ring-4 ring-amber-100 shadow-md scale-105'
                    : step > i
                    ? 'bg-amber-900 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {step > i ? '✓' : i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 sm:w-16 h-1 rounded-full transition-all duration-200 ${
                    step > i ? 'bg-[#A14E15]' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Clean Form Container */}
        <div className="w-full bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: CHOOSE CONSULTATION FORMAT */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1.5">
                  <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#A14E15] mb-1">
                    <Sparkles className="w-5 h-5 stroke-[1.75]" />
                  </span>
                  <h3 className="text-[20px] font-semibold text-[#1F1E1B]">{t.step0Title}</h3>
                  <p className="text-[14px] text-stone-500 font-normal">Select the consultation format that fits your questions</p>
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
                            ? 'border-[#A14E15] bg-amber-50/60 ring-1 ring-[#A14E15]/30'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        {s.popular && (
                          <span className="absolute -top-3 right-4 bg-[#A14E15] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        )}
                        
                        <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-[#A14E15] shrink-0">
                          <IconComponent className="w-5 h-5 stroke-[1.75]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="text-[16px] font-semibold text-[#1F1E1B] truncate">
                              {lang === 'GU' ? s.titleGU : s.titleEN}
                            </h4>
                            <span className="text-[18px] font-bold text-[#A14E15] shrink-0 font-mono">
                              ₹{s.price}
                            </span>
                          </div>
                          <p className="text-[14px] font-normal text-stone-600 mt-1 leading-relaxed">
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

                <Button onClick={() => setStep(1)} className="w-full text-base">
                  <span>Proceed to Pay ₹{selectedService.price}</span>
                  <ArrowRight className="w-5 h-5 stroke-[1.75]" />
                </Button>
              </motion.div>
            )}

            {/* STEP 1: DAKSHINA OFFERING */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#A14E15] mb-1">
                    <CreditCard className="w-5 h-5 stroke-[1.75]" />
                  </span>
                  <h3 className="text-[20px] font-semibold text-[#1F1E1B]">{t.step1Title}</h3>
                  <div className="mt-2 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 inline-block">
                    <span className="text-[12px] text-stone-600 block font-normal">Selected Format:</span>
                    <span className="text-[16px] font-bold text-[#A14E15]">
                      {lang === 'GU' ? selectedService.titleGU : selectedService.titleEN} — ₹{selectedService.price}
                    </span>
                  </div>
                </div>

                {/* Mobile UPI Intent Button */}
                <div className="block sm:hidden">
                  <a
                    href={upiLink}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#A14E15] text-white font-semibold py-4 px-6 rounded-2xl text-base shadow-md"
                  >
                    <CreditCard className="w-5 h-5 stroke-[1.75]" />
                    <span>Pay ₹{selectedService.price} via UPI App</span>
                  </a>
                </div>

                {/* Desktop QR Code */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-[14px] text-stone-500 font-normal sm:block hidden">
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
                  <Badge variant="secondary" className="font-mono text-[12px]">
                    UPI ID: {GURU_UPI_ID} (Amount: ₹{selectedService.price})
                  </Badge>
                </div>

                <Button onClick={() => setStep(2)} className="w-full text-base">
                  {t.paidBtn}
                </Button>
              </motion.div>
            )}

            {/* STEP 2: TELL US ABOUT YOURSELF */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSubmitDetails} className="space-y-5 text-left">
                  <div className="text-center space-y-1">
                    <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#A14E15] mb-1">
                      <User className="w-5 h-5 stroke-[1.75]" />
                    </span>
                    <h3 className="text-[20px] font-semibold text-[#1F1E1B]">{t.step2Title}</h3>
                    <p className="text-[14px] text-stone-500 font-normal">Provide exact birth details so Guruji can calculate your chart</p>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-[14px] font-normal flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 stroke-[1.75] text-red-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
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
                    <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                      <span>{t.phoneLabel}</span>
                    </label>
                    <div className="flex gap-2.5">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="border border-stone-200 bg-stone-50 rounded-2xl px-3.5 py-4 text-[14px] font-semibold text-stone-800 outline-none focus:border-[#A14E15] cursor-pointer"
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
                        className="flex-1 bg-white border border-stone-200 rounded-2xl p-4 text-[16px] font-mono text-stone-900 outline-none focus:border-[#A14E15] focus:ring-4 focus:ring-amber-500/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Date of Birth — Click anywhere to open date picker */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
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
                    <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
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
                    <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
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
                      className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-[16px] text-stone-900 outline-none focus:border-[#A14E15] focus:ring-4 focus:ring-amber-500/10 transition-all"
                      required
                    />
                    
                    {isSearching && (
                      <span className="absolute right-4 top-11 text-[12px] text-[#A14E15] font-semibold animate-pulse">
                        {t.searching}
                      </span>
                    )}

                    {placeSuggestions.length > 0 && (
                      <ul className="absolute z-30 top-[82px] left-0 w-full bg-white border border-stone-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-stone-100">
                        {placeSuggestions.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleSelectPlace(item)}
                            className="p-4 hover:bg-amber-50/50 cursor-pointer text-[14px] font-normal text-stone-800 transition-colors flex items-center gap-2.5"
                          >
                            <MapPin className="w-4 h-4 stroke-[1.75] text-[#A14E15] shrink-0" />
                            <span className="truncate">{item.display_name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Timezone Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                      <span>{t.tzLabel}</span>
                    </label>
                    <select
                      value={birthDetails.tzOffset}
                      onChange={(e) => setBirthDetails((prev) => ({ ...prev, tzOffset: parseFloat(e.target.value) }))}
                      className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-[16px] font-medium text-stone-900 outline-none focus:border-[#A14E15] focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
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
                    className="w-full text-base mt-2"
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-[#1F1E1B]">{t.step3Title}</h3>
                  <p className="text-[#1F1E1B] text-[16px] font-medium leading-relaxed max-w-md mx-auto">
                    {t.successMsg}
                  </p>
                  <p className="text-stone-500 text-[14px] leading-relaxed max-w-sm mx-auto font-normal">
                    {t.successSub}
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* 7. FREQUENTLY ASKED QUESTIONS (Background: #FAF8F5 — LEFT ALIGNED ACCORDION) */}
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

        {/* Clean Accordion List */}
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

      {/* 8. FOOTER (Background: ONLY #1D1D1F — MULTI-COLUMN LAYOUT) */}
      <footer className="bg-[#1D1D1F] text-stone-300 py-16 px-6 sm:px-12 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Sacred Mission */}
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

          {/* Col 2: Quick Links */}
          <div className="sm:col-span-3 space-y-3 text-[14px]">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[12px]">Consultations</h5>
            <ul className="space-y-2 text-stone-400 font-normal">
              <li><button onClick={scrollToBooking} className="hover:text-amber-400 transition-colors">3 Questions Consultation</button></li>
              <li><button onClick={scrollToBooking} className="hover:text-amber-400 transition-colors">5 Questions + Kundli</button></li>
              <li><button onClick={scrollToBooking} className="hover:text-amber-400 transition-colors">30 Mins Live Phone Call</button></li>
            </ul>
          </div>

          {/* Col 3: Contact & Privacy */}
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
