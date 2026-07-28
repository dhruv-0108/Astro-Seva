'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NorthIndianChart from '../../../components/NorthIndianChart';
import { Button } from '../../../components/ui/shadcn/button';
import { Card } from '../../../components/ui/shadcn/card';
import { Badge } from '../../../components/ui/shadcn/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  ArrowLeft,
  RefreshCw,
  Award,
  BookOpen,
  Compass,
  FileText,
  Loader2,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Home,
} from 'lucide-react';

const RASHI_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const PLANET_SPANS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export default function KundliPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'charts' | 'dashas' | 'planets' | 'dosha' | 'panchanga' | 'remedies'>('charts');
  const [kundliData, setKundliData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchKundli() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/kundli?id=${id}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to calculate Kundli data');
        }

        setKundliData(json);
      } catch (err: any) {
        console.error('Error fetching Kundli data:', err);
        setErrorMsg(err.message || 'Error calculating Kundli data.');
      } finally {
        setLoading(false);
      }
    }

    fetchKundli();
  }, [id]);

  const formatDateShort = (d: any) => {
    if (!d) return '-';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '-';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatDashaDateTime = (d: any) => {
    if (!d) return '-';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '-';
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const formatShortTime = (d: any) => {
    if (!d) return '-';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '-';
    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDegStr = (long: number) => {
    const localDeg = long % 30;
    return `${Math.floor(localDeg)}° ${Math.floor((localDeg % 1) * 60)}' ${Math.floor((((localDeg % 1) * 60) % 1) * 60)}"`;
  };

  const getNakshatraInfo = (long: number) => {
    const nakLen = 360 / 27;
    const nakIdx = Math.floor(long / nakLen);
    const pada = Math.floor((long % nakLen) / (nakLen / 4)) + 1;
    return `${NAKSHATRA_NAMES[nakIdx] || 'Nakshatra'} (Pada ${pada})`;
  };

  // Safe navigation back to public home page (never to admin)
  const handleHomeClick = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6] text-[#A14E15] gap-3 p-6">
        <Loader2 className="w-8 h-8 animate-spin" />
        <h2 className="text-base font-bold text-stone-900">Calculating Kundli Details...</h2>
        <p className="text-xs text-stone-500 font-medium">Please wait while planetary positions & dasha chains are computed.</p>
      </div>
    );
  }

  if (errorMsg || !kundliData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F6] text-red-600 gap-4 p-6 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold">{errorMsg || 'Could not load Kundli data.'}</h2>
        <Button onClick={() => window.location.reload()} variant="default">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      </div>
    );
  }

  const { client, currentDashaChain, astro } = kundliData;

  // Compute Manglik Dosha status
  const marsHouse = ((astro.planets.Mars.sign - kundliData.lagnaSignIndex + 12) % 12) + 1;
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans flex flex-col">
      
      {/* Navigation Header - Secured so Back button goes to Public Home Page */}
      <header className="bg-white border-b border-stone-200/60 px-6 py-3.5 flex justify-between items-center shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-2xl hover:bg-stone-100 transition-colors cursor-pointer text-stone-600 flex items-center gap-1.5 text-xs font-bold"
            title="Go to Home Page"
          >
            <Home className="w-4 h-4 text-[#A14E15]" />
            <span>Home</span>
          </button>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">{client.name}'s Kundli Report</h1>
            <p className="text-xs text-stone-500 font-medium">Vedic Astrology Digital Analysis</p>
          </div>
        </div>
        
        <Button onClick={() => window.print()} variant="outline" size="sm">
          <Printer className="w-4 h-4 text-stone-600" />
          <span>Print Complete Report</span>
        </Button>
      </header>

      {/* 1. COMPACT "FIRST EYE" EXECUTIVE SUMMARY BANNER */}
      <div className="bg-white border-b border-stone-200/60 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">{client.name}</h2>
              <Badge variant="default" className="text-[10px] py-0.5">Vedic Kundli</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#A14E15]" />
                {client.birthDetails.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A14E15]" />
                {client.birthDetails.time} (IST +{client.birthDetails.tzOffset})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate max-w-[200px]" title={client.birthDetails.place}>
                <MapPin className="w-3.5 h-3.5 text-[#A14E15]" />
                {client.birthDetails.place}
              </span>
            </div>
          </div>

          {/* Quick First-Eye Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">Lagna</span>
              <span className="text-sm font-extrabold text-stone-900">{RASHI_NAMES_EN[kundliData.lagnaSignIndex]}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">Moon Sign</span>
              <span className="text-sm font-extrabold text-stone-900">{RASHI_NAMES_EN[astro.planets.Moon.sign]}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-xl px-3.5 py-2 text-center">
              <span className="text-[9px] uppercase font-bold text-stone-400 block">Nakshatra</span>
              <span className="text-sm font-extrabold text-[#A14E15] truncate max-w-[100px] block">
                {NAKSHATRA_NAMES[Math.floor((astro.planets.Moon.longitude % 360) / (360 / 27))]}
              </span>
            </div>

            {currentDashaChain && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2 text-center">
                <span className="text-[9px] uppercase font-bold text-amber-800/70 block">MahaDasha</span>
                <span className="text-sm font-extrabold text-[#A14E15]">{currentDashaChain.mahadasha.lord}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Navigation Bar (Tabs) */}
      <nav className="bg-white border-b border-stone-200/60 sticky top-0 z-20 px-6 overflow-x-auto scrollbar-none shadow-xs print:hidden">
        <div className="flex gap-8 text-sm font-semibold max-w-6xl mx-auto">
          {[
            { id: 'charts', label: '1. Kundli Charts' },
            { id: 'dashas', label: '2. Vimshottari Dasha' },
            { id: 'planets', label: '3. Planetary Positions' },
            { id: 'dosha', label: '4. Dosha Analysis' },
            { id: 'panchanga', label: '5. Panchanga & Cusps' },
            { id: 'remedies', label: '6. Remedies & Strengths' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 relative whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isActive ? 'text-[#A14E15] font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A14E15] rounded-full shadow-[0_0_8px_rgba(161,78,21,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Narrative Report Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-10">
        
        {/* TAB 1: KUNDLI CHARTS (FIRST EYE!) */}
        <div className={activeTab === 'charts' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">1. Kundli Charts</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <NorthIndianChart
                title="Lagna Chart (Birth Kundli)"
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={astro.planets}
              />

              <NorthIndianChart
                title="Chandra Kundli (Moon Chart)"
                lagnaSign={astro.planets.Moon.sign}
                planetsMap={astro.planets}
              />

              <NorthIndianChart
                title="Navamsha Chart (D9)"
                lagnaSign={kundliData.d9Lagna}
                planetsMap={kundliData.d9Placements}
              />

              <NorthIndianChart
                title="KP House Cusp Chart (Chalit)"
                lagnaSign={kundliData.lagnaSignIndex}
                planetsMap={kundliData.cuspPlacements}
              />
            </div>
          </div>
        </div>

        {/* TAB 2: VIMSHOTTARI DASHA */}
        <div className={activeTab === 'dashas' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">2. Vimshottari Dasha Hierarchy</h2>
            </div>

            {/* Current Active Dasha Hierarchy */}
            {currentDashaChain && (
              <Card className="space-y-4">
                <h3 className="text-base font-bold text-stone-900">Current 5-Level Dasha Hierarchy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">MahaDasha</span>
                    <span className="text-base font-bold text-[#A14E15] block mt-0.5">{currentDashaChain.mahadasha.lord}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.mahadasha.startDate)} — {formatDateShort(currentDashaChain.mahadasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Antra Dasha</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{currentDashaChain.antardasha.lord}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.antardasha.startDate)} — {formatDateShort(currentDashaChain.antardasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pratyantar</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{currentDashaChain.pratyantardasha.lord}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.pratyantardasha.startDate)} — {formatDateShort(currentDashaChain.pratyantardasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Sookshma</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{currentDashaChain.sookshmadasha.lord}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.sookshmadasha.startDate)} — {formatDateShort(currentDashaChain.sookshmadasha.endDate)}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Pran Dasha</span>
                    <span className="text-sm font-bold text-stone-900 block mt-0.5">{currentDashaChain.prandasha.lord}</span>
                    <span className="text-[10px] text-stone-600 font-mono block mt-1">
                      {formatDateShort(currentDashaChain.prandasha.startDate)} — {formatDateShort(currentDashaChain.prandasha.endDate)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* 120-Year Vimshottari Timeline */}
            <Card className="p-0 overflow-hidden">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-sm text-stone-900">
                  120-Year Vimshottari Dasha Timeline
                </h3>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                {kundliData.dasha.mahadashas.map((md: any, idx: number) => (
                  <div key={idx} className="p-4 hover:bg-amber-50/20 transition-colors">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-stone-900">
                        {md.lord} Dasha ({PLANET_SPANS[md.lord]} Years)
                      </span>
                      <span className="text-stone-500 font-mono font-semibold text-xs">
                        {formatDateShort(md.startDate)} — {formatDateShort(md.endDate)}
                      </span>
                    </div>
                    {md.antardashas && (
                      <div className="mt-2 text-xs text-stone-600 flex flex-wrap gap-1.5">
                        <span className="font-semibold text-stone-800">Sub-Dashas:</span>
                        {md.antardashas.map((ad: any, adIdx: number) => (
                          <span key={adIdx} className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded text-stone-800 font-mono text-[11px]">
                            {ad.lord} ({formatDateShort(ad.startDate)})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 3: PLANETARY POSITIONS */}
        <div className={activeTab === 'planets' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">3. Planetary Positions</h2>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-sm text-stone-900">
                  Planetary Positions & Degrees Table
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                    <tr>
                      <th className="p-4">Planet</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Zodiac Sign</th>
                      <th className="p-4">Degrees</th>
                      <th className="p-4">Nakshatra & Pada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {Object.entries(astro.planets).map(([pName, pObj]: [string, any]) => (
                      <tr key={pName} className="hover:bg-amber-50/20">
                        <td className="p-4 font-bold text-stone-900 text-sm">{pName}</td>
                        <td className="p-4">
                          <Badge variant={pObj.isRetrograde ? 'destructive' : 'emerald'}>
                            {pObj.isRetrograde ? 'Retrograde (R)' : 'Direct'}
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold text-[#A14E15] text-sm">{RASHI_NAMES_EN[pObj.sign]}</td>
                        <td className="p-4 font-mono text-stone-800 text-sm">{formatDegStr(pObj.longitude)}</td>
                        <td className="p-4 text-stone-700 text-sm">{getNakshatraInfo(pObj.longitude)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 4: DOSHA ANALYSIS */}
        <div className={activeTab === 'dosha' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">4. Dosha & Astrological Check</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Manglik Dosha Check */}
              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${isManglik ? 'text-amber-600' : 'text-emerald-600'}`} />
                    <h3 className="font-bold text-stone-900 text-base">Manglik Dosha Status</h3>
                  </div>
                  <Badge variant={isManglik ? 'default' : 'emerald'}>
                    {isManglik ? 'Present' : 'Not Present'}
                  </Badge>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {isManglik
                    ? `Mars is placed in House ${marsHouse}. Specific Vedic shanti remedies and gemstone alignment are recommended.`
                    : 'Mars is safely placed. No primary Manglik affliction detected in Lagna chart.'}
                </p>
              </Card>

              {/* Sade Sati Status */}
              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#A14E15]" />
                    <h3 className="font-bold text-stone-900 text-base">Saturn Sade Sati Analysis</h3>
                  </div>
                  <Badge variant="secondary">Saturn Transit</Badge>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  Lifetime Saturn transit timeline computed for Moon Sign ({RASHI_NAMES_EN[astro.planets.Moon.sign]}). Refer to remedies tab for Saturn peace mantras.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* TAB 5: PANCHANGA & HOUSE CUSPS */}
        <div className={activeTab === 'panchanga' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">5. Panchanga & House Cusps</h2>
            </div>

            <Card className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Birth Panchanga Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-xs text-stone-500 font-semibold block">Tithi</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.tithi.name} ({kundliData.panchanga.tithi.paksha})</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-xs text-stone-500 font-semibold block">Nakshatra</span>
                  <span className="font-bold text-stone-900 text-base">
                    {kundliData.panchanga.nakshatra.name} (Pada {Math.floor((astro.planets.Moon.longitude % 13.333) / 3.333) + 1})
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-xs text-stone-500 font-semibold block">Yoga</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.yoga.name}</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="text-xs text-stone-500 font-semibold block">Karana</span>
                  <span className="font-bold text-stone-900 text-base">{kundliData.panchanga.karana.name}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* TAB 6: REMEDIES & STRENGTHS */}
        <div className={activeTab === 'remedies' ? 'block' : 'hidden print:block'}>
          <div className="space-y-6 print:break-before-page">
            <div className="hidden print:block">
              <h2 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-200">6. Auspicious Remedies & Guidance</h2>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-sm text-stone-900">
                  Auspicious Guide & Astrological Remedies Table
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                    <tr>
                      <th className="p-4">Astrological Parameter</th>
                      <th className="p-4 text-right">Auspicious Value / Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {[
                      { k: 'Radical Number (Mulank)', v: kundliData.shubha.mulank },
                      { k: 'Destiny Number (Bhagyank)', v: kundliData.shubha.bhagyank },
                      { k: 'Friendly Numbers', v: kundliData.shubha.friendlyNumbers },
                      { k: 'Enemy Numbers', v: kundliData.shubha.enemyNumbers },
                      { k: 'Auspicious Years', v: kundliData.shubha.auspiciousYears },
                      { k: 'Auspicious Days', v: kundliData.shubha.auspiciousDays },
                      { k: 'Auspicious Gemstone', v: kundliData.shubha.gemstone },
                      { k: 'Sub-gemstone', v: kundliData.shubha.subGemstone },
                      { k: 'Fortune Gemstone', v: kundliData.shubha.fortuneGemstone },
                      { k: 'Auspicious Deity', v: kundliData.shubha.deity },
                      { k: 'Auspicious Metal', v: kundliData.shubha.metal },
                      { k: 'Auspicious Color', v: kundliData.shubha.color },
                      { k: 'Auspicious Direction', v: kundliData.shubha.direction },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/20">
                        <td className="p-4 font-semibold text-stone-600">{item.k}</td>
                        <td className="p-4 font-bold text-stone-900 text-sm text-right">{item.v || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
}
