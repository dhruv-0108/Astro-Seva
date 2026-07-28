'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NorthIndianChart from '../../../components/NorthIndianChart';
import { Badge, Card, Button } from '../../../components/ui/DesignSystem';
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
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashas' | 'charts' | 'planets' | 'panchanga' | 'cusps' | 'transits' | 'remedies'>('dashas');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F5] text-[#B45309] gap-3 p-6">
        <Loader2 className="w-8 h-8 animate-spin" />
        <h2 className="text-base font-bold text-stone-900">Calculating Kundli Details...</h2>
        <p className="text-xs text-stone-500 font-medium">Please wait while planetary positions & dasha chains are computed.</p>
      </div>
    );
  }

  if (errorMsg || !kundliData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F5] text-red-600 gap-4 p-6 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold">{errorMsg || 'Could not load Kundli data.'}</h2>
        <Button onClick={() => window.location.reload()} variant="primary">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      </div>
    );
  }

  const { client, currentDashaChain, astro } = kundliData;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans flex flex-col">
      
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-stone-200/60 px-6 py-4 flex justify-between items-center shadow-xs print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.close()}
            className="p-2 rounded-2xl hover:bg-stone-100 transition-colors cursor-pointer text-stone-600"
            title="Close Tab"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">{client.name}'s Kundli Report</h1>
            <p className="text-xs text-stone-500 font-medium">Vedic Astrology Digital Analysis</p>
          </div>
        </div>
        
        <Button onClick={() => window.print()} variant="outline" size="sm">
          <Printer className="w-4 h-4 text-stone-600" />
          <span>Print Report</span>
        </Button>
      </header>

      {/* Hero Summary Card */}
      <div className="bg-white border-b border-stone-200/60 px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <Badge variant="amber">Vedic Kundli Report</Badge>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">{client.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 font-medium pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B45309]" />
                <span>{client.birthDetails.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B45309]" />
                <span>{client.birthDetails.time} (IST +{client.birthDetails.tzOffset})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B45309]" />
                <span className="truncate max-w-[220px]" title={client.birthDetails.place}>{client.birthDetails.place}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3 md:justify-end">
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 flex-1 min-w-[130px] max-w-[170px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Ascendant (Lagna)</span>
              <span className="text-base font-extrabold text-stone-900 mt-0.5 block">{RASHI_NAMES_EN[kundliData.lagnaSignIndex]}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 flex-1 min-w-[130px] max-w-[170px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Moon Sign (Rashi)</span>
              <span className="text-base font-extrabold text-stone-900 mt-0.5 block">{RASHI_NAMES_EN[astro.planets.Moon.sign]}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 flex-1 min-w-[130px] max-w-[170px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Birth Nakshatra</span>
              <span className="text-base font-extrabold text-[#B45309] mt-0.5 block truncate">
                {NAKSHATRA_NAMES[Math.floor((astro.planets.Moon.longitude % 360) / (360 / 27))]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Navigation Bar */}
      <nav className="bg-white border-b border-stone-200/60 sticky top-0 z-20 px-6 overflow-x-auto scrollbar-none shadow-xs print:hidden">
        <div className="flex gap-8 text-sm font-semibold max-w-6xl mx-auto">
          {[
            { id: 'dashas', label: 'Vimshottari Dasha' },
            { id: 'charts', label: 'Kundli Charts' },
            { id: 'planets', label: 'Planetary Positions' },
            { id: 'panchanga', label: 'Panchanga' },
            { id: 'cusps', label: 'House Cusps' },
            { id: 'transits', label: 'Saturn Transits' },
            { id: 'remedies', label: 'Auspicious Remedies' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 relative whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isActive ? 'text-[#B45309] font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B45309] rounded-full shadow-[0_0_8px_rgba(180,83,9,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-10">
        
        {/* TAB 1: CURRENT VIMSHOTTARI DASHA HIERARCHY */}
        {activeTab === 'dashas' && (
          <div className="space-y-8">
            
            {/* CURRENT DASHA HIERARCHY CARD */}
            <Card className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#B45309]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">Current Vimshottari Dasha</h2>
                  <p className="text-xs text-stone-500 font-medium">Active 5-Level Dasha Hierarchy</p>
                </div>
              </div>

              {currentDashaChain ? (
                <div className="overflow-x-auto border border-stone-200/60 rounded-2xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-[#B45309] font-bold border-b border-stone-200/80">
                      <tr>
                        <th className="p-4">Dasha Level</th>
                        <th className="p-4">Planet</th>
                        <th className="p-4">Duration (Start Date | End Date)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      
                      {/* MahaDasha */}
                      <tr className="bg-amber-50/40 hover:bg-amber-50/70">
                        <td className="p-4 font-bold text-stone-900">Vimshottari MahaDasha</td>
                        <td className="p-4 font-bold text-[#B45309] text-base">{currentDashaChain.mahadasha.lord}</td>
                        <td className="p-4 font-mono font-semibold text-stone-800">
                          {formatDashaDateTime(currentDashaChain.mahadasha.startDate)} | {formatDashaDateTime(currentDashaChain.mahadasha.endDate)}
                        </td>
                      </tr>

                      {/* Antra Dasha */}
                      <tr className="hover:bg-amber-50/20">
                        <td className="p-4 font-semibold text-stone-700 pl-8">Antra Dasha</td>
                        <td className="p-4 font-bold text-amber-900">{currentDashaChain.antardasha.lord}</td>
                        <td className="p-4 font-mono text-stone-700">
                          {formatDashaDateTime(currentDashaChain.antardasha.startDate)} | {formatDashaDateTime(currentDashaChain.antardasha.endDate)}
                        </td>
                      </tr>

                      {/* Pratyantar Dasha */}
                      <tr className="hover:bg-amber-50/20">
                        <td className="p-4 font-semibold text-stone-700 pl-12">Pratyantar Dasha</td>
                        <td className="p-4 font-bold text-orange-800">{currentDashaChain.pratyantardasha.lord}</td>
                        <td className="p-4 font-mono text-stone-700">
                          {formatDashaDateTime(currentDashaChain.pratyantardasha.startDate)} | {formatDashaDateTime(currentDashaChain.pratyantardasha.endDate)}
                        </td>
                      </tr>

                      {/* Sookshma Dasha */}
                      <tr className="hover:bg-amber-50/20">
                        <td className="p-4 font-semibold text-stone-700 pl-16">Sookshma Dasha</td>
                        <td className="p-4 font-bold text-yellow-800">{currentDashaChain.sookshmadasha.lord}</td>
                        <td className="p-4 font-mono text-stone-700">
                          {formatDashaDateTime(currentDashaChain.sookshmadasha.startDate)} | {formatDashaDateTime(currentDashaChain.sookshmadasha.endDate)}
                        </td>
                      </tr>

                      {/* Pran Dasha */}
                      <tr className="hover:bg-amber-50/20">
                        <td className="p-4 font-semibold text-stone-700 pl-20">Pran Dasha</td>
                        <td className="p-4 font-bold text-emerald-800">{currentDashaChain.prandasha.lord}</td>
                        <td className="p-4 font-mono text-stone-700">
                          {formatDashaDateTime(currentDashaChain.prandasha.startDate)} | {formatDashaDateTime(currentDashaChain.prandasha.endDate)}
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 text-stone-500 text-sm rounded-2xl">
                  Full 5-level current dasha chain calculation unavailable.
                </div>
              )}
            </Card>

            {/* FULL 120-YEAR VIMSHOTTARI MAHADASHA TIMELINE */}
            <Card className="p-0 overflow-hidden">
              <div className="p-5 bg-stone-50/60 border-b border-stone-200/60">
                <h3 className="font-bold text-base text-stone-900">
                  Vimshottari Dasha Timeline (120 Years)
                </h3>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                {kundliData.dasha.mahadashas.map((md: any, idx: number) => (
                  <div key={idx} className="p-5 hover:bg-amber-50/20 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-base text-stone-900">
                        {md.lord} Dasha ({PLANET_SPANS[md.lord]} Years)
                      </span>
                      <span className="text-stone-500 font-mono font-semibold text-xs">
                        {formatDateShort(md.startDate)} — {formatDateShort(md.endDate)}
                      </span>
                    </div>
                    {md.antardashas && (
                      <div className="mt-3 text-xs text-stone-600 flex flex-wrap gap-2">
                        <span className="font-semibold text-stone-800">Sub-Dashas:</span>
                        {md.antardashas.map((ad: any, adIdx: number) => (
                          <span key={adIdx} className="bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-md text-stone-800 font-mono">
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
        )}

        {/* TAB 2: SINGLE SCROLLABLE COLUMN KUNDLI CHARTS */}
        {activeTab === 'charts' && (
          <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto">
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
        )}

        {/* TAB 3: PLANETARY POSITIONS */}
        {activeTab === 'planets' && (
          <Card className="p-0 overflow-hidden">
            <div className="p-5 bg-stone-50/60 border-b border-stone-200/60">
              <h3 className="font-bold text-base text-stone-900">
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
                        <Badge variant={pObj.isRetrograde ? 'red' : 'green'}>
                          {pObj.isRetrograde ? 'Retrograde (R)' : 'Direct'}
                        </Badge>
                      </td>
                      <td className="p-4 font-semibold text-[#B45309] text-sm">{RASHI_NAMES_EN[pObj.sign]}</td>
                      <td className="p-4 font-mono text-stone-800 text-sm">{formatDegStr(pObj.longitude)}</td>
                      <td className="p-4 text-stone-700 text-sm">{getNakshatraInfo(pObj.longitude)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 4: PANCHANGA */}
        {activeTab === 'panchanga' && (
          <div className="space-y-8">
            <Card className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                Birth Panchanga Details
              </h3>
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

            {/* Transition Times Table */}
            <Card className="p-0 overflow-hidden">
              <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
                <h4 className="font-bold text-sm text-stone-900">
                  Panchanga Transition Times
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                    <tr>
                      <th className="p-4">Element</th>
                      <th className="p-4">At Birth</th>
                      <th className="p-4">Start Time</th>
                      <th className="p-4">End Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    <tr>
                      <td className="p-4 font-bold text-stone-900">Tithi</td>
                      <td className="p-4 text-[#B45309] font-semibold">{kundliData.panchanga.tithi.name} ({kundliData.panchanga.tithi.paksha})</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.tithi.startTime)}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.tithi.endTime)}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-900">Nakshatra</td>
                      <td className="p-4 text-[#B45309] font-semibold">{kundliData.panchanga.nakshatra.name}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.nakshatra.startTime)}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.nakshatra.endTime)}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-900">Yoga</td>
                      <td className="p-4 text-[#B45309] font-semibold">{kundliData.panchanga.yoga.name}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.yoga.startTime)}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.yoga.endTime)}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-900">Karana</td>
                      <td className="p-4 text-[#B45309] font-semibold">{kundliData.panchanga.karana.name}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.karana.startTime)}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatShortTime(kundliData.panchanga.karana.endTime)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: HOUSE CUSPS */}
        {activeTab === 'cusps' && (
          <Card className="p-0 overflow-hidden">
            <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
              <h3 className="font-bold text-sm text-stone-900">
                House Cusps & Exact Degrees Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                  <tr>
                    <th className="p-4">House</th>
                    <th className="p-4">Exact Degrees</th>
                    <th className="p-4">Zodiac Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {astro.houses.map((houseDeg: number, idx: number) => {
                    const houseNum = idx + 1;
                    const signIndex = Math.floor(houseDeg / 30);
                    const localDeg = houseDeg % 30;
                    const degStr = `${Math.floor(localDeg)}° ${Math.floor((localDeg % 1) * 60)}' ${Math.floor((((localDeg % 1) * 60) % 1) * 60)}"`;

                    return (
                      <tr key={houseNum} className="hover:bg-amber-50/20">
                        <td className="p-4 font-bold text-stone-900">House {houseNum}</td>
                        <td className="p-4 font-mono text-stone-700">{degStr}</td>
                        <td className="p-4 font-semibold text-[#B45309]">{RASHI_NAMES_EN[signIndex]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 6: SATURN TRANSITS */}
        {activeTab === 'transits' && (
          <Card className="p-0 overflow-hidden">
            <div className="p-4 bg-stone-50/60 border-b border-stone-200/60">
              <h3 className="font-bold text-sm text-stone-900">
                Lifetime Saturn Transits & Sade Sati Phases Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200/80">
                  <tr>
                    <th className="p-4">Transit Type</th>
                    <th className="p-4">Saturn Sign</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">End Date</th>
                    <th className="p-4">Paya (Metal)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {kundliData.transits.map((tRow: any, idx: number) => (
                    <tr key={idx} className="hover:bg-amber-50/20">
                      <td className="p-4 font-bold text-stone-900">{tRow.type}</td>
                      <td className="p-4 text-stone-700">{tRow.saturnSignFormatted}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatDateShort(tRow.startDate)}</td>
                      <td className="p-4 text-stone-600 font-mono">{formatDateShort(tRow.endDate)}</td>
                      <td className="p-4 font-semibold text-emerald-800">{tRow.paya}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 7: REMEDIES */}
        {activeTab === 'remedies' && (
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
                    { k: 'Auspicious Planets', v: kundliData.shubha.auspiciousPlanets },
                    { k: 'Inauspicious Planets', v: kundliData.shubha.inauspiciousPlanets },
                    { k: 'Friendly Signs', v: kundliData.shubha.friendlySigns },
                    { k: 'Friendly Ascendants', v: kundliData.shubha.friendlyLagnas },
                    { k: 'Auspicious Gemstone', v: kundliData.shubha.gemstone },
                    { k: 'Sub-gemstone', v: kundliData.shubha.subGemstone },
                    { k: 'Fortune Gemstone', v: kundliData.shubha.fortuneGemstone },
                    { k: 'Auspicious Deity', v: kundliData.shubha.deity },
                    { k: 'Auspicious Metal', v: kundliData.shubha.metal },
                    { k: 'Auspicious Color', v: kundliData.shubha.color },
                    { k: 'Auspicious Direction', v: kundliData.shubha.direction },
                    { k: 'Auspicious Time of Day', v: kundliData.shubha.timeOfDay },
                    { k: 'Offering Substances', v: kundliData.shubha.offerings },
                    { k: 'Auspicious Food', v: kundliData.shubha.food },
                    { k: 'Auspicious Liquid', v: kundliData.shubha.liquid },
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
        )}

      </main>
    </div>
  );
}
