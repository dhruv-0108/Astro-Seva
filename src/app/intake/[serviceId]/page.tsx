'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '../../../components/ui/shadcn/button';
import { Card } from '../../../components/ui/shadcn/card';
import { Input } from '../../../components/ui/shadcn/input';
import { Badge } from '../../../components/ui/shadcn/badge';
import { GURU_SERVICES, ServiceItem } from '../../../lib/services';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
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

export default function DedicatedIntakePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const service = GURU_SERVICES.find((s) => s.id === resolvedParams.serviceId) || GURU_SERVICES[1];

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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  // Exhaustive Geocoding Search (Nominatim + Photon API) for Indian villages, towns, and cities
  useEffect(() => {
    const q = placeSearch.trim();
    if (q.length < 2) {
      setPlaceSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Run parallel queries to OpenStreetMap Nominatim and Photon API
        const [nomRes, photonRes] = await Promise.allSettled([
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              q
            )}&countrycodes=in&addressdetails=1&limit=10`
          ).then((res) => res.json()),
          fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10`
          ).then((res) => res.json()),
        ]);

        let nomData = nomRes.status === 'fulfilled' && Array.isArray(nomRes.value) ? nomRes.value : [];
        
        // Fallback global Nominatim query if Indian prioritized query returned 0 results
        if (nomData.length === 0) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                q
              )}&addressdetails=1&limit=10`
            );
            nomData = await res.json();
          } catch (e) {
            console.error('Nominatim global error:', e);
          }
        }

        const photonFeatures =
          photonRes.status === 'fulfilled' && photonRes.value?.features
            ? photonRes.value.features
            : [];

        const combined: any[] = [];
        const seenCoords = new Set<string>();

        // 1. Process Nominatim results
        for (const item of nomData) {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;

          if (!seenCoords.has(key) && !isNaN(lat) && !isNaN(lon)) {
            seenCoords.add(key);

            const addr = item.address || {};
            const mainPlace =
              addr.village ||
              addr.town ||
              addr.city ||
              addr.suburb ||
              addr.hamlet ||
              addr.county ||
              item.name;
            const district = addr.state_district || addr.county || addr.district;
            const state = addr.state;
            const country = addr.country || 'India';

            const parts = [mainPlace, district, state, country].filter(Boolean);
            const cleanDisplay = Array.from(new Set(parts)).join(', ');
            const typeLabel = addr.village
              ? 'Village'
              : addr.town
              ? 'Town'
              : addr.city
              ? 'City'
              : addr.hamlet
              ? 'Village'
              : 'Location';

            combined.push({
              display_name: cleanDisplay || item.display_name,
              full_name: item.display_name,
              lat: lat,
              lon: lon,
              type: typeLabel,
            });
          }
        }

        // 2. Process Photon API results
        for (const feat of photonFeatures) {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [0, 0];
          const lon = coords[0];
          const lat = coords[1];
          const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;

          if (!seenCoords.has(key) && lat !== 0 && lon !== 0) {
            seenCoords.add(key);

            const mainPlace = props.name || props.city || props.town || props.village;
            const district = props.county || props.district || props.city;
            const state = props.state;
            const country = props.country || 'India';

            const parts = [mainPlace, district, state, country].filter(Boolean);
            const cleanDisplay = Array.from(new Set(parts)).join(', ');
            const typeLabel =
              props.osm_value === 'village'
                ? 'Village'
                : props.osm_value === 'town'
                ? 'Town'
                : props.type === 'city'
                ? 'City'
                : 'Location';

            combined.push({
              display_name: cleanDisplay,
              full_name: `${cleanDisplay} ${props.postcode ? `(${props.postcode})` : ''}`,
              lat: lat,
              lon: lon,
              type: typeLabel,
            });
          }
        }

        setPlaceSuggestions(combined);
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [placeSearch]);

  const handleSelectPlace = (item: any) => {
    const cleanName = item.display_name || item.full_name;

    setBirthDetails((prev) => ({
      ...prev,
      place: cleanName,
      lat: item.lat,
      lng: item.lon,
    }));
    setPlaceSearch(cleanName);
    setPlaceSuggestions([]);
  };

  const fullPhoneNumber = `${countryCode} ${phoneRaw.trim()}`;

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
      const urlParams = new URLSearchParams(window.location.search);
      const utrParam = urlParams.get('utr') || '';

      const docRef = await addDoc(collection(db, 'submissions'), {
        name: name.trim(),
        phone: fullPhoneNumber,
        serviceSelected: {
          id: service.id,
          title: service.titleEN,
          price: service.price,
        },
        birthDetails: {
          ...birthDetails,
          date: birthDetails.date,
          time: birthDetails.time,
        },
        paymentStatus: 'user_declared_paid',
        paymentDeclared: true,
        utrNumber: utrParam,
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
          serviceTitle: service.titleEN,
          servicePrice: service.price,
          birthDetails,
          utrNumber: utrParam,
        }),
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setFormError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] font-sans selection:bg-amber-100 antialiased flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-30 px-6 sm:px-12 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push(`/pay/${service.id}`)}
          className="flex items-center gap-2 text-stone-600 hover:text-[#1F1E1B] text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          <span>Back to Payment</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-[#A14E15]">
            <Sparkles className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-[#1F1E1B]">Shree Ganeshambika Jyotish</span>
        </div>
      </header>

      {/* Main Intake Section */}
      <main className="max-w-xl mx-auto py-12 px-4 sm:px-6 w-full space-y-8 my-auto">
        
        {/* Step Header */}
        <div className="text-center space-y-2">
          <Badge variant="default" className="mx-auto bg-amber-100/90 text-[#A14E15] border-amber-300 px-3.5 py-1 text-[12px] font-semibold">
            Step 2 of 2 • Tell Us About Yourself
          </Badge>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
            Provide Birth Details
          </h2>
          <p className="text-[14px] text-stone-500 font-normal max-w-sm mx-auto">
            Provide exact birth details so Guruji can calculate your chart and prepare your report.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          {!isSubmitted ? (
            <form onSubmit={handleSubmitDetails} className="space-y-5 text-left">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-[14px] font-normal flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 stroke-[1.75] text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Service Summary Badge */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex justify-between items-center">
                <span className="text-[12px] text-stone-600 font-medium">Selected Plan:</span>
                <span className="text-[14px] font-bold text-[#A14E15]">
                  {service.titleEN} — ₹{service.price.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                  <span>Full Name</span>
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
                  <span>WhatsApp Number</span>
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

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                  <span>Date of Birth</span>
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

              {/* Time of Birth */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                  <span>Exact Time of Birth</span>
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

              {/* Birth Place Search */}
              <div className="space-y-1.5 relative" ref={searchContainerRef}>
                <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                  <span>Place of Birth (City / Town)</span>
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
                    Searching...
                  </span>
                )}

                {placeSuggestions.length > 0 && (
                  <ul className="absolute z-30 top-[82px] left-0 w-full bg-white border border-stone-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto divide-y divide-stone-100">
                    {placeSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectPlace(item)}
                        className="p-3.5 hover:bg-amber-50/70 cursor-pointer text-[14px] font-medium text-stone-800 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-4 h-4 stroke-[1.75] text-[#A14E15] shrink-0" />
                          <span className="truncate">{item.display_name}</span>
                        </div>
                        {item.type && (
                          <span className="text-[10px] font-bold font-mono uppercase bg-amber-100/80 text-[#853E0F] px-2 py-0.5 rounded-md shrink-0 border border-amber-200/80">
                            {item.type}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Timezone Selector */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75] text-[#A14E15]" />
                  <span>Timezone</span>
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
                {isSubmitting ? 'Submitting...' : 'Submit Consultation Details'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[24px] font-bold text-[#1F1E1B]">Details Received</h3>
                <p className="text-[#1F1E1B] text-[16px] font-medium leading-relaxed max-w-md mx-auto">
                  Hari Om. Your birth details & payment notification have been submitted to Guruji.
                </p>
                <p className="text-stone-500 text-[14px] leading-relaxed max-w-sm mx-auto font-normal">
                  Guruji will verify the payment and share your complete Kundli report directly to your WhatsApp.
                </p>
              </div>
              <div className="pt-2">
                <Button onClick={() => router.push('/')} variant="outline" className="rounded-2xl">
                  <span>Return to Home</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[12px] text-stone-500 border-t border-stone-200/60">
        © {new Date().getFullYear()} Shree Ganeshambika Jyotish. All rights reserved.
      </footer>
    </div>
  );
}
