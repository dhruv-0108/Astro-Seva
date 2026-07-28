'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  ProgressSteps,
  ErrorBanner,
} from '../components/ui/DesignSystem';
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
    descEN: 'Clear astrological guidance for 3 specific life questions.',
    descGU: 'તમારા ૩ ચોક્કસ જીવન પ્રશ્નો માટે સ્પષ્ટ જ્યોતિષીય માર્ગદર્શન.',
    icon: Sparkles,
    popular: false,
  },
  {
    id: '5-questions',
    titleEN: '5 Questions Consultation',
    titleGU: '૫ પ્રશ્નો પરામર્શ (5 Questions)',
    price: 501,
    descEN: 'Detailed analysis for 5 questions + Kundli overview.',
    descGU: 'તમારા ૫ જીવન પ્રશ્નોનું વિગતવાર વિશ્લેષણ અને કુંડળી વિહંગાવલોકન.',
    icon: BookOpen,
    popular: true,
  },
  {
    id: '30-min-call',
    titleEN: '30 Mins Live Call Consultation',
    titleGU: '૩૦ મિનિટ લાઇવ કૉલ (30 Mins Call)',
    price: 999,
    descEN: 'Direct 1-on-1 30-minute phone call consultation with Guruji.',
    descGU: 'ગુરુજી સાથે સીધો ૩૦ મિનિટનો ૧-ઓન-૧ ફોન કૉલ પરામર્શ.',
    icon: PhoneCall,
    popular: false,
  },
];

