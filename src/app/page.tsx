'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

interface BirthDetails {
  date: string;
  time: string;
  place: string;
  lat: number;
  lng: number;
  tzOffset: number;
}

const TRANSLATIONS = {
  EN: {
    title: 'Astro-Seva',
    subtitle: 'Get your detailed Vedic Kundli from Guruji',
    step1Title: 'Step 1: Contact Details',
    step2Title: 'Step 2: Pay First',
    step3Title: 'Step 3: Birth Details',
    step4Title: 'Submission Successful!',
    nameLabel: 'Full Name',
    phoneLabel: 'WhatsApp Phone Number',
    nextBtn: 'Proceed',
    payBtn: 'Open UPI App to Pay',
    qrDesktopText: 'Or scan this QR code on GPay/PhonePe/Paytm:',
    paidBtn: 'I Have Completed the Payment',
    birthDateLabel: 'Date of Birth',
    birthTimeLabel: 'Time of Birth (Hour:Min:Sec)',
    birthPlaceLabel: 'Place of Birth',
    tzLabel: 'Timezone Offset (Hours)',
    submitBtn: 'Submit Details to Guruji',
    successMsg: 'Hari Om. Your birth details and payment request have been submitted to Guruji.',
    successSub: 'Guruji will verify the payment and share your detailed Kundli PDF on your WhatsApp soon.',
    searching: 'Searching for place...',
    selectPlace: 'Select Birth Place',
    loading: 'Loading...',
    language: 'ગુજરાતી',
  },
  GU: {
    title: 'એસ્ટ્રો-સેવા',
    subtitle: 'ગુરુજી પાસેથી તમારી વિગતવાર વૈદિક કુંડળી મેળવો',
    step1Title: 'પગલું ૧: સંપર્ક માહિતી',
    step2Title: 'પગલું ૨: પ્રથમ ચુકવણી',
    step3Title: 'પગલું ૩: જન્મ વિગતો',
    step4Title: 'સફળતાપૂર્વક સબમિટ કરેલ!',
    nameLabel: 'આખું નામ',
    phoneLabel: 'વોટ્સએપ ફોન નંબર',
    nextBtn: 'આગળ વધો',
    payBtn: 'ચુકવણી કરવા માટે યુપીઆઈ એપ ખોલો',
    qrDesktopText: 'અથવા તમારા ફોનથી આ ક્યુઆર કોડ સ્કેન કરો:',
    paidBtn: 'મેં ચુકવણી પૂર્ણ કરી લીધી છે',
    birthDateLabel: 'જન્મ તારીખ',
    birthTimeLabel: 'જન્મ સમય (કલાક:મિનિટ:સેકન્ડ)',
    birthPlaceLabel: 'જન્મ સ્થળ',
    tzLabel: 'ટાઇમઝોન તફાવત (કલાકો)',
    submitBtn: 'વિગતો ગુરુજીને સબમિટ કરો',
    successMsg: 'હરિ ઓમ. તમારી જન્મ વિગતો અને ચુકવણી વિનંતી ગુરુજીને સબમિટ કરવામાં આવી છે.',
    successSub: 'ગુરુજી ચુકવણીની ખાતરી કરશે અને ટૂંક સમયમાં તમારા વોટ્સએપ પર કુંડળી પીડીએફ શેર કરશે.',
    searching: 'સ્થળ શોધી રહ્યા છીએ...',
    selectPlace: 'જન્મ સ્થળ પસંદ કરો',
    loading: 'લોડ થઈ રહ્યું છે...',
    language: 'English',
  }
};

const FEE_AMOUNT = 501; // Saffron dakshina
const GURU_UPI_ID = 'verify@ybl'; // Guruji's payment address

