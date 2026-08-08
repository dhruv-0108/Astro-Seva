'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../lib/firebase/config';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { Button } from '../../components/ui/shadcn/button';
import { Card } from '../../components/ui/shadcn/card';
import { Input } from '../../components/ui/shadcn/input';
import { Badge } from '../../components/ui/shadcn/badge';
import { CustomDatePicker, CustomTimePicker } from '../../components/CustomDateTimePicker';
import { GURU_SERVICES } from '../../lib/services';
import {
  Sparkles,
  LogOut,
  ExternalLink,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Phone,
  User as UserIcon,
  Lock,
  ListFilter,
  Check,
  Hourglass,
  Globe,
  Plus,
  Edit3,
  X,
  Search,
} from 'lucide-react';

interface ClientSubmission {
  id: string;
  name: string;
  phone: string;
  serviceSelected?: {
    id: string;
    title: string;
    price: number;
  };
  birthDetails: {
    date: string;
    time: string;
    place: string;
    lat: number;
    lng: number;
    tzOffset: number;
  };
  paymentStatus: 'pending' | 'paid';
  createdAt: any;
}

type Language = 'EN' | 'GU' | 'HI';

const ADMIN_TRANSLATIONS: Record<Language, {
  portalTitle: string;
  portalSubtitle: string;
  loginTitle: string;
  loginSubtitle: string;
  loginButton: string;
  logoutButton: string;
  totalSubmissions: string;
  paidApproved: string;
  pendingApproval: string;
  sectionTitle: string;
  sectionSubtitle: string;
  noSubmissions: string;
  clientInfo: string;
  birthDetails: string;
  paymentStatus: string;
  actions: string;
  approve: string;
  viewKundli: string;
  whatsapp: string;
  deleteConfirm: string;
  paidBadge: string;
  pendingBadge: string;
  createNew: string;
  searchPlaceholder: string;
}> = {
  EN: {
    portalTitle: 'Guruji Dashboard',
    portalSubtitle: 'Astro-Seva Management Panel',
    loginTitle: 'Guruji Portal Login',
    loginSubtitle: 'Astro-Seva Administration Panel',
    loginButton: 'Sign In to Dashboard',
    logoutButton: 'Log Out',
    totalSubmissions: 'Total Submissions',
    paidApproved: 'Paid / Approved',
    pendingApproval: 'Pending Approval',
    sectionTitle: 'Client Consultation Records',
    sectionSubtitle: 'Real-time database of intake forms & generated Kundlis',
    noSubmissions: 'No consultation records found.',
    clientInfo: 'Client Name & Phone',
    birthDetails: 'Birth Details & Place',
    paymentStatus: 'Status',
    actions: 'Quick Actions',
    approve: 'Approve Payment',
    viewKundli: 'View Kundli',
    whatsapp: 'WhatsApp',
    deleteConfirm: 'Are you sure you want to delete this consultation record?',
    paidBadge: 'Paid / Active',
    pendingBadge: 'Pending Verification',
    createNew: '+ New Kundli Entry',
    searchPlaceholder: 'Search by Name, Phone, or Village/City...',
  },
  GU: {
    portalTitle: 'ગુરુજી ડેશબોર્ડ',
    portalSubtitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સંચાલન પટલ',
    loginTitle: 'ગુરુજી પોર્ટલ લૉગિન',
    loginSubtitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સંચાલન પટલ',
    loginButton: 'ડેશબોર્ડમાં પ્રવેશ કરો',
    logoutButton: 'લૉગ આઉટ',
    totalSubmissions: 'કુલ અરજીઓ',
    paidApproved: 'ચૂકવેલ / માન્ય',
    pendingApproval: 'ચકાસણી બાકી',
    sectionTitle: 'ગ્રાહક પરામર્શ રેકોર્ડ્સ',
    sectionSubtitle: 'જન્મ વિગતો અને કુંડળી રેકોર્ડ્સની યાદી',
    noSubmissions: 'કોઈ પરામર્શ રેકોર્ડ મળ્યો નથી.',
    clientInfo: 'ગ્રાહક નામ અને ફોન',
    birthDetails: 'જન્મ વિગતો અને સ્થાન',
    paymentStatus: 'સ્થિતિ',
    actions: 'ઝડપી પ્રક્રિયા',
    approve: 'ચૂકવણી મંજૂર કરો',
    viewKundli: 'કુંડળી જુઓ',
    whatsapp: 'વોટ્સએપ',
    deleteConfirm: 'શું તમે ખરેખર આ પરામર્શ રેકોર્ડ કાઢી નાખવા માંગો છો?',
    paidBadge: 'ચૂકવેલ / સક્રિય',
    pendingBadge: 'ચકાસણી બાકી',
    createNew: '+ નવી કુંડળી નોંધ',
    searchPlaceholder: 'નામ, ફોન અથવા ગામ/શહેર શોધો...',
  },
  HI: {
    portalTitle: 'गुरुजी डैशबोर्ड',
    portalSubtitle: 'श्री गणेशाम्बिका ज्योतिष प्रबंधन पैनल',
    loginTitle: 'गुरुजी पोर्टल लॉगिन',
    loginSubtitle: 'श्री गणेशाम्बिका ज्योतिष प्रशासन पैनल',
    loginButton: 'डैशबोर्ड में प्रवेश करें',
    logoutButton: 'लॉग आउट',
    totalSubmissions: 'कुल आवेदन',
    paidApproved: 'भुगतान / स्वीकृत',
    pendingApproval: 'सत्यापन लंबित',
    sectionTitle: 'ग्राहक परामर्श रिकॉर्ड्स',
    sectionSubtitle: 'जन्म विवरण एवं निर्मित कुंडलियों का रिकॉर्ड',
    noSubmissions: 'कोई परामर्श रिकॉर्ड नहीं मिला।',
    clientInfo: 'ग्राहक नाम एवं फोन',
    birthDetails: 'जन्म विवरण एवं स्थान',
    paymentStatus: 'स्थिति',
    actions: 'त्वरित कार्रवाई',
    approve: 'भुगतान स्वीकृत करें',
    viewKundli: 'कुंडली देखें',
    whatsapp: 'व्हाट्सएप',
    deleteConfirm: 'क्या आप निश्चित रूप से इस परामर्श रिकॉर्ड को हटाना चाहते हैं?',
    paidBadge: 'भुगतान / सक्रिय',
    pendingBadge: 'सत्यापन लंबित',
    createNew: '+ नई कुंडली प्रविष्टि',
    searchPlaceholder: 'नाम, फोन या गांव/शहर खोजें...',
  }
};

