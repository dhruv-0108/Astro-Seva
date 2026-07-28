'use client';

import React, { useState, useEffect } from 'react';
import NorthIndianChart from './NorthIndianChart';
import { X, Calendar, Clock, MapPin, Sparkles, Share2 } from 'lucide-react';

interface ClientSubmission {
  id: string;
  name: string;
  phone: string;
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

interface KundliViewModalProps {
  client: ClientSubmission;
  onClose: () => void;
}

const RASHI_NAMES_GU = [
  'મેષ', 'વૃષભ', 'મિથુન', 'કર્ક', 'સિંહ', 'કન્યા', 'તુલા', 'વૃશ્ચિક', 'ધન', 'મકર', 'કુંભ', 'મીન'
];

const PLANET_NAMES_GU: Record<string, string> = {
  Sun: 'સૂર્ય',
  Moon: 'ચંદ્ર',
  Mars: 'મંગળ',
  Mercury: 'બુધ',
  Jupiter: 'ગુરુ',
  Venus: 'શુક્ર',
  Saturn: 'શનિ',
  Rahu: 'રાહુ',
  Ketu: 'કેતુ',
};

const NAKSHATRA_NAMES = [
  'અશ્વિની', 'ભરણી', 'કૃતિકા', 'રોહિણી', 'મૃગશીર્ષ', 'આર્દ્રા',
  'પુનર્વસુ', 'પુષ્ય', 'આશ્લેષા', 'મઘા', 'પૂર્વા ફાલ્ગુની', 'ઉત્તરા ફાલ્ગુની',
  'હસ્ત', 'ચિત્રા', 'સ્વાતિ', 'વિશાખા', 'અનુરાધા', 'જ્યેષ્ઠા',
  'મૂળ', 'પૂર્વાષાઢા', 'ઉત્તરાષાઢા', 'શ્રવણ', 'ધનિષ્ઠા', 'શતભિષા',
  'પૂર્વ ભાદ્રપદ', 'ઉત્તર ભાદ્રપદ', 'રેવતી'
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

export const KundliViewModal: React.FC<KundliViewModalProps> = ({ client, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'charts' | 'panchanga' | 'cusps' | 'dashas' | 'transits' | 'remedies'>('charts');
  const [kundliData, setKundliData] = useState<any>(null);

  useEffect(() => {
    async function fetchKundli() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetch(`/api/kundli?id=${client.id}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to calculate Kundli data');
        }

        setKundliData(json);
      } catch (err: any) {
        console.error('Error fetching Kundli data:', err);
        setErrorMsg(err.message || 'કુંડળી ગણતરી માં ભૂલ આવી છે.');
      } finally {
        setLoading(false);
      }
    }

    fetchKundli();
  }, [client]);

  const handleWhatsAppShare = () => {
    const message = `હરિ ઓમ, ${client.name}.\nગુરુજી દ્વારા તમારી કુંડળી વિગતો તૈયાર છે.\nજન્મ તારીખ: ${client.birthDetails.date}\nજન્મ સમય: ${client.birthDetails.time}\nજન્મ સ્થાન: ${client.birthDetails.place}`;
    const cleanPhone = client.phone.replace(/[^\d+]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const formatDateShort = (d: any) => {
    if (!d) return '-';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '-';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatShortTime = (d: any) => {
    if (!d) return '-';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '-';
    return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <header className="bg-[#cc6600] text-white px-5 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪐</span>
            <div>
              <h2 className="text-lg font-bold tracking-wide">{client.name} ની કુંડળી</h2>
              <p className="text-xs text-amber-100 font-medium">વૈદિક જ્યોતિષ રિપોર્ટ (Astro-Seva Guruji View)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>શેર કરો</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#cc6600]">
            <Sparkles className="w-8 h-8 animate-spin" />
            <span className="font-bold text-base">કુંડળી ગણતરી થઈ રહી છે... (Calculating Kundli)</span>
          </div>
        ) : errorMsg || !kundliData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-600 p-6 text-center">
            <span className="text-3xl">⚠️</span>
            <span className="font-bold text-base">{errorMsg || 'કુંડળી ગણતરી લોડ થઈ શકી નથી.'}</span>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Quick Info Summary Bar */}
            <div className="bg-amber-50/80 border-b border-[#e8e2d5] p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-[#cc6600]" />
                <div>
                  <span className="text-gray-400 block text-[10px]">જન્મ તારીખ</span>
                  <span className="font-bold">{client.birthDetails.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-[#cc6600]" />
                <div>
                  <span className="text-gray-400 block text-[10px]">જન્મ સમય</span>
                  <span className="font-bold">{client.birthDetails.time} (IST {client.birthDetails.tzOffset})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[#cc6600]" />
                <div>
                  <span className="text-gray-400 block text-[10px]">જન્મ સ્થાન</span>
                  <span className="font-bold truncate max-w-[140px]" title={client.birthDetails.place}>
                    {client.birthDetails.place.split(',')[0]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="w-4 h-4 text-[#cc6600]" />
                <div>
                  <span className="text-gray-400 block text-[10px]">લગ્ન / ચંદ્ર રાશિ</span>
                  <span className="font-bold text-[#cc6600]">
                    {RASHI_NAMES_GU[kundliData.lagnaSignIndex]} / {RASHI_NAMES_GU[kundliData.astro.planets.Moon.sign]}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#e8e2d5] bg-white overflow-x-auto scrollbar-none px-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'charts'
                    ? 'border-[#cc6600] text-[#cc6600] bg-amber-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                🗺️ કુંડળી નકશા (Charts)
              </button>
              <button
                onClick={() => setActiveTab('panchanga')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'panchanga'
                    ? 'border-[#cc6600] text-[#cc6600] bg-amber-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                🗓️ પંચાંગ (Panchanga)
              </button>
              <button
                onClick={() => setActiveTab('cusps')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'cusps'
                    ? 'border-[#cc6600] text-[#cc6600] bg-amber-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                📐 ભાવ અંશ (Cusps)
              </button>
              <button
                onClick={() => setActiveTab('dashas')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'dashas'
                    ? 'border-[#cc6600] text-[#cc6600] bg-amber-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                🔮 દશા (Vimshottari)
              </button>
              <button
                onClick={() => setActiveTab('transits')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'transits'
                    ? 'border-[#cc6600] text-[#cc6600] bg-amber-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                🪐 સાડાસાતી (Saturn)
              </button>
              <button
                onClick={() => setActiveTab('remedies')}
                className={`py-3 px-4 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'remedies'
                    ? 'border-[#cc6600] text-[#cc6600] bg-amber-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                🌺 શુભાશુભ (Remedies)
              </button>
            </div>

            {/* Tab Content Areas */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: CHARTS */}
              {activeTab === 'charts' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lagna Chart */}
                    <NorthIndianChart
                      title="જન્મ લગ્ન કુંડળી (Lagna Chart)"
                      lagnaSign={kundliData.lagnaSignIndex}
                      planetsMap={kundliData.astro.planets}
                    />

                    {/* Moon Chart */}
                    <NorthIndianChart
                      title="ચંદ્ર કુંડળી (Moon Chart)"
                      lagnaSign={kundliData.astro.planets.Moon.sign}
                      planetsMap={kundliData.astro.planets}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Navamsha Chart (D9) */}
                    <NorthIndianChart
                      title="નવમાંશ કુંડળી (Navamsha - D9)"
                      lagnaSign={kundliData.d9Lagna}
                      planetsMap={kundliData.d9Placements}
                    />

                    {/* Chalit / Cusp Chart */}
                    <NorthIndianChart
                      title="ભાવ ચલિત / કસ્પ કુંડળી (Cusp Chart)"
                      lagnaSign={kundliData.lagnaSignIndex}
                      planetsMap={kundliData.cuspPlacements}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PANCHANGA */}
              {activeTab === 'panchanga' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#e8e2d5] rounded-xl p-5 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-[#cc6600]">
                      જન્મ સમય પંચાંગ (Panchanga at Birth)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                        <span className="text-xs text-gray-500 font-semibold block">તિથિ (Tithi)</span>
                        <span className="font-bold text-gray-900 text-base">{kundliData.panchanga.tithi.formatted}</span>
                      </div>

                      <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                        <span className="text-xs text-gray-500 font-semibold block">નક્ષત્ર (Nakshatra)</span>
                        <span className="font-bold text-gray-900 text-base">
                          {kundliData.panchanga.nakshatra.formatted} (ચરણ {Math.floor((kundliData.astro.planets.Moon.longitude % 13.333) / 3.333) + 1})
                        </span>
                      </div>

                      <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                        <span className="text-xs text-gray-500 font-semibold block">યોગ (Yoga)</span>
                        <span className="font-bold text-gray-900 text-base">{kundliData.panchanga.yoga.formatted}</span>
                      </div>

                      <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                        <span className="text-xs text-gray-500 font-semibold block">કરણ (Karana)</span>
                        <span className="font-bold text-gray-900 text-base">{kundliData.panchanga.karana.formatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transition Times Table */}
                  <div className="bg-white border border-[#e8e2d5] rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-amber-100/50 border-b border-[#e8e2d5]">
                      <h4 className="font-bold text-sm text-[#cc6600]">
                        પંચાંગ પરિવર્તન સમય (Panchanga Transition Times)
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                          <tr>
                            <th className="p-3">તત્વ (Element)</th>
                            <th className="p-3">સબમિટ વિગત (At Birth)</th>
                            <th className="p-3">પ્રારંભ સમય (Start)</th>
                            <th className="p-3">અંત સમય (End)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          <tr>
                            <td className="p-3 font-bold text-gray-900">તિથિ (Tithi)</td>
                            <td className="p-3 text-amber-800 font-semibold">{kundliData.panchanga.tithi.formatted}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.tithi.startTime)}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.tithi.endTime)}</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-gray-900">નક્ષત્ર (Nakshatra)</td>
                            <td className="p-3 text-amber-800 font-semibold">{kundliData.panchanga.nakshatra.formatted}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.nakshatra.startTime)}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.nakshatra.endTime)}</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-gray-900">યોગ (Yoga)</td>
                            <td className="p-3 text-amber-800 font-semibold">{kundliData.panchanga.yoga.formatted}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.yoga.startTime)}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.yoga.endTime)}</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-gray-900">કરણ (Karana)</td>
                            <td className="p-3 text-amber-800 font-semibold">{kundliData.panchanga.karana.formatted}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.karana.startTime)}</td>
                            <td className="p-3 text-gray-600">{formatShortTime(kundliData.panchanga.karana.endTime)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSPS */}
              {activeTab === 'cusps' && (
                <div className="bg-white border border-[#e8e2d5] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-amber-100/50 border-b border-[#e8e2d5]">
                    <h3 className="font-bold text-sm text-[#cc6600]">
                      ભાવ અંશ અને રાશિ (House Cusps & Degrees)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3">ભાવ (House)</th>
                          <th className="p-3">સ્પષ્ટ અંશ (Degrees)</th>
                          <th className="p-3">રાશિ નામ (Rashi Sign)</th>
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
                              <td className="p-3 font-bold text-gray-900">ભાવ {houseNum}</td>
                              <td className="p-3 text-gray-700">{degStr}</td>
                              <td className="p-3 font-semibold text-[#cc6600]">{RASHI_NAMES_GU[signIndex]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: VIMSHOTTARI DASHAS */}
              {activeTab === 'dashas' && (
                <div className="space-y-6">
                  {/* Active dasha banner */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-xl shadow-md">
                    <span className="text-xs font-semibold opacity-90 block">જન્મ સમયે ભોગ્ય દશા (Dasha at Birth)</span>
                    <h3 className="text-lg font-bold mt-1">
                      {kundliData.dasha.bhogyaDasha.lord} ({kundliData.dasha.bhogyaDasha.formatted})
                    </h3>
                  </div>

                  {/* Vimshottari Mahadashas List */}
                  <div className="bg-white border border-[#e8e2d5] rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-amber-100/50 border-b border-[#e8e2d5]">
                      <h4 className="font-bold text-sm text-[#cc6600]">
                        વિંશોત્તરી મહા દશા ચક્ર (Vimshottari Dasha Timeline)
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100 text-xs">
                      {kundliData.dasha.mahadashas.map((md: any, idx: number) => (
                        <div key={idx} className="p-4 hover:bg-amber-50/30 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-gray-900">
                              {PLANET_NAMES_GU[md.lord] || md.lord} Dasha ({PLANET_SPANS[md.lord]} વર્ષ)
                            </span>
                            <span className="text-gray-500 font-semibold">
                              {formatDateShort(md.startDate)} — {formatDateShort(md.endDate)}
                            </span>
                          </div>
                          {md.antardashas && (
                            <div className="mt-2 text-[11px] text-gray-500 flex flex-wrap gap-1.5">
                              <span className="font-semibold text-gray-700">અંતર દશા:</span>
                              {md.antardashas.slice(0, 6).map((ad: any, adIdx: number) => (
                                <span key={adIdx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                  {PLANET_NAMES_GU[ad.lord] || ad.lord}
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

              {/* TAB 5: SATURN TRANSITS */}
              {activeTab === 'transits' && (
                <div className="bg-white border border-[#e8e2d5] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-amber-100/50 border-b border-[#e8e2d5]">
                    <h3 className="font-bold text-sm text-[#cc6600]">
                      સાડાસાતી & શનિ ગોચર (Lifetime Saturn Transits Table)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3">ગોચર પ્રકાર (Type)</th>
                          <th className="p-3">શનિ રાશિ (Saturn)</th>
                          <th className="p-3">પ્રારંભ તારીખ (Start)</th>
                          <th className="p-3">અંત તારીખ (End)</th>
                          <th className="p-3">પાયા (Metal)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {kundliData.transits.map((tRow: any, idx: number) => (
                          <tr key={idx} className="hover:bg-amber-50/40">
                            <td className="p-3 font-bold text-gray-900">{tRow.type}</td>
                            <td className="p-3 text-gray-700">{tRow.saturnSignFormatted}</td>
                            <td className="p-3 text-gray-600">{formatDateShort(tRow.startDate)}</td>
                            <td className="p-3 text-gray-600">{formatDateShort(tRow.endDate)}</td>
                            <td className="p-3 font-semibold text-green-700">{tRow.paya}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: SHUBHASHUBH & REMEDIES */}
              {activeTab === 'remedies' && (
                <div className="bg-white border border-[#e8e2d5] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-amber-100/50 border-b border-[#e8e2d5]">
                    <h3 className="font-bold text-sm text-[#cc6600]">
                      શુભાશુભ નું જ્ઞાન & ઉપાયો (Auspicious Remedies & Guide)
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 text-xs">
                    {[
                      { k: 'મૂળાંક (Radical Number)', v: kundliData.shubha.mulank },
                      { k: 'ભાગ્યાંક (Destiny Number)', v: kundliData.shubha.bhagyank },
                      { k: 'મિત્રાંક (Friendly Numbers)', v: kundliData.shubha.friendlyNumbers },
                      { k: 'શત્રુ અંક (Enemy Numbers)', v: kundliData.shubha.enemyNumbers },
                      { k: 'શુભ વર્ષ (Auspicious Years)', v: kundliData.shubha.auspiciousYears },
                      { k: 'શુભ વાર (Auspicious Days)', v: kundliData.shubha.auspiciousDays },
                      { k: 'શુભ ગ્રહ (Auspicious Planets)', v: kundliData.shubha.auspiciousPlanets },
                      { k: 'અશુભ ગ્રહ (Inauspicious Planets)', v: kundliData.shubha.inauspiciousPlanets },
                      { k: 'મિત્ર રાશિ (Friendly Signs)', v: kundliData.shubha.friendlySigns },
                      { k: 'મિત્ર લગ્ન (Friendly Lagnas)', v: kundliData.shubha.friendlyLagnas },
                      { k: 'શુભ રત્ન (Auspicious Gemstone)', v: kundliData.shubha.gemstone },
                      { k: 'શુભ ઉપરત્ન (Auspicious Sub-gemstone)', v: kundliData.shubha.subGemstone },
                      { k: 'ભાગ્ય રત્ન (Destiny Gemstone)', v: kundliData.shubha.fortuneGemstone },
                      { k: 'અનુકૂળ દેવતા (Auspicious Deity)', v: kundliData.shubha.deity },
                      { k: 'શુભ ધાતુ (Auspicious Metal)', v: kundliData.shubha.metal },
                      { k: 'શુભ રંગ (Auspicious Color)', v: kundliData.shubha.color },
                      { k: 'દિશા (Direction)', v: kundliData.shubha.direction },
                      { k: 'સમય (Auspicious Time)', v: kundliData.shubha.timeOfDay },
                      { k: 'પદાર્થ (Offering Substances)', v: kundliData.shubha.offerings },
                      { k: 'અન્ન (Auspicious Food)', v: kundliData.shubha.food },
                      { k: 'દ્રવ્ય (Liquids/Ghee)', v: kundliData.shubha.liquid },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center hover:bg-amber-50/40">
                        <span className="font-semibold text-gray-500">{item.k}</span>
                        <span className="font-bold text-gray-900 text-sm text-right">{item.v || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KundliViewModal;