const TRANSLATIONS = {
  EN: {
    title: 'Astro-Seva',
    subtitle: 'Vedic Astrology Consultation & Kundli Guidance',
    heroRole: 'Sri Vidya Sadhak',
    heroExp: '30+ Years Dedicated Practice',
    heroTagline: 'Authentic Vedic Astrology & Spiritual Guidance',
    step0Title: 'Select Your Consultation Service',
    step1Title: 'Dakshina Offering',
    step2Title: 'Enter Your Birth Details',
    step3Title: 'Submission Confirmed',
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
    subtitle: 'વૈદિક જ્યોતિષ પરામર્શ અને કુંડળી માર્ગદર્શન',
    heroRole: 'શ્રી વિદ્યા સાધક',
    heroExp: '૩૦+ વર્ષનો સમર્પિત અનુભવ',
    heroTagline: 'પ્રામાણિક વૈદિક જ્યોતિષ અને આધ્યાત્મિક માર્ગદર્શન',
    step0Title: 'તમારી સેવા પસંદ કરો',
    step1Title: 'દક્ષિણા અર્પણ',
    step2Title: 'તમારી જન્મ વિગતો દાખલ કરો',
    step3Title: 'સફળતાપૂર્વક સબમિટ થયેલ',
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

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter a valid full name (minimum 2 characters).');
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
    <div className="flex flex-col flex-1 min-h-screen bg-[#FAF9F5] text-stone-900 font-sans selection:bg-amber-100">
      
      {/* Calm Elegant Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-30 px-6 sm:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-[#B45309]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">{t.title}</h1>
            <p className="text-xs text-stone-500 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <button
          onClick={toggleLanguage}
          className="border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 transition-all py-2 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-stone-600" />
          <span>{t.language}</span>
        </button>
      </header>

      {/* Hero & Credibility Section */}
      <section className="w-full max-w-2xl mx-auto pt-10 px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/60 border border-amber-200/80 text-[#B45309] text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>{t.heroRole} • {t.heroExp}</span>
        </div>

        {/* Guruji Photo Placeholder Container (ready for Guruji's photo) */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-amber-50 to-stone-100 border-2 border-amber-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.04)] flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center justify-center text-amber-800/80 gap-1">
            <User className="w-10 h-10 stroke-[1.5]" />
          </div>
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {t.heroTagline}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            Receive personalized, authentic astrological consultations based on traditional Brihat Parashara Hora Shastra principles.
          </p>
        </div>

        {/* 4 Trust Pillars Architecture Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { icon: Award, title: 'Sri Vidya', sub: 'Traditional Sadhana' },
            { icon: BookOpen, title: 'BPHS Logic', sub: 'Authentic Calculations' },
            { icon: Users, title: '30+ Years', sub: 'Vedic Experience' },
            { icon: MessageCircle, title: 'Direct', sub: 'Personal Guidance' },
          ].map((pillar, i) => (
            <div key={i} className="bg-white border border-stone-200/60 rounded-2xl p-3.5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-1">
              <pillar.icon className="w-4 h-4 text-[#B45309] mx-auto" />
              <div className="text-xs font-bold text-stone-900">{pillar.title}</div>
              <div className="text-[10px] text-stone-500 font-medium">{pillar.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Booking Container */}
      <main className="w-full max-w-xl mx-auto py-10 px-4 sm:px-6">
        
        {/* Progress Step Bar */}
        <ProgressSteps currentStep={step} totalSteps={3} />

        {/* Step Container Card */}
        <Card className="w-full relative">
          
          {formError && <div className="mb-6"><ErrorBanner message={formError} /></div>}

          {/* STEP 0: SELECT SERVICE */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#B45309] mb-1">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-stone-900">{t.step0Title}</h3>
                <p className="text-xs text-stone-500 font-medium">Select the consultation service that fits your requirements</p>
              </div>

              {/* Service Cards */}
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
                          ? 'border-[#B45309] bg-amber-50/40 ring-1 ring-[#B45309]/30 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      {s.popular && (
                        <span className="absolute -top-3 right-4 bg-[#B45309] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                          Most Popular
                        </span>
                      )}
                      
                      <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-[#B45309] shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <h4 className="font-bold text-base text-stone-900 truncate">
                            {lang === 'GU' ? s.titleGU : s.titleEN}
                          </h4>
                          <span className="text-base font-extrabold text-[#B45309] shrink-0">
                            ₹{s.price}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                          {lang === 'GU' ? s.descGU : s.descEN}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                        isSelected ? 'border-[#B45309] bg-[#B45309] text-white' : 'border-stone-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={() => setStep(1)}
                fullWidth
                size="lg"
                className="mt-2"
              >
                <span>Proceed to Pay ₹{selectedService.price}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* STEP 1: DAKSHINA PAYMENT */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#B45309] mb-1">
                  <CreditCard className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-stone-900">{t.step1Title}</h3>
                <div className="mt-2 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 inline-block">
                  <span className="text-xs text-stone-600 block font-medium">Selected Service:</span>
                  <span className="text-base font-bold text-[#B45309]">
                    {lang === 'GU' ? selectedService.titleGU : selectedService.titleEN} — ₹{selectedService.price}
                  </span>
                </div>
              </div>

              {/* UPI Intent Button for Mobile */}
              <div className="block sm:hidden">
                <a
                  href={upiLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#B45309] text-white font-bold py-4 px-6 rounded-2xl text-base shadow-md"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ₹{selectedService.price} via UPI App</span>
                </a>
              </div>

              {/* UPI QR Code for Desktop */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-stone-500 font-semibold sm:block hidden">
                  {t.qrDesktopText}
                </p>
                <div className="border-4 border-amber-200 rounded-3xl p-2.5 bg-white shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      upiLink
                    )}`}
                    alt="UPI QR Code"
                    className="w-44 h-44"
                  />
                </div>
                <Badge variant="stone" className="font-mono text-xs">
                  UPI ID: {GURU_UPI_ID} (Amount: ₹{selectedService.price})
                </Badge>
              </div>

              <Button
                onClick={() => setStep(2)}
                fullWidth
                size="lg"
                className="mt-2"
              >
                {t.paidBtn}
              </Button>
            </div>
          )}

          {/* STEP 2: COMPLETE DETAILS ENTRY */}
          {step === 2 && (
            <form onSubmit={handleSubmitDetails} className="space-y-5">
              <div className="text-center space-y-1">
                <span className="inline-block p-3 rounded-2xl bg-amber-50 text-[#B45309] mb-1">
                  <Calendar className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-stone-900">{t.step2Title}</h3>
                <p className="text-xs text-stone-500 font-medium">Please enter complete birth details for accurate calculations</p>
              </div>

              {/* Full Name */}
              <Input
                label={t.nameLabel}
                icon={<User className="w-3.5 h-3.5 text-[#B45309]" />}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vijaysinh Varachhiya"
                required
              />

              {/* Phone with Country Code Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{t.phoneLabel}</span>
                </label>
                <div className="flex gap-2.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border border-stone-200 bg-stone-50 rounded-2xl px-3.5 py-4 text-sm font-bold text-stone-800 outline-none focus:border-[#B45309] cursor-pointer"
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
                    className="flex-1 bg-white border border-stone-200 rounded-2xl p-4 text-base font-mono text-stone-900 outline-none focus:border-[#B45309] focus:ring-4 focus:ring-amber-500/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <Input
                label={t.birthDateLabel}
                icon={<Calendar className="w-3.5 h-3.5 text-[#B45309]" />}
                type="date"
                value={birthDetails.date}
                onChange={(e) => setBirthDetails((prev) => ({ ...prev, date: e.target.value }))}
                required
              />

              {/* Time of Birth */}
              <Input
                label={t.birthTimeLabel}
                icon={<Clock className="w-3.5 h-3.5 text-[#B45309]" />}
                type="time"
                step="1"
                value={birthDetails.time}
                onChange={(e) => setBirthDetails((prev) => ({ ...prev, time: e.target.value }))}
                required
              />

              {/* Birth Place Search with English Locale */}
              <div className="flex flex-col gap-1.5 relative" ref={searchContainerRef}>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
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
                  className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-base text-stone-900 outline-none focus:border-[#B45309] focus:ring-4 focus:ring-amber-500/10 transition-all"
                  required
                />
                
                {isSearching && (
                  <span className="absolute right-4 top-11 text-xs text-[#B45309] font-semibold animate-pulse">
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
                        <MapPin className="w-4 h-4 text-[#B45309] shrink-0" />
                        <span className="truncate">{item.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Timezone Selector */}
              <Select
                label={t.tzLabel}
                icon={<ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />}
                value={birthDetails.tzOffset}
                onChange={(e) => setBirthDetails((prev) => ({ ...prev, tzOffset: parseFloat(e.target.value) }))}
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
              </Select>

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!birthDetails.place}
                fullWidth
                size="lg"
                className="mt-3"
              >
                {t.submitBtn}
              </Button>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-6 text-center py-6">
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
            </div>
          )}

        </Card>
      </main>
    </div>
  );
}