export default function AdminPage() {
  const [lang, setLang] = useState<Language>('GU');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [submissions, setSubmissions] = useState<ClientSubmission[]>([]);
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Modal State for Creating/Editing Submissions
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceId: 'kundli-reading',
    date: '1995-01-01',
    time: '12:00',
    place: '',
    lat: 0,
    lng: 0,
    tzOffset: 5.5,
    paymentStatus: 'paid' as 'pending' | 'paid',
  });

  const [placeSearch, setPlaceSearch] = useState<string>('');
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
  const [isPlaceSearching, setIsPlaceSearching] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const t = ADMIN_TRANSLATIONS[lang];

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch submissions from Firestore (Real-time listener)
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ClientSubmission[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as ClientSubmission);
      });
      setSubmissions(list);
    });

    return () => unsubscribe();
  }, [user]);

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

  // Exhaustive Multi-Source Location Fetcher (Nominatim + Photon API) for Admin Form
  useEffect(() => {
    const q = placeSearch.trim();
    if (q.length < 2) {
      setPlaceSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsPlaceSearching(true);
      try {
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
        if (nomData.length === 0) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                q
              )}&addressdetails=1&limit=10`
            );
            nomData = await res.json();
          } catch (e) {
            console.error(e);
          }
        }

        const photonFeatures =
          photonRes.status === 'fulfilled' && photonRes.value?.features
            ? photonRes.value.features
            : [];

        const combined: any[] = [];
        const seenCoords = new Set<string>();

        // Process Nominatim results
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

        // Process Photon API results
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
        setIsPlaceSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [placeSearch]);

  const handleSelectPlace = (item: any) => {
    const cleanName = item.display_name || item.full_name;
    setFormData((prev) => ({
      ...prev,
      place: cleanName,
      lat: item.lat,
      lng: item.lon,
    }));
    setPlaceSearch(cleanName);
    setPlaceSuggestions([]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setLoginError('Login failed. Please check your email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleApprove = async (id: string) => {
    try {
      const docRef = doc(db, 'submissions', id);
      await updateDoc(docRef, { paymentStatus: 'paid' });
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      phone: '+91 ',
      serviceId: 'kundli-reading',
      date: '1995-01-01',
      time: '12:00',
      place: '',
      lat: 0,
      lng: 0,
      tzOffset: 5.5,
      paymentStatus: 'paid',
    });
    setPlaceSearch('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: ClientSubmission) => {
    setEditingId(client.id);
    const selectedServiceId = client.serviceSelected?.id || 'kundli-reading';
    setFormData({
      name: client.name,
      phone: client.phone,
      serviceId: selectedServiceId,
      date: client.birthDetails.date,
      time: client.birthDetails.time,
      place: client.birthDetails.place,
      lat: client.birthDetails.lat,
      lng: client.birthDetails.lng,
      tzOffset: client.birthDetails.tzOffset || 5.5,
      paymentStatus: client.paymentStatus,
    });
    setPlaceSearch(client.birthDetails.place);
    setIsModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.place.trim() || formData.lat === 0) {
      alert('Please select a valid place from the suggestions dropdown.');
      return;
    }

    const srv = GURU_SERVICES.find((s) => s.id === formData.serviceId) || GURU_SERVICES[0];

    const submissionPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      serviceSelected: {
        id: srv.id,
        title: srv.titleEN,
        price: srv.price,
      },
      birthDetails: {
        date: formData.date,
        time: formData.time,
        place: formData.place,
        lat: formData.lat,
        lng: formData.lng,
        tzOffset: formData.tzOffset,
      },
      paymentStatus: formData.paymentStatus,
      createdAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const docRef = doc(db, 'submissions', editingId);
        await updateDoc(docRef, submissionPayload);
      } else {
        await addDoc(collection(db, 'submissions'), submissionPayload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving submission:', err);
      alert('Failed to save. Please try again.');
    }
  };

  // WhatsApp Share with strict tab & opener isolation
  const handleWhatsAppShare = (client: ClientSubmission) => {
    const liveOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://astro-seva-mocha.vercel.app';
    const kundliUrl = `${liveOrigin}/kundli/${client.id}`;
    const message = `Hari Om, ${client.name}.\nYour Kundli report prepared by Narendragiri Goswami Ji is ready.\nClick here to view your complete Kundli:\n${kundliUrl}`;
    
    let cleanDigits = client.phone.replace(/\D/g, '');
    if (cleanDigits.length === 10) {
      cleanDigits = `91${cleanDigits}`;
    }
    
    const waUrl = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Filter submissions by Search Query
  const filteredSubmissions = submissions.filter((c) => {
    if (!filterSearch.trim()) return true;
    const term = filterSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.birthDetails.place.toLowerCase().includes(term)
    );
  });

  const paidCount = submissions.filter((s) => s.paymentStatus === 'paid').length;
  const pendingCount = submissions.filter((s) => s.paymentStatus === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#A14E15] animate-spin mx-auto stroke-[1.75]" />
          <p className="text-sm font-medium text-stone-500">Loading Guruji Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12">
        <Card className="w-full max-w-md p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xl space-y-6 text-left">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-[#A14E15]">
                <Sparkles className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-stone-900 leading-tight">{t.loginTitle}</h1>
                <p className="text-xs text-stone-500">{t.loginSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
              {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    lang === l ? 'bg-[#7A1C28] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700">
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#A14E15]" />
                <span>Admin Email</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guruji@astro.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-stone-900 text-sm focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#A14E15]" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-stone-900 text-sm focus:bg-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-sm font-bold shadow-md rounded-2xl mt-4"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Authenticating...' : t.loginButton}
            </Button>
          </form>

        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 antialiased pb-24">
      
      {/* Top Sacred Chanting Bar - Center Top in small text size, single horizontal line without wrapping */}
      <div className="w-full bg-[#FAF6EE] border-b border-amber-200/60 py-1 text-center whitespace-nowrap overflow-hidden">
        <span className="text-[11px] sm:text-xs font-bold text-[#A14E15] font-serif tracking-widest">
          {lang === 'EN' ? '॥ Shree Ganeshay Namah ॥' : lang === 'GU' ? '॥ શ્રી ગણેશાય નમઃ ॥' : '॥ श्री गणेशाय नमः ॥'}
        </span>
      </div>

      {/* Navigation Header - Non-sticky (scrolls away naturally when scrolling down) */}
      <header className="bg-white border-b border-stone-200/80 px-4 sm:px-12 py-2.5 sm:py-3.5 flex justify-between items-center gap-2 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-[#A14E15] shrink-0">
            <Sparkles className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight truncate">{t.portalTitle}</h1>
            <p className="text-[10px] sm:text-xs text-stone-500 font-normal truncate hidden sm:block">{t.portalSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector Switcher */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-stone-100 p-0.5 sm:p-1 rounded-xl border border-stone-200">
            {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  lang === l ? 'bg-[#7A1C28] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-stone-200 text-stone-700 hover:bg-stone-100 text-xs h-8 px-2 sm:px-3"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            <span className="hidden sm:inline">{t.logoutButton}</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 text-left">
        
        {/* Top Action & Stat Cards Row - Single horizontal row on all viewports */}
        <div className="flex items-center justify-between gap-3 whitespace-nowrap overflow-x-auto scrollbar-none pb-1">
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-stone-900 tracking-tight whitespace-nowrap">{t.sectionTitle}</h2>
            <p className="text-xs text-stone-500 font-medium whitespace-nowrap hidden sm:block">{t.sectionSubtitle}</p>
          </div>

          {/* Add New Entry Button */}
          <Button
            onClick={handleOpenCreateModal}
            className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-bold px-3.5 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.createNew}</span>
          </Button>
        </div>

        {/* Stats Row - Single horizontal touch scroll row on mobile */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
          <Card className="p-3 sm:p-5 flex items-center justify-between bg-white border border-stone-200/80 shadow-xs min-w-[110px]">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider block">{t.totalSubmissions}</span>
              <span className="text-lg sm:text-2xl font-extrabold text-stone-900 mt-0.5 block">{submissions.length}</span>
            </div>
            <div className="p-2 sm:p-3 bg-stone-100 text-stone-600 rounded-xl sm:rounded-2xl hidden sm:block">
              <ListFilter className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-3 sm:p-5 flex items-center justify-between bg-white border border-stone-200/80 shadow-xs min-w-[110px]">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider block">{t.paidApproved}</span>
              <span className="text-lg sm:text-2xl font-extrabold text-emerald-700 mt-0.5 block">{paidCount}</span>
            </div>
            <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-700 rounded-xl sm:rounded-2xl hidden sm:block">
              <Check className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-3 sm:p-5 flex items-center justify-between bg-white border border-stone-200/80 shadow-xs min-w-[110px]">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#A14E15] uppercase tracking-wider block">{t.pendingApproval}</span>
              <span className="text-lg sm:text-2xl font-extrabold text-[#A14E15] mt-0.5 block">{pendingCount}</span>
            </div>
            <div className="p-2 sm:p-3 bg-amber-50 text-[#A14E15] rounded-xl sm:rounded-2xl hidden sm:block">
              <Hourglass className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Submissions Container */}
        <Card className="p-0 overflow-hidden bg-white border border-stone-200/80 shadow-xs">
          
          <div className="p-3 sm:p-6 border-b border-stone-200/60 bg-stone-50/50 flex flex-row items-center justify-between gap-3">
            
            {/* Search Input Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10 transition-all font-medium"
              />
            </div>

            <Badge variant="secondary" className="shrink-0 text-[10px] sm:text-xs">
              Auto TTL: 30 Days
            </Badge>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-20 text-center text-stone-400 space-y-2 font-medium">
              <ListFilter className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm">{t.noSubmissions}</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full scrollbar-thin">
              {/* UNIFIED HORIZONTAL TABLE VIEW (Strict 1 single line per row on mobile & desktop) */}
              <table className="w-full text-xs text-left whitespace-nowrap min-w-[720px]">
                <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 sm:p-4">{t.clientInfo}</th>
                    <th className="p-3.5 sm:p-4">{t.birthDetails}</th>
                    <th className="p-3.5 sm:p-4 text-center">{t.paymentStatus}</th>
                    <th className="p-3.5 sm:p-4 text-center">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {filteredSubmissions.map((client) => (
                    <tr key={client.id} className="hover:bg-amber-50/20 transition-colors whitespace-nowrap">
                      {/* Client Info */}
                      <td className="p-3.5 sm:p-4">
                        <div className="font-bold text-sm sm:text-base text-stone-900">{client.name}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{client.phone}</span>
                        </div>
                        {client.serviceSelected && (
                          <div className="mt-1">
                            <Badge variant="default" className="text-[10px] font-semibold">
                              {client.serviceSelected.title} (₹{client.serviceSelected.price})
                            </Badge>
                          </div>
                        )}
                      </td>

                      {/* Birth Details (Single Horizontal Line) */}
                      <td className="p-3.5 sm:p-4 text-xs">
                        <div className="flex items-center gap-2 text-stone-800 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#A14E15] shrink-0" />
                            <span className="font-bold">{client.birthDetails.date}</span>
                          </div>
                          <span className="text-stone-300">|</span>
                          <div className="flex items-center gap-1 text-stone-600">
                            <Clock className="w-3.5 h-3.5 text-[#A14E15] shrink-0" />
                            <span>{client.birthDetails.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-stone-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#A14E15] shrink-0" />
                          <span className="truncate max-w-[220px]" title={client.birthDetails.place}>
                            {client.birthDetails.place}
                          </span>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                        <Badge variant={client.paymentStatus === 'paid' ? 'emerald' : 'default'} className="whitespace-nowrap text-[11px]">
                          {client.paymentStatus === 'paid' ? t.paidBadge : t.pendingBadge}
                        </Badge>
                      </td>

                      {/* Actions (Single Horizontal Line of Buttons) */}
                      <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                          {client.paymentStatus === 'pending' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(client.id)}
                              className="h-8 px-2.5 text-xs whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t.approve}</span>
                            </Button>
                          )}

                          {client.paymentStatus === 'paid' && (
                            <>
                              <a
                                href={`/kundli/${client.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-[#A14E15] hover:bg-[#853E0F] text-white font-bold py-1.5 px-3 rounded-xl text-xs shadow-xs whitespace-nowrap"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{t.viewKundli}</span>
                              </a>

                              <button
                                onClick={() => handleWhatsAppShare(client)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{t.whatsapp}</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleOpenEditModal(client)}
                            className="text-stone-500 hover:text-amber-700 hover:bg-amber-50 p-1.5 rounded-lg text-xs transition-all cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(client.id)}
                            className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg text-xs transition-all cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </Card>
      </main>

      {/* CREATE / EDIT KUNDLI ENTRY MODAL WITH EXHAUSTIVE VILLAGE LOCATION FETCHER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-left my-8">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100/80 text-[#A14E15] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {editingId ? 'Edit Kundli Entry' : 'Create New Kundli Entry'}
                  </h3>
                  <p className="text-xs text-stone-500">Exhaustive Village & City Geocoding Enabled</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              
              {/* Client Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Client Full Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Rameshchandra Varachhiya"
                  className="w-full rounded-2xl p-3.5 text-sm"
                  required
                />
              </div>

              {/* Client Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  WhatsApp Phone Number
                </label>
                <Input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="w-full rounded-2xl p-3.5 text-sm"
                  required
                />
              </div>

              {/* Service Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Service Package
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full bg-white border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-900 outline-none focus:border-[#A14E15]"
                >
                  {GURU_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titleEN} - ₹{s.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Intuitive Date & Time Selection Widgets */}
              <div className="space-y-3.5 pt-1">
                <CustomDatePicker
                  value={formData.date}
                  onChange={(newDate) => setFormData((prev) => ({ ...prev, date: newDate }))}
                  label="Birth Date"
                />

                <CustomTimePicker
                  value={formData.time}
                  onChange={(newTime) => setFormData((prev) => ({ ...prev, time: newTime }))}
                  label="Birth Time"
                />
              </div>

              {/* Birth Place Search Input (Exhaustive Nominatim + Photon Fetcher) */}
              <div className="space-y-1 relative" ref={searchContainerRef}>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Place of Birth (Village / Town / City)</span>
                  {formData.lat !== 0 && (
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      ✓ Coords Verified ({formData.lat.toFixed(2)}, {formData.lng.toFixed(2)})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={placeSearch}
                  onChange={(e) => {
                    setPlaceSearch(e.target.value);
                    setFormData((prev) => ({ ...prev, place: '', lat: 0, lng: 0 }));
                  }}
                  placeholder="Type any Indian village or city (e.g. Gariadhar, Talaja, Vanthali)"
                  className="w-full bg-white border border-stone-200 rounded-2xl p-3.5 text-sm text-stone-900 outline-none focus:border-[#A14E15] focus:ring-2 focus:ring-amber-500/10"
                  required
                />

                {isPlaceSearching && (
                  <span className="absolute right-3.5 top-9 text-[11px] text-[#A14E15] font-semibold animate-pulse">
                    Searching...
                  </span>
                )}

                {placeSuggestions.length > 0 && (
                  <ul className="absolute z-50 top-[68px] left-0 w-full bg-white border border-stone-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-stone-100">
                    {placeSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectPlace(item)}
                        className="p-3 hover:bg-amber-50/70 cursor-pointer text-xs font-medium text-stone-800 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#A14E15] shrink-0" />
                          <span className="truncate">{item.display_name}</span>
                        </div>
                        {item.type && (
                          <span className="text-[9px] font-bold font-mono uppercase bg-amber-100 text-[#853E0F] px-1.5 py-0.5 rounded-md shrink-0">
                            {item.type}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Payment Status Option */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Payment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentStatus: 'paid' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.paymentStatus === 'paid'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Paid / Approved
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentStatus: 'pending' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formData.paymentStatus === 'pending'
                        ? 'bg-[#A14E15] text-white border-[#853E0F] shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Pending Verification
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] text-white font-bold rounded-xl text-xs px-6 py-3"
                >
                  {editingId ? 'Save Changes' : 'Create & Generate Entry'}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
