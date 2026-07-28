'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Sparkles, Calendar, Clock, MapPin, Phone, User, CheckCircle2, ArrowRight, ShieldCheck, Globe, CreditCard, PhoneCall, HelpCircle, Check } from 'lucide-react';

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
    descEN: 'Get detailed astrological answers to your 3 specific life questions.',
    descGU: 'તમારા ૩ ચોક્કસ પ્રશ્નોના વિગતવાર વૈદિક જ્યોતિષીય જવાબો મેળવો.',
    icon: '🔮',
    popular: false,
  },
  {
    id: '5-questions',
    titleEN: '5 Questions Consultation',
    titleGU: '૫ પ્રશ્નો પરામર્શ (5 Questions)',
    price: 501,
    descEN: 'Comprehensive analysis for 5 questions + Kundli overview.',
    descGU: 'તમારા ૫ જીવન પ્રશ્નોનું વિગતવાર વિશ્લેષણ અને કુંડળી વિહંગાવલોકન.',
    icon: '✨',
    popular: true,
  },
  {
    id: '30-min-call',
    titleEN: '30 Mins Live Call Consultation',
    titleGU: '૩૦ મિનિટ લાઇવ કૉલ (30 Mins Call)',
    price: 999,
    descEN: 'Direct 1-on-1 30-minute phone call consultation with Guruji.',
    descGU: 'ગુરુજી સાથે સીધો ૩૦ મિનિટનો ૧-ઓન-૧ ફોન કૉલ પરામર્શ.',
    icon: '📞',
    popular: false,
  },
];