export default function Home() {
  const [lang, setLang] = useState<'EN' | 'GU'>('GU');
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    date: '',
    time: '',
    place: '',
    lat: 0,
    lng: 0,
    tzOffset: 5.5, // Default IST
  });

  const [placeSearch, setPlaceSearch] = useState<string>('');
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  // Geocoding Search using OpenStreetMap Nominatim (Free, no keys needed)
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
          )}&limit=5`
        );
        const data = await response.json();
        setPlaceSuggestions(data);
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [placeSearch]);

  const handleSelectPlace = (item: any) => {
    setBirthDetails((prev) => ({
      ...prev,
      place: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
    setPlaceSearch(item.display_name);
    setPlaceSuggestions([]);
  };

  const handleNextStep = () => {
    if (step === 0 && name.trim() && phone.trim()) {
      setStep(1);
    }
  };

  const upiLink = `upi://pay?pa=${GURU_UPI_ID}&pn=AstroSeva&am=${FEE_AMOUNT}&tn=AstroSeva-${encodeURIComponent(
    name
  )}&cu=INR`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDetails.date || !birthDetails.time || !birthDetails.place) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const deleteAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days TTL

      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, 'submissions'), {
        name,
        phone,
        birthDetails: {
          ...birthDetails,
          date: birthDetails.date,
          time: birthDetails.time,
        },
        paymentStatus: 'pending',
        createdAt: now,
        deleteAt: deleteAt,
      });

      // 2. Trigger notification via Next.js API
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          submissionId: docRef.id,
          birthDetails,
        }),
      });

      setStep(3);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'GU' ? 'EN' : 'GU'));
  };

  return (
    <div className="flex flex-col flex-1 items-center min-h-screen bg-[#fdfbf7]">
      {/* Saffron Top Bar with Language Toggle */}
      <header className="w-full bg-[#FF9933] text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">{t.title}</h1>
        <button
          onClick={toggleLanguage}
          className="border border-white bg-transparent hover:bg-white hover:text-[#FF9933] transition-colors py-1 px-3 rounded-full text-sm font-semibold cursor-pointer"
        >
          {t.language}
        </button>
      </header>

      <main className="w-full max-w-lg flex flex-col flex-1 py-8 px-4 mobile-edge-to-edge">
        {/* Progress Dots */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step === i
                  ? 'bg-[#FF9933] scale-125 shadow-sm'
                  : step > i
                  ? 'bg-[#cc6600]'
                  : 'bg-[#e8e2d5]'
              }`}
            />
          ))}
        </div>

        {/* Step Cards */}
        <div className="bg-white border border-[#e8e2d5] rounded-xl p-6 shadow-sm w-full">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-[#cc6600]">{t.step1Title}</h2>
                <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{t.nameLabel}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vijaysinh Vrachhiya"
                  className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] text-lg w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{t.phoneLabel}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] text-lg w-full"
                  required
                />
              </div>

              <button
                onClick={handleNextStep}
                disabled={!name.trim() || !phone.trim()}
                className="bg-[#FF9933] text-white font-bold py-3.5 px-6 rounded-lg hover:bg-[#cc6600] transition-colors w-full mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.nextBtn}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-[#cc6600]">{t.step2Title}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {lang === 'GU'
                    ? `દક્ષિણા: ₹${FEE_AMOUNT}`
                    : `Dakshina Fee: ₹${FEE_AMOUNT}`}
                </p>
              </div>

              {/* UPI Intent Button for Mobile */}
              <div className="block md:hidden">
                <a
                  href={upiLink}
                  className="inline-block bg-[#FF9933] text-white text-lg font-bold py-4 px-6 rounded-lg hover:bg-[#cc6600] transition-colors w-full"
                >
                  {t.payBtn}
                </a>
              </div>

              {/* UPI QR Code for Desktop */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-500 font-semibold md:block hidden">
                  {t.qrDesktopText}
                </p>
                <div className="border-4 border-[#FF9933] rounded-lg p-1.5 bg-white">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      upiLink
                    )}`}
                    alt="UPI QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <span className="text-xs text-gray-400">UPI ID: {GURU_UPI_ID}</span>
              </div>

              <button
                onClick={() => setStep(2)}
                className="bg-[#cc6600] text-white font-bold py-3.5 px-6 rounded-lg hover:bg-[#a65300] transition-colors w-full mt-2 cursor-pointer"
              >
                {t.paidBtn}
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-[#cc6600]">{t.step3Title}</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{t.birthDateLabel}</label>
                <input
                  type="date"
                  value={birthDetails.date}
                  onChange={(e) =>
                    setBirthDetails((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] text-lg w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{t.birthTimeLabel}</label>
                <input
                  type="time"
                  step="1"
                  value={birthDetails.time}
                  onChange={(e) =>
                    setBirthDetails((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] text-lg w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-bold text-gray-700">{t.birthPlaceLabel}</label>
                <input
                  type="text"
                  value={placeSearch}
                  onChange={(e) => {
                    setPlaceSearch(e.target.value);
                    setBirthDetails((prev) => ({ ...prev, place: '' }));
                  }}
                  placeholder="e.g. Surat, Gujarat"
                  className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] text-lg w-full"
                  required
                />
                {isSearching && (
                  <span className="absolute right-3 top-11 text-xs text-gray-400">
                    {t.searching}
                  </span>
                )}

                {placeSuggestions.length > 0 && (
                  <ul className="absolute z-10 top-20 left-0 w-full bg-white border border-[#e8e2d5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {placeSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectPlace(item)}
                        className="p-3 hover:bg-[#fff0e0] border-b border-[#fdfbf7] cursor-pointer text-sm"
                      >
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">{t.tzLabel}</label>
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
                  className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] text-lg w-full"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !birthDetails.place}
                className="bg-[#FF9933] text-white font-bold py-3.5 px-6 rounded-lg hover:bg-[#cc6600] transition-colors w-full mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.loading : t.submitBtn}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6 text-center py-4">
              {/* Traditional Auspicious Ganesha Icon */}
              <div className="flex justify-center text-4xl text-[#cc6600] animate-bounce">
                🕉️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#cc6600]">{t.step4Title}</h2>
                <p className="text-gray-800 text-lg font-medium mt-4 leading-relaxed">
                  {t.successMsg}
                </p>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
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
