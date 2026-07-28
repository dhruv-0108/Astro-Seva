'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NorthIndianChart from '../../../components/NorthIndianChart';
import { Calendar, Clock, MapPin, Sparkles, Printer, ArrowLeft, RefreshCw } from 'lucide-react';

const RASHI_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
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
  const [activeTab, setActiveTab] = useState<'dashas' | 'charts' | 'panchanga' | 'cusps' | 'transits' | 'remedies'>('dashas');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] text-[#cc6600] gap-4 p-4">
        <Sparkles className="w-10 h-10 animate-spin" />
        <h2 className="text-xl font-bold">Calculating Kundli Details...</h2>
        <p className="text-sm text-gray-500">Please wait while planetary positions & dasha chains are computed.</p>
      </div>
    );
  }

  if (errorMsg || !kundliData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] text-red-600 gap-4 p-4 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold">{errorMsg || 'Could not load Kundli data.'}</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-[#cc6600] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const { client, currentDashaChain } = kundliData;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-[#cc6600] text-white px-6 py-4 flex justify-between items-center shadow-md print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.close()}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close Tab"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">{client.name}'s Kundli Report</h1>
            <p className="text-xs text-amber-100 font-medium">Vedic Astrology & Vimshottari Dasha Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="bg-white/15 hover:bg-white/25 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </header>

      {/* Summary Banner */}
      <div className="bg-amber-50/80 border-b border-[#e8e2d5] px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-[#cc6600]" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Date of Birth</span>
            <span className="font-bold text-sm text-gray-900">{client.birthDetails.date}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-[#cc6600]" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Time of Birth</span>
            <span className="font-bold text-sm text-gray-900">{client.birthDetails.time} (IST +{client.birthDetails.tzOffset})</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-[#cc6600]" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Place of Birth</span>
            <span className="font-bold text-sm text-gray-900 truncate max-w-[180px]" title={client.birthDetails.place}>
              {client.birthDetails.place}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#cc6600]" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Ascendant / Moon</span>
            <span className="font-bold text-sm text-[#cc6600]">
              {RASHI_NAMES_EN[kundliData.lagnaSignIndex]} / {RASHI_NAMES_EN[kundliData.astro.planets.Moon.sign]}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Sleek Navigation Bar (No Old Cards) */}
      <nav className="bg-white border-b border-[#e8e2d5] sticky top-0 z-20 px-6 overflow-x-auto scrollbar-none shadow-sm print:hidden">
        <div className="flex gap-8 text-sm font-semibold">
          {[
            { id: 'dashas', label: '🔮 Current Vimshottari Dasha' },
            { id: 'charts', label: '🗺️ Kundli Charts' },
            { id: 'panchanga', label: '🗓️ Panchanga' },
            { id: 'cusps', label: '📐 House Cusps' },
            { id: 'transits', label: '🪐 Saturn Transits' },
            { id: 'remedies', label: '🌺 Auspicious Remedies' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 relative whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isActive ? 'text-[#cc6600] font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#cc6600] rounded-full shadow-[0_0_8px_rgba(204,102,0,0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* TAB 1: CURRENT VIMSHOTTARI DASHA HIERARCHY */}
        {activeTab === 'dashas' && (
          <div className="space-y-8">
            
            {/* CURRENT DASHA HIERARCHY BOX */}
            <div className="bg-white border border-[#e8e2d5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <span className="text-2xl">🔮</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Current Vimshottari Dasha</h2>
                  <p className="text-xs text-gray-500">Live 5-Level Dasha Hierarchy (Active Right Now)</p>
                </div>
              </div>

              {currentDashaChain ? (
                <div className="space-y-6 font-mono text-sm">
                  
                  {/* MahaDasha */}
                  <div className="border-l-4 border-[#cc6600] pl-4 py-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans mb-1">
                      Vimshottari MahaDasha
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base font-bold text-gray-900 gap-1">
                      <span className="text-[#cc6600]">{currentDashaChain.mahadasha.lord}</span>
                      <span className="text-gray-700 text-sm font-semibold">
                        {formatDashaDateTime(currentDashaChain.mahadasha.startDate)} | {formatDashaDateTime(currentDashaChain.mahadasha.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Antra Dasha */}
                  <div className="border-l-4 border-amber-500 pl-4 py-1 ml-3 sm:ml-6">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans mb-1">
                      Antra Dasha
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base font-bold text-gray-900 gap-1">
                      <span className="text-amber-800">{currentDashaChain.antardasha.lord}</span>
                      <span className="text-gray-700 text-sm font-semibold">
                        {formatDashaDateTime(currentDashaChain.antardasha.startDate)} | {formatDashaDateTime(currentDashaChain.antardasha.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Pratyantar Dasha */}
                  <div className="border-l-4 border-orange-400 pl-4 py-1 ml-6 sm:ml-12">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans mb-1">
                      Pratyantar Dasha
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base font-bold text-gray-900 gap-1">
                      <span className="text-orange-700">{currentDashaChain.pratyantardasha.lord}</span>
                      <span className="text-gray-700 text-sm font-semibold">
                        {formatDashaDateTime(currentDashaChain.pratyantardasha.startDate)} | {formatDashaDateTime(currentDashaChain.pratyantardasha.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Sookshma Dasha */}
                  <div className="border-l-4 border-yellow-500 pl-4 py-1 ml-9 sm:ml-18">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans mb-1">
                      Sookshma Dasha
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base font-bold text-gray-900 gap-1">
                      <span className="text-yellow-800">{currentDashaChain.sookshmadasha.lord}</span>
                      <span className="text-gray-700 text-sm font-semibold">
                        {formatDashaDateTime(currentDashaChain.sookshmadasha.startDate)} | {formatDashaDateTime(currentDashaChain.sookshmadasha.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Pran Dasha */}
                  <div className="border-l-4 border-emerald-500 pl-4 py-1 ml-12 sm:ml-24">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans mb-1">
                      Pran Dasha
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-base font-bold text-gray-900 gap-1">
                      <span className="text-emerald-700">{currentDashaChain.prandasha.lord}</span>
                      <span className="text-gray-700 text-sm font-semibold">
                        {formatDashaDateTime(currentDashaChain.prandasha.startDate)} | {formatDashaDateTime(currentDashaChain.prandasha.endDate)}
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-4 bg-gray-50 text-gray-500 text-sm rounded-xl">
                  Full 5-level current dasha chain calculation unavailable.
                </div>
              )}
            </div>

            {/* FULL 120-YEAR VIMSHOTTARI MAHADASHA TIMELINE */}
            <div className="bg-white border border-[#e8e2d5] rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 bg-amber-50/50 border-b border-[#e8e2d5]">
                <h3 className="font-bold text-base text-[#cc6600]">
                  Vimshottari Dasha Timeline (120 Years)
                </h3>
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {kundliData.dasha.mahadashas.map((md: any, idx: number) => (
                  <div key={idx} className="p-4 hover:bg-amber-50/30 transition-colors">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-sm text-gray-900">
                        {md.lord} Dasha ({PLANET_SPANS[md.lord]} Years)
                      </span>
                      <span className="text-gray-500 font-semibold text-xs">
                        {formatDateShort(md.startDate)} — {formatDateShort(md.endDate)}
                      </span>
                    </div>
                    {md.antardashas && (
                      <div className="mt-2 text-[11px] text-gray-500 flex flex-wrap gap-2">
                        <span className="font-semibold text-gray-700">Sub-Dashas:</span>
                        {md.antardashas.map((ad: any, adIdx: number) => (
                          <span key={adIdx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono">
                            {ad.lord} ({formatDateShort(ad.startDate)})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: STACKED LARGE KUNDLI CHARTS */}
        {activeTab === 'charts' && (
          <div className="flex flex-col items-center gap-10 max-w-2xl mx-auto w-full">
            {/* Lagna Chart */}
            <NorthIndianChart
              title="Lagna Chart (Birth Kundli)"
              lagnaSign={kundliData.lagnaSignIndex}
              planetsMap={kundliData.astro.planets}
            />

            {/* Moon Chart */}
            <NorthIndianChart
              title="Chandra Kundli (Moon Chart)"
              lagnaSign={kundliData.astro.planets.Moon.sign}
              planetsMap={kundliData.astro.planets}
            />

            {/* Navamsha Chart (D9) */}
            <NorthIndianChart
              title="Navamsha Chart (D9)"
              lagnaSign={kundliData.d9Lagna}
              planetsMap={kundliData.d9Placements}
            />

            {/* Chalit / Cusp Chart */}
            <NorthIndianChart
              title="KP House Cusp Chart (Chalit)"
              lagnaSign={kundliData.lagnaSignIndex}
              planetsMap={kundliData.cuspPlacements}
            />
          </div>
        )}

        {/* TAB 3: PANCHANGA */}
        {activeTab === 'panchanga' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e2d5] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#cc6600]">
                Birth Panchanga Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="text-xs text-gray-500 font-semibold block">Tithi</span>
                  <span className="font-bold text-gray-900 text-base">{kundliData.panchanga.tithi.name} ({kundliData.panchanga.tithi.paksha})</span>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="text-xs text-gray-500 font-semibold block">Nakshatra</span>
                  <span className="font-bold text-gray-900 text-base">
                    {kundliData.panchanga.nakshatra.name} (Pada {Math.floor((kundliData.astro.planets.Moon.longitude % 13.333) / 3.333) + 1})
                  </span>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="text-xs text-gray-500 font-semibold block">Yoga</span>
                  <span className="font-bold text-gray-900 text-base">{kundliData.panchanga.yoga.name}</span>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="text-xs text-gray-500 font-semibold block">Karana</span>
                  <span className="font-bold text-gray-900 text-base">{kundliData.panchanga.karana.name}</span>
                </div>
              </div>
            </div>

            {/* Transition Times Table */}
            <div className="bg-white border border-[#e8e2d5] rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-amber-50/60 border-b border-[#e8e2d5]">
                <h4 className="font-bold text-sm text-[#cc6600]">
                  Panchanga Transition Times
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Element</th>
                      <th className="p-3.5">At Birth</th>
                      <th className="p-3.5">Start Time</th>
                      <th className="p-3.5">End Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="p-3.5 font-bold text-gray-900">Tithi</td>
                      <td className="p-3.5 text-amber-800 font-semibold">{kundliData.panchanga.tithi.name} ({kundliData.panchanga.tithi.paksha})</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.tithi.startTime)}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.tithi.endTime)}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-gray-900">Nakshatra</td>
                      <td className="p-3.5 text-amber-800 font-semibold">{kundliData.panchanga.nakshatra.name}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.nakshatra.startTime)}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.nakshatra.endTime)}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-gray-900">Yoga</td>
                      <td className="p-3.5 text-amber-800 font-semibold">{kundliData.panchanga.yoga.name}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.yoga.startTime)}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.yoga.endTime)}</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-gray-900">Karana</td>
                      <td className="p-3.5 text-amber-800 font-semibold">{kundliData.panchanga.karana.name}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.karana.startTime)}</td>
                      <td className="p-3.5 text-gray-600">{formatShortTime(kundliData.panchanga.karana.endTime)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HOUSE CUSPS */}
        {activeTab === 'cusps' && (
          <div className="bg-white border border-[#e8e2d5] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-amber-50/60 border-b border-[#e8e2d5]">
              <h3 className="font-bold text-sm text-[#cc6600]">
                House Cusps & Exact Degrees
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">House</th>
                    <th className="p-3.5">Exact Degrees</th>
                    <th className="p-3.5">Zodiac Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {kundliData.astro.houses.map((houseDeg: number, idx: number) => {
                    const houseNum = idx + 1;
                    const signIndex = Math.floor(houseDeg / 30);
                    const localDeg = houseDeg % 30;
                    const degStr = `${Math.floor(localDeg)}° ${Math.floor((localDeg % 1) * 60)}' ${Math.floor((((localDeg % 1) * 60) % 1) * 60)}"`;

                    return (
                      <tr key={houseNum} className="hover:bg-amber-50/40">
                        <td className="p-3.5 font-bold text-gray-900">House {houseNum}</td>
                        <td className="p-3.5 text-gray-700">{degStr}</td>
                        <td className="p-3.5 font-semibold text-[#cc6600]">{RASHI_NAMES_EN[signIndex]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SATURN TRANSITS */}
        {activeTab === 'transits' && (
          <div className="bg-white border border-[#e8e2d5] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-amber-50/60 border-b border-[#e8e2d5]">
              <h3 className="font-bold text-sm text-[#cc6600]">
                Lifetime Saturn Transits & Sade Sati Phases
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Transit Type</th>
                    <th className="p-3.5">Saturn Sign</th>
                    <th className="p-3.5">Start Date</th>
                    <th className="p-3.5">End Date</th>
                    <th className="p-3.5">Paya (Metal)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {kundliData.transits.map((tRow: any, idx: number) => (
                    <tr key={idx} className="hover:bg-amber-50/40">
                      <td className="p-3.5 font-bold text-gray-900">{tRow.type}</td>
                      <td className="p-3.5 text-gray-700">{tRow.saturnSignFormatted}</td>
                      <td className="p-3.5 text-gray-600">{formatDateShort(tRow.startDate)}</td>
                      <td className="p-3.5 text-gray-600">{formatDateShort(tRow.endDate)}</td>
                      <td className="p-3.5 font-semibold text-green-700">{tRow.paya}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REMEDIES */}
        {activeTab === 'remedies' && (
          <div className="bg-white border border-[#e8e2d5] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-amber-50/60 border-b border-[#e8e2d5]">
              <h3 className="font-bold text-sm text-[#cc6600]">
                Auspicious Guide & Astrological Remedies
              </h3>
            </div>
            <div className="divide-y divide-gray-100 text-xs">
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
                <div key={idx} className="p-4 flex justify-between items-center hover:bg-amber-50/40">
                  <span className="font-semibold text-gray-500">{item.k}</span>
                  <span className="font-bold text-gray-900 text-sm text-right">{item.v || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
