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
import PWAInstallBanner from '../../components/PWAInstallBanner';
import { GURU_SERVICES } from '../../lib/services';
import { resolveHistoricalTimezone } from '../../lib/astrology/timezone';
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
  Info,
  AlertTriangle,
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
  modalTitleCreate: string;
  modalTitleEdit: string;
  modalSubtitle: string;
  clientNameLabel: string;
  clientNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  serviceLabel: string;
  birthDateLabel: string;
  birthTimeLabel: string;
  birthPlaceLabel: string;
  birthPlacePlaceholder: string;
  paymentStatusLabel: string;
  paidOption: string;
  pendingOption: string;
  cancelBtn: string;
  submitBtnCreate: string;
  submitBtnEdit: string;
  summaryTitle: string;
  summaryName: string;
  summaryPhone: string;
  summaryDateTime: string;
  summaryPlace: string;
  locationTip: string;
}> = {
  EN: {
    portalTitle: 'Guruji Dashboard',
    portalSubtitle: 'Astro-Seva Management Panel',
    loginTitle: 'Guruji Portal Login',
    loginSubtitle: 'Astro-Seva Administration Panel',
    loginButton: 'Sign In to Dashboard',
    logoutButton: 'Log Out',
    totalSubmissions: 'Total Submissions',
    paidApproved: 'Paid',
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
    paidBadge: 'Paid',
    pendingBadge: 'Pending Verification',
    createNew: 'New Kundli Entry',
    searchPlaceholder: 'Search by Name, Phone, or Village/City...',
    modalTitleCreate: 'Create New Kundli Entry',
    modalTitleEdit: 'Edit Kundli Entry',
    modalSubtitle: 'Exhaustive Village & City Geocoding Enabled',
    clientNameLabel: 'Client Full Name',
    clientNamePlaceholder: 'e.g. Rameshchandra Varachhiya',
    phoneLabel: 'WhatsApp Phone Number',
    phonePlaceholder: '9876543210',
    serviceLabel: 'Service Package',
    birthDateLabel: 'Birth Date',
    birthTimeLabel: 'Birth Time',
    birthPlaceLabel: 'Place of Birth (Village / Town / City)',
    birthPlacePlaceholder: 'Type any Indian village or city (e.g. Gola, Olpad, Vanthali)',
    paymentStatusLabel: 'Payment Status',
    paidOption: 'Paid / Approved',
    pendingOption: 'Pending Verification',
    cancelBtn: 'Cancel',
    submitBtnCreate: 'Create & Generate Entry',
    submitBtnEdit: 'Save Changes',
    summaryTitle: 'Selected Details Summary',
    summaryName: 'Name:',
    summaryPhone: 'Phone:',
    summaryDateTime: 'Date & Time:',
    summaryPlace: 'Place:',
    locationTip: 'If exact village is not found, select nearest Taluka or City.',
  },
  GU: {
    portalTitle: 'ગુરુજી ડેશબોર્ડ',
    portalSubtitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સંચાલન પટલ',
    loginTitle: 'ગુરુજી પોર્ટલ લૉગિન',
    loginSubtitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સંચાલન પટલ',
    loginButton: 'ડેશબોર્ડમાં પ્રવેશ કરો',
    logoutButton: 'લૉગ આઉટ',
    totalSubmissions: 'કુલ અરજીઓ',
    paidApproved: 'ચૂકવેલ',
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
    paidBadge: 'ચૂકવેલ',
    pendingBadge: 'ચકાસણી બાકી',
    createNew: 'નવી કુંડળી નોંધ',
    searchPlaceholder: 'નામ, ફોન અથવા ગામ/શહેર શોધો...',
    modalTitleCreate: 'નવી કુંડળી નોંધ ઉમેરો',
    modalTitleEdit: 'કુંડળી વિગતો સુધારો',
    modalSubtitle: 'તમામ ભારતીય ગામો અને શહેરો શોધવા માટે સક્ષમ',
    clientNameLabel: 'ગ્રાહકનું પૂરું નામ',
    clientNamePlaceholder: 'દા.ત. રમેશચંદ્ર વરાછીયા',
    phoneLabel: 'વોટ્સએપ ફોન નંબર',
    phonePlaceholder: '૯૮૭૬૫૪૩૨૧૦',
    serviceLabel: 'સેવા પેકેજ પસંદ કરો',
    birthDateLabel: 'જન્મ તારીખ',
    birthTimeLabel: 'જન્મ સમય',
    birthPlaceLabel: 'જન્મ સ્થળ (ગામ / તાલુકા / શહેર)',
    birthPlacePlaceholder: 'કોઈપણ ગામ કે શહેર લખો (દા.ત. ગોલા, ઓલપાડ, વંથલી)',
    paymentStatusLabel: 'ચૂકવણી સ્થિતિ',
    paidOption: 'ચૂકવેલ / મંજૂર',
    pendingOption: 'ચકાસણી બાકી',
    cancelBtn: 'રદ કરો',
    submitBtnCreate: 'કુંડળી બનાવો અને સેવ કરો',
    submitBtnEdit: 'ફેરફારો સેવ કરો',
    summaryTitle: 'દાખલ કરેલી વિગતોની ચકાસણી',
    summaryName: 'નામ:',
    summaryPhone: 'ફોન:',
    summaryDateTime: 'તારીખ અને સમય:',
    summaryPlace: 'સ્થળ:',
    locationTip: 'ગામ કે વિસ્તાર ન મળે તો નજીકનું તાલુકા કે શહેર પસંદ કરો.',
  },
  HI: {
    portalTitle: 'गुरुजी डैशबोर्ड',
    portalSubtitle: 'श्री गणेशाम्बिका ज्योतिष प्रबंधन पैनल',
    loginTitle: 'गुरुजी पोर्टल लॉगिन',
    loginSubtitle: 'श्री गणेशाम्बिका ज्योतिष प्रशासन पैनल',
    loginButton: 'डैशबोर्ड में प्रवेश करें',
    logoutButton: 'लॉग आउट',
    totalSubmissions: 'कुल आवेदन',
    paidApproved: 'भुगतान',
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
    deleteConfirm: 'क्या आप वाकई इस परामर्श रिकॉर्ड को हटाना चाहते हैं?',
    paidBadge: 'भुगतान',
    pendingBadge: 'सत्यापन लंबित',
    createNew: 'नई कुंडली प्रविष्टि',
    searchPlaceholder: 'नाम, फोन या गांव/शहर खोजें...',
    modalTitleCreate: 'नई कुंडली प्रविष्टि जोड़ें',
    modalTitleEdit: 'कुंडली विवरण संपादित करें',
    modalSubtitle: 'सभी भारतीय गांवों और शहरों की खोज सक्षम',
    clientNameLabel: 'ग्राहक का पूरा नाम',
    clientNamePlaceholder: 'जैसे रमेशचंद्र वराछिया',
    phoneLabel: 'व्हाट्सएप फोन नंबर',
    phonePlaceholder: '9876543210',
    serviceLabel: 'सेवा पैकेज चुनें',
    birthDateLabel: 'जन्म तिथि',
    birthTimeLabel: 'जन्म समय',
    birthPlaceLabel: 'जन्म स्थान (गांव / तहसील / शहर)',
    birthPlacePlaceholder: 'कोई भी गांव या शहर लिखें (जैसे गोला, ओलपाड, वंथली)',
    paymentStatusLabel: 'भुगतान स्थिति',
    paidOption: 'भुगतान स्वीकृत',
    pendingOption: 'सत्यापन लंबित',
    cancelBtn: 'रद्द करें',
    submitBtnCreate: 'कुंडली बनाएं एवं सहेजें',
    submitBtnEdit: 'परिवर्तन सहेजें',
    summaryTitle: 'दर्ज विवरण का सत्यापन',
    summaryName: 'नाम:',
    summaryPhone: 'फोन:',
    summaryDateTime: 'तिथि एवं समय:',
    summaryPlace: 'स्थान:',
    locationTip: 'गांव या क्षेत्र न मिले तो नजदीकी तालुका या शहर चुनें।',
  }
};

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'UK' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman' },
  { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+977', country: 'NP', flag: '🇳🇵', name: 'Nepal' },
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+94', country: 'LK', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+880', country: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+92', country: 'PK', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+62', country: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+63', country: 'PH', flag: '🇵🇭', name: 'Philippines' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
];

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

  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneDigits, setPhoneDigits] = useState<string>('');

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
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [invalidFields, setInvalidFields] = useState<{
    name?: boolean;
    phone?: boolean;
    date?: boolean;
    time?: boolean;
    place?: boolean;
  }>({});
  const [isPlaceSearching, setIsPlaceSearching] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const justSelectedPlaceRef = useRef<boolean>(false);

  const t = ADMIN_TRANSLATIONS[lang];

  const hasUnsavedChanges = () => {
    return (
      formData.name.trim().length > 0 ||
      placeSearch.trim().length > 0 ||
      phoneDigits.trim().length > 0
    );
  };

  const handleAttemptCloseModal = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardModal(true);
    } else {
      setIsModalOpen(false);
      setFormError('');
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    setIsModalOpen(false);
    setFormError('');
  };

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

  // Exhaustive Multi-Source Location Fetcher via Server-Side API (/api/location/search)
  useEffect(() => {
    if (justSelectedPlaceRef.current) {
      justSelectedPlaceRef.current = false;
      setPlaceSuggestions([]);
      return;
    }

    const q = placeSearch.trim();
    if (q.length < 2) {
      setPlaceSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsPlaceSearching(true);
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setPlaceSuggestions(data.results);
        } else {
          setPlaceSuggestions([]);
        }
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
    justSelectedPlaceRef.current = true;
    setPlaceSuggestions([]);
    setPlaceSearch(cleanName);

    const tzRes = resolveHistoricalTimezone(
      formData.date || '1995-01-01',
      formData.time || '12:00',
      item.lat,
      item.lon
    );

    setFormData((prev) => ({
      ...prev,
      place: cleanName,
      lat: item.lat,
      lng: item.lon,
      tzOffset: tzRes.tzOffset,
    }));
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
    justSelectedPlaceRef.current = true;
    setEditingId(null);
    setCountryCode('+91');
    setPhoneDigits('');
    setFormData({
      name: '',
      phone: '',
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
    setPlaceSuggestions([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: ClientSubmission) => {
    justSelectedPlaceRef.current = true;
    setEditingId(client.id);
    
    let matchedCode = '+91';
    let rawDigits = (client.phone || '').trim();
    
    for (const c of COUNTRY_CODES) {
      if (rawDigits.startsWith(c.code)) {
        matchedCode = c.code;
        rawDigits = rawDigits.slice(c.code.length).trim();
        break;
      }
    }
    setCountryCode(matchedCode);
    setPhoneDigits(rawDigits);

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
    setPlaceSuggestions([]);
    setIsModalOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setInvalidFields({});

    const nameClean = formData.name.trim();
    const phoneClean = phoneDigits.replace(/\D/g, '');
    const targetPlace = (formData.place || placeSearch).trim();

    const errors: typeof invalidFields = {};
    if (!nameClean || nameClean.length < 2) errors.name = true;
    if (!phoneClean || phoneClean.length < 7) errors.phone = true;
    if (!formData.date) errors.date = true;
    if (!formData.time) errors.time = true;
    if (!targetPlace || targetPlace.length < 2) errors.place = true;

    setInvalidFields(errors);

    if (Object.keys(errors).length > 0) {
      setFormError(
        lang === 'GU'
          ? 'કૃપા કરીને લાલ રંગથી દર્શાવેલી બધી વિગતો સાચી રીતે ભરો.'
          : lang === 'HI'
          ? 'कृपया लाल रंग से चिह्नित सभी फ़ील्ड सही तरीके से भरें।'
          : 'Please correctly fill out all highlighted required fields.'
      );
      return;
    }

    let finalLat = formData.lat;
    let finalLng = formData.lng;
    let finalPlace = targetPlace;

    // Auto-pick from top suggestion if lat is still 0
    if (finalLat === 0 && placeSuggestions.length > 0) {
      const topItem = placeSuggestions[0];
      finalLat = topItem.lat;
      finalLng = topItem.lon;
      finalPlace = topItem.display_name || topItem.full_name || targetPlace;
    } else if (finalLat === 0) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(targetPlace)}&limit=1`
        );
        const geoData = await geoRes.json();
        if (Array.isArray(geoData) && geoData.length > 0) {
          finalLat = parseFloat(geoData[0].lat);
          finalLng = parseFloat(geoData[0].lon);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Default fallback coordinates if still 0 (Surat/India default)
    if (finalLat === 0) {
      finalLat = 21.1702;
      finalLng = 72.8311;
    }

    const srv = GURU_SERVICES.find((s) => s.id === formData.serviceId) || GURU_SERVICES[0];
    const combinedPhone = `${countryCode} ${phoneDigits.trim()}`;
    const tzRes = resolveHistoricalTimezone(formData.date, formData.time, finalLat, finalLng);
    const finalTzOffset = tzRes.tzOffset;

    const submissionPayload: any = {
      name: formData.name.trim(),
      phone: combinedPhone.trim(),
      serviceSelected: {
        id: srv.id,
        title: srv.titleEN,
        price: srv.price,
      },
      birthDetails: {
        date: formData.date,
        time: formData.time,
        place: finalPlace,
        lat: finalLat,
        lng: finalLng,
        tzOffset: finalTzOffset,
        timeZone: tzRes.timeZone,
        isDST: tzRes.isDST,
      },
      paymentStatus: formData.paymentStatus,
    };

    if (!editingId) {
      submissionPayload.createdAt = new Date().toISOString();
    }

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

        {/* PWA Mobile App Installation Prompt Banner on Login Screen */}
        <PWAInstallBanner lang={lang} />
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
        
        {/* Top Action & Stat Cards Row - Responsive flex for zero clashing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">{t.sectionTitle}</h2>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">{t.sectionSubtitle}</p>
          </div>

          {/* Add New Entry Button */}
          <Button
            onClick={handleOpenCreateModal}
            className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] hover:to-[#5E121C] text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-stone-200 text-left my-auto max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100/80 text-[#A14E15] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {editingId ? t.modalTitleEdit : t.modalTitleCreate}
                  </h3>
                  <p className="text-xs text-stone-500">{t.modalSubtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAttemptCloseModal}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              
              {/* Client Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                  <span>{t.clientNameLabel}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (invalidFields.name) setInvalidFields((prev) => ({ ...prev, name: false }));
                  }}
                  placeholder={t.clientNamePlaceholder}
                  className={`w-full rounded-2xl p-3.5 text-sm font-medium transition-all outline-none ${
                    invalidFields.name
                      ? 'border-2 border-red-500 bg-red-50/40 ring-2 ring-red-500/20'
                      : 'border-2 border-stone-300 focus:border-[#7A1C28] focus:ring-4 focus:ring-amber-500/20 bg-white text-stone-900'
                  }`}
                  required
                />
              </div>

              {/* Client Phone with Country Code Picker */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                  <span>{t.phoneLabel}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-white border-2 border-stone-300 focus:border-[#7A1C28] rounded-2xl p-3 text-xs sm:text-sm font-bold text-stone-900 outline-none shrink-0 max-w-[140px] cursor-pointer shadow-2xs"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.country} value={c.code}>
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                  <Input
                    type="tel"
                    value={phoneDigits}
                    onChange={(e) => {
                      setPhoneDigits(e.target.value);
                      if (invalidFields.phone) setInvalidFields((prev) => ({ ...prev, phone: false }));
                    }}
                    placeholder={t.phonePlaceholder}
                    className={`w-full rounded-2xl p-3.5 text-sm font-mono transition-all outline-none ${
                      invalidFields.phone
                        ? 'border-2 border-red-500 bg-red-50/40 ring-2 ring-red-500/20'
                        : 'border-2 border-stone-300 focus:border-[#7A1C28] focus:ring-4 focus:ring-amber-500/20 bg-white text-stone-900'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  {t.serviceLabel}
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full bg-white border-2 border-stone-300 focus:border-[#7A1C28] rounded-2xl p-3.5 text-sm font-medium text-stone-900 outline-none shadow-2xs cursor-pointer"
                >
                  {GURU_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === 'GU' ? s.titleGU : lang === 'HI' ? s.titleHI : s.titleEN} - ₹{s.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Intuitive Date & Time Selection Widgets */}
              <div className="space-y-3.5 pt-1">
                <CustomDatePicker
                  value={formData.date}
                  onChange={(newDate) => {
                    setFormData((prev) => ({ ...prev, date: newDate }));
                    if (invalidFields.date) setInvalidFields((prev) => ({ ...prev, date: false }));
                  }}
                  label={t.birthDateLabel}
                />

                <CustomTimePicker
                  value={formData.time}
                  onChange={(newTime) => {
                    setFormData((prev) => ({ ...prev, time: newTime }));
                    if (invalidFields.time) setInvalidFields((prev) => ({ ...prev, time: false }));
                  }}
                  label={t.birthTimeLabel}
                />
              </div>

              {/* Birth Place Search Input (Exhaustive Geocoding Engine) */}
              <div className="space-y-1 relative" ref={searchContainerRef}>
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>{t.birthPlaceLabel}</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
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
                    const val = e.target.value;
                    setPlaceSearch(val);
                    setFormData((prev) => ({ ...prev, place: val, lat: 0, lng: 0 }));
                    if (invalidFields.place) setInvalidFields((prev) => ({ ...prev, place: false }));
                  }}
                  placeholder={t.birthPlacePlaceholder}
                  className={`w-full rounded-2xl p-3.5 text-sm font-medium transition-all outline-none ${
                    invalidFields.place
                      ? 'border-2 border-red-500 bg-red-50/40 ring-2 ring-red-500/20'
                      : 'border-2 border-stone-300 focus:border-[#7A1C28] focus:ring-4 focus:ring-amber-500/20 bg-white text-stone-900'
                  }`}
                  required
                />

                {/* Option 2: Simple Multi-Language Guidance Tip */}
                <p className="text-[11px] text-amber-900 bg-amber-50/90 border border-amber-200 p-2.5 rounded-xl mt-1.5 flex items-start gap-1.5 font-medium leading-snug shadow-2xs">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{t.locationTip}</span>
                </p>

                {isPlaceSearching && (
                  <span className="absolute right-3.5 top-9 text-[11px] text-[#A14E15] font-bold animate-pulse">
                    Searching...
                  </span>
                )}

                {placeSuggestions.length > 0 && (
                  <ul className="absolute z-50 top-[68px] left-0 w-full bg-white border-2 border-amber-300 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-stone-100">
                    {placeSuggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSelectPlace(item)}
                        className="p-3 hover:bg-amber-50 cursor-pointer text-xs font-semibold text-stone-800 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#7A1C28] shrink-0" />
                          <span className="truncate">{item.display_name}</span>
                        </div>
                        {item.type && (
                          <span className="text-[9px] font-bold font-mono uppercase bg-amber-100 text-[#7A1C28] px-1.5 py-0.5 rounded-md shrink-0">
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
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  {t.paymentStatusLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentStatus: 'paid' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border-2 ${
                      formData.paymentStatus === 'paid'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t.paidOption}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentStatus: 'pending' }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border-2 ${
                      formData.paymentStatus === 'pending'
                        ? 'bg-[#7A1C28] text-white border-[#58131C] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t.pendingOption}
                  </button>
                </div>
              </div>

              {/* Live Filled Details Summary Card */}
              {formData.name.trim() && (formData.place || placeSearch).trim() && (
                <div className="p-3.5 bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl space-y-1.5 text-xs text-stone-900 animate-in fade-in shadow-2xs">
                  <div className="font-bold text-[#7A1C28] flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.summaryTitle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-medium pt-0.5">
                    <p><span className="text-stone-600 font-bold">{t.summaryName}</span> {formData.name}</p>
                    <p><span className="text-stone-600 font-bold">{t.summaryPhone}</span> {countryCode} {phoneDigits}</p>
                    <p><span className="text-stone-600 font-bold">{t.summaryDateTime}</span> {formData.date} | {formData.time}</p>
                    <p className="col-span-2"><span className="text-stone-600 font-bold">{t.summaryPlace}</span> {(formData.place || placeSearch)}</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAttemptCloseModal}
                  className="rounded-xl text-xs font-bold border-2 border-stone-300"
                >
                  {t.cancelBtn}
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#9E2A2B] to-[#7A1C28] hover:from-[#B2182B] text-white font-bold rounded-xl text-xs px-6 py-3 shadow-md"
                >
                  {editingId ? t.submitBtnEdit : t.submitBtnCreate}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Discard Unsaved Changes Warning Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 text-left space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">
                  {lang === 'GU' ? 'અનસેવ માહિતી કાઢી નાખવી છે?' : lang === 'HI' ? 'अनसेव जानकारी हटाना चाहते हैं?' : 'Discard Unsaved Changes?'}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {lang === 'GU' ? 'તમે લખેલી વિગતો સેવ થયા વગર બંધ થઈ જશે.' : lang === 'HI' ? 'दर्ज की गई जानकारी सेव किए बिना मिट जाएगी।' : 'Any details entered will be lost.'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDiscardModal(false)}
                className="rounded-xl text-xs font-bold py-2"
              >
                {lang === 'GU' ? 'પાછા જાઓ' : lang === 'HI' ? 'वापस जाएं' : 'Keep Editing'}
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDiscard}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold py-2"
              >
                {lang === 'GU' ? 'હા, કાઢી નાખો' : lang === 'HI' ? 'हां, हटाएं' : 'Discard'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Mobile App Installation Prompt Banner (24-Hour Persistence) */}
      <PWAInstallBanner lang={lang} />

    </div>
  );
}