const TRANSLATIONS = {
  EN: {
    title: 'Astro-Seva',
    subtitle: 'Get your authentic Vedic Kundli report & guidance from Guruji',
    step0Title: 'Step 1: Select Your Service',
    step1Title: 'Step 2: Pay Dakshina',
    step2Title: 'Step 3: Enter Your Complete Details',
    step3Title: 'Submission Successful!',
    selectServiceBtn: 'Select Service & Proceed to Pay',
    nameLabel: 'Full Name',
    phoneLabel: 'WhatsApp Number',
    payBtn: 'Open UPI App to Pay',
    qrDesktopText: 'Or scan this QR code using GPay / PhonePe / Paytm:',
    paidBtn: 'I Have Completed Payment',
    birthDateLabel: 'Date of Birth',
    birthTimeLabel: 'Exact Time of Birth',
    birthPlaceLabel: 'Place of Birth (City / Town)',
    tzLabel: 'Timezone Offset (Hours)',
    submitBtn: 'Submit Complete Details to Guruji',
    successMsg: 'Hari Om. Your birth details & payment notification have been submitted to Guruji.',
    successSub: 'Guruji will verify the payment and send your complete Kundli report directly to your WhatsApp.',
    searching: 'Searching location...',
    selectPlace: 'Select Birth Location',
    loading: 'Submitting...',
    language: 'ગુજરાતી',
  },
  GU: {
    title: 'એસ્ટ્રો-સેવા',
    subtitle: 'ગુરુજી પાસેથી તમારી ઓથેન્ટિક વૈદિક કુંડળી અને માર્ગદર્શન મેળવો',
    step0Title: 'પગલું ૧: સેવાની પસંદગી કરો',
    step1Title: 'પગલું ૨: દક્ષિણા ચુકવણી કરો',
    step2Title: 'પગલું ૩: તમારી સંપૂર્ણ વિગતો દાખલ કરો',
    step3Title: 'સફળતાપૂર્વક સબમિટ થયેલ!',
    selectServiceBtn: 'સેવા પસંદ કરો અને આગળ વધો',
    nameLabel: 'આખું નામ',
    phoneLabel: 'વોટ્સએપ નંબર',
    payBtn: 'ચુકવણી કરવા માટે યુપીઆઈ એપ ખોલો',
    qrDesktopText: 'અથવા જીપે/ફોનપે/પેટીએમ વડે આ ક્યુઆર કોડ સ્કેન કરો:',
    paidBtn: 'મેં ચુકવણી પૂર્ણ કરી દીધી છે',
    birthDateLabel: 'જન્મ તારીખ',
    birthTimeLabel: 'ચોક્કસ જન્મ સમય',
    birthPlaceLabel: 'જન્મ સ્થળ (શહેર/ગામ)',
    tzLabel: 'ટાઇમઝોન તફાવત (કલાકો)',
    submitBtn: 'સંપૂર્ણ વિગતો ગુરુજીને સબમિટ કરો',
    successMsg: 'હરિ ઓમ. તમારી જન્મ વિગતો અને ચુકવણી નોટિફિકેશન ગુરુજીને મોકલી દેવાયા છે.',
    successSub: 'ગુરુજી ચુકવણીની ખાતરી કરીને ટૂંક સમયમાં તમારા વોટ્સએપ પર કુંડળી મોકલશે.',
    searching: 'સ્થળ શોધી રહ્યા છીએ...',
    selectPlace: 'જન્મ સ્થળ પસંદ કરો',
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

  // Geocoding Search using OpenStreetMap Nominatim with English locale constraint
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
      setFormError('Please select a valid birth place location from the dropdown suggestions.');
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
    <div className="flex flex-col flex-1 items-center min-h-screen bg-[#fdfbf7] text-gray-900 font-sans">
      
      {/* Saffron Top Bar with Language Toggle */}
      <header className="w-full bg-[#cc6600] text-white py-4 px-6 md:px-10 flex justify-between items-center shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪐</span>
          <div>
            <h1 className="text-xl font-bold tracking-wide">{t.title}</h1>
            <p className="text-xs text-amber-100 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <button
          onClick={toggleLanguage}
          className="border border-white/40 bg-white/10 hover:bg-white hover:text-[#cc6600] transition-all py-1.5 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t.language}</span>
        </button>
      </header>

      <main className="w-full max-w-xl flex flex-col flex-1 py-8 px-4 sm:px-6">
        
        {/* Progress Step Bar */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step === i
                    ? 'bg-[#cc6600] text-white ring-4 ring-amber-200 shadow-md scale-110'
                    : step > i
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > i ? '✓' : i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-10 sm:w-16 h-1 rounded-full transition-all duration-300 ${
                    step > i ? 'bg-[#cc6600]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 sm:p-8 shadow-md w-full relative overflow-hidden">
          
          {formError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 0: SELECT SERVICE */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <span className="p-3 bg-amber-50 text-[#cc6600] rounded-2xl inline-block text-2xl mb-2">🔮</span>
                <h2 className="text-xl font-bold text-gray-900">{t.step0Title}</h2>
                <p className="text-gray-500 text-xs mt-1">{t.subtitle}</p>
              </div>

              {/* 3 Service Options Cards */}
              <div className="space-y-4">
                {SERVICES.map((s) => {
                  const isSelected = selectedService.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex items-start gap-4 ${
                        isSelected
                          ? 'border-[#cc6600] bg-amber-50/60 shadow-md'
                          : 'border-[#e8e2d5] bg-white hover:border-amber-300'
                      }`}
                    >
                      {s.popular && (
                        <span className="absolute -top-3 right-4 bg-[#cc6600] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                          Most Popular
                        </span>
                      )}
                      
                      <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-amber-100">{s.icon}</span>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <h3 className="font-bold text-base text-gray-900 truncate">
                            {lang === 'GU' ? s.titleGU : s.titleEN}
                          </h3>
                          <span className="text-lg font-extrabold text-[#cc6600] shrink-0">
                            ₹{s.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {lang === 'GU' ? s.descGU : s.descEN}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        isSelected ? 'border-[#cc6600] bg-[#cc6600] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(1)}
                className="bg-[#cc6600] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#a65300] transition-all w-full mt-2 cursor-pointer shadow-md flex items-center justify-center gap-2 text-base"
              >
                <span>Proceed to Pay ₹{selectedService.price}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1: DAKSHINA PAYMENT (DYNAMIC FOR SELECTED SERVICE) */}
          {step === 1 && (
            <div className="flex flex-col gap-6 text-center">
              <div>
                <span className="p-3 bg-amber-50 text-[#cc6600] rounded-2xl inline-block text-2xl mb-2">🙏</span>
                <h2 className="text-xl font-bold text-gray-900">{t.step1Title}</h2>
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 inline-block">
                  <span className="text-xs text-gray-600 block">Selected Service:</span>
                  <span className="text-base font-bold text-[#cc6600]">
                    {lang === 'GU' ? selectedService.titleGU : selectedService.titleEN} — ₹{selectedService.price}
                  </span>
                </div>
              </div>

              {/* UPI Intent Button for Mobile */}
              <div className="block md:hidden">
                <a
                  href={upiLink}
                  className="inline-flex items-center justify-center gap-2 bg-[#cc6600] text-white text-base font-bold py-4 px-6 rounded-xl hover:bg-[#a65300] transition-all w-full shadow-md"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Pay ₹{selectedService.price} via UPI App</span>
                </a>
              </div>

              {/* UPI QR Code for Desktop (Dynamically generated with exact price) */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-gray-500 font-semibold md:block hidden">
                  {t.qrDesktopText}
                </p>
                <div className="border-4 border-[#cc6600] rounded-2xl p-2 bg-white shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      upiLink
                    )}`}
                    alt="UPI QR Code"
                    className="w-44 h-44"
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  UPI ID: {GURU_UPI_ID} (Amount: ₹{selectedService.price})
                </span>
              </div>

              <button
                onClick={() => setStep(2)}
                className="bg-[#cc6600] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#a65300] transition-all w-full mt-2 cursor-pointer shadow-md text-base"
              >
                {t.paidBtn}
              </button>
            </div>
          )}

          {/* STEP 2: COMPLETE DETAILS ENTRY (NAME + PHONE + DOB + TOB + POB ALL TOGETHER) */}
          {step === 2 && (
            <form onSubmit={handleSubmitDetails} className="flex flex-col gap-5">
              <div className="text-center">
                <span className="p-3 bg-amber-50 text-[#cc6600] rounded-2xl inline-block text-2xl mb-2">📋</span>
                <h2 className="text-xl font-bold text-gray-900">{t.step2Title}</h2>
                <p className="text-xs text-gray-500 mt-1">Please fill your details below so Guruji can prepare your Kundli</p>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#cc6600]" />
                  <span>{t.nameLabel}</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vijaysinh Varachhiya"
                  className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 text-base w-full transition-all"
                  required
                />
              </div>

              {/* WhatsApp Number with Country Code Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#cc6600]" />
                  <span>{t.phoneLabel}</span>
                </label>

                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border border-[#e8e2d5] bg-gray-50 rounded-xl px-3 py-3.5 text-sm font-bold text-gray-800 outline-none focus:border-[#cc6600] cursor-pointer"
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
                    className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 text-base flex-1 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#cc6600]" />
                  <span>{t.birthDateLabel}</span>
                </label>
                <input
                  type="date"
                  value={birthDetails.date}
                  onChange={(e) =>
                    setBirthDetails((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 text-base w-full transition-all"
                  required
                />
              </div>

              {/* Time of Birth */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#cc6600]" />
                  <span>{t.birthTimeLabel}</span>
                </label>
                <input
                  type="time"
                  step="1"
                  value={birthDetails.time}
                  onChange={(e) =>
                    setBirthDetails((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 text-base w-full transition-all"
                  required
                />
              </div>

              {/* Birth Place Autocomplete Search with English Locale */}
              <div className="flex flex-col gap-2 relative" ref={searchContainerRef}>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#cc6600]" />
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
                  className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 text-base w-full transition-all"
                  required
                />
                
                {isSearching && (
                  <span className="absolute right-3.5 top-10 text-xs text-[#cc6600] font-semibold animate-pulse">
                    {t.searching}
                  </span>
                )}

                {placeSuggestions.length > 0 && (
                  <ul className="absolute z-30 top-[74px] left-0 w-full bg-white border border-[#e8e2d5] rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-gray-100">
                    {placeSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectPlace(item)}
                        className="p-3.5 hover:bg-amber-50 cursor-pointer text-xs font-medium text-gray-800 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-[#cc6600] shrink-0" />
                        <span className="truncate">{item.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Timezone Offset */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#cc6600]" />
                  <span>{t.tzLabel}</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={birthDetails.tzOffset}
                  onChange={(e) =>
                    setBirthDetails((prev) => ({
                      ...prev,
                      tzOffset: parseFloat(e.target.value),
                    }))
                  }
                  className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 text-base w-full transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !birthDetails.place}
                className="bg-[#cc6600] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#a65300] transition-all w-full mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-base"
              >
                {isSubmitting ? t.loading : t.submitBtn}
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 3 && (
            <div className="flex flex-col gap-6 text-center py-6">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-[#cc6600] animate-bounce" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-[#cc6600]">{t.step3Title}</h2>
                <p className="text-gray-800 text-base font-semibold leading-relaxed">
                  {t.successMsg}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {t.successSub}
                </p>
              </div>
            </div>
          )}


        </div>
      </main>
    </div>
  );
}
