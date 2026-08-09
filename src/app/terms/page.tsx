'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileCheck, Scale, AlertTriangle, HelpCircle } from 'lucide-react';

type Language = 'EN' | 'GU' | 'HI';

export default function TermsAndConditionsPage() {
  const [lang, setLang] = useState<Language>('GU');

  const content = {
    GU: {
      title: 'નિયમો અને શરતો (Terms & Conditions)',
      subtitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સેવાઓનો ઉપયોગ કરતી વખતે ધ્યાનમાં રાખવાના નિયમો',
      lastUpdated: 'છેલ્લું અપડેટ: 9 ઓગસ્ટ 2026',
      backHome: 'મુખ્ય પાના પર પાછા જાવ',
      sections: [
        {
          heading: '૧. સેવાઓનું સ્વરૂપ (Nature of Services)',
          text: 'શ્રી ગણેશામ્બિકા જ્યોતિષ દ્વારા પૂરી પાડવામાં આવતી તમામ સેવાઓ (કુંડળી વિશ્લેષણ, સાડે સતી/પનોતી સમયરેખા, મહાદશા ફળાદેશ અને મંત્ર ઉપાસના માર્ગદર્શન) સનાતન વૈદિક પરાશરી જ્યોતિષશાસ્ત્રના સિદ્ધાંતો પર આધારિત આધ્યાત્મિક સલાહ અને માર્ગદર્શન છે.',
        },
        {
          heading: '૨. આધ્યાત્મિક અને કાનૂની ડિસ્ક્લેમર (Disclaimer)',
          text: 'જ્યોતિષશાસ્ત્ર એ પ્રાચીન વૈદિક શાસ્ત્ર અને માર્ગદર્શનનું સાધન છે. જ્યોતિષીય સલાહ એ તબીબી (Medical), કાનૂની (Legal), કે નાણાકીય (Financial) વ્યાવસાયિક સલાહનો વિકલ્પ નથી. જીવનમાં લેવાતા તમામ નિર્ણયો માટે યુઝર/ગ્રાહક પોતે સ્વતંત્ર અને જવાબદાર રહે છે.',
        },
        {
          heading: '૩. ચૂકવણી અને ડિજિટલ ડિલિવરી (Payment & Delivery)',
          text: 'તમામ સેવાઓ માટે દર્શાવેલ ફી નરેન્દ્રગિરી ગોસ્વામીજીના સમય, જ્યોતિષીય ગણતરી અને રિપોર્ટ તૈયાર કરવા માટે લેવામાં આવે છે. કુંડળી રિપોર્ટ તૈયાર થયા બાદ વોટ્સએપ પર સિક્યોર લિંક દ્વારા ડિજિટલી મોકલવામાં આવે છે.',
        },
        {
          heading: '૪. ચોકસાઈ અને જન્મ સમય (Birth Details Accuracy)',
          text: 'કુંડળી ગણતરીની સચોટતા ગ્રાહક દ્વારા આપવામાં આવેલા પિનપોઈન્ટ જન્મ સમય, તારીખ અને જન્મ સ્થાન પર આધારિત છે. ખોટા જન્મ સમયના કારણે આવતા તફાવત માટે શ્રી ગણેશામ્બિકા જ્યોતિષ જવાબદાર રહેશે નહીં.',
        },
        {
          heading: '૫. બૌદ્ધિક સંપદા (Intellectual Property)',
          text: 'આ વેબસાઇટ પર ઉપલબ્ધ તમામ વૈદિક સોફ્ટવેર ગણતરીઓ, ડિઝાઇન, ચાર્ટ્સ અને લેખો શ્રી ગણેશામ્બિકા જ્યોતિષની માલિકી ધરાવે છે. લેખિત મંજૂરી વગર તેની ચોરી કે કોપીરાઇટ ઉલ્લંઘન સખત મનાઈ છે.',
        },
      ],
    },
    HI: {
      title: 'नियम और शर्तें (Terms & Conditions)',
      subtitle: 'श्री गणेशाम्बिका ज्योतिष सेवाओं का उपयोग करते समय ध्यान रखने योग्य नियम',
      lastUpdated: 'अंतिम अपडेट: 9 अगस्त 2026',
      backHome: 'मुख्य पृष्ठ पर वापस जाएं',
      sections: [
        {
          heading: '1. सेवाओं का स्वरूप (Nature of Services)',
          text: 'श्री गणेशाम्बिका ज्योतिष द्वारा प्रदान की जाने वाली सभी सेवाएं (कुंडली विश्लेषण, साडे सती/पनौती समयरेखा, महादशा फलादेश और मंत्र उपासना मार्गदर्शन) सनातन वैदिक पराशरी ज्योतिष शास्त्र के सिद्धांतों पर आधारित आध्यात्मिक सलाह और मार्गदर्शन हैं।',
        },
        {
          heading: '2. आध्यात्मिक और कानूनी अस्वीकरण (Disclaimer)',
          text: 'ज्योतिष शास्त्र प्राचीन वैदिक शास्त्र और मार्गदर्शन का साधन है। ज्योतिषीय सलाह चिकित्सा (Medical), कानूनी (Legal), या वित्तीय (Financial) पेशेवर सलाह का विकल्प नहीं है। जीवन में लिए जाने वाले सभी निर्णयों के लिए उपयोगकर्ता/ग्राहक स्वयं स्वतंत्र और जिम्मेदार रहता है।',
        },
        {
          heading: '3. भुगतान और डिजिटल डिलीवरी (Payment & Delivery)',
          text: 'सभी सेवाओं के लिए दर्शाई गई फीस नरेन्द्रगिरि गोस्वामी जी के समय, ज्योतिषीय गणना और रिपोर्ट तैयार करने के लिए ली जाती है। कुंडली रिपोर्ट तैयार होने के बाद व्हाट्सएप पर सुरक्षित लिंक के माध्यम से डिजिटली भेजी जाती है।',
        },
        {
          heading: '4. सटीकता और जन्म समय (Birth Details Accuracy)',
          text: 'कुंडली गणना की सटीकता ग्राहक द्वारा दिए गए सटीक जन्म समय, तिथि और जन्म स्थान पर निर्भर करती है। गलत जन्म समय के कारण आने वाले अंतर के लिए श्री गणेशाम्बिका ज्योतिष जिम्मेदार नहीं होगा।',
        },
        {
          heading: '5. बौद्धिक संपदा (Intellectual Property)',
          text: 'इस वेबसाइट पर उपलब्ध सभी वैदिक सॉफ्टवेयर गणनाएं, डिजाइन, चार्ट और लेख श्री गणेशाम्बिका ज्योतिष के स्वामित्व में हैं। लिखित अनुमति के बिना इसकी चोरी या कॉपीराइट उल्लंघन सख्त मना है।',
        },
      ],
    },
    EN: {
      title: 'Terms & Conditions',
      subtitle: 'Terms governing the use of Shree Ganeshambika Jyotish consultation & Kundli services',
      lastUpdated: 'Last Updated: August 9, 2026',
      backHome: 'Back to Home',
      sections: [
        {
          heading: '1. Nature of Services',
          text: 'All services offered by Shree Ganeshambika Jyotish (Kundli calculations, Sade Sati & Panoti timelines, Vimshottari Dasha analysis, and Mantra Upasana guidance) are traditional spiritual advice based on Parashari Vedic Astrology principles.',
        },
        {
          heading: '2. Spiritual & Legal Disclaimer',
          text: 'Vedic astrology is an ancient spiritual science for self-guidance. Astrological readings do not constitute medical, legal, or financial professional guarantees. Clients remain sole decision-makers for their personal choices.',
        },
        {
          heading: '3. Service Payments & Digital Delivery',
          text: 'Service fees cover the time, calculations, and reporting compiled by Narendragiri Goswami Ji. All reports are delivered digitally via secure WhatsApp link and web dashboard.',
        },
        {
          heading: '4. Accuracy of Birth Data',
          text: 'Horoscope calculations depend entirely on the birth date, precise time, and place provided by the client. We are not responsible for discrepancies arising from incorrect birth time provided.',
        },
        {
          heading: '5. Intellectual Property Rights',
          text: 'All calculations, UI components, custom chart generators, and written articles on this platform are owned by Shree Ganeshambika Jyotish. Unauthorized duplication is strictly prohibited.',
        },
      ],
    },
  }[lang];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 antialiased pb-20">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-stone-200/80 px-4 sm:px-12 py-3.5 flex justify-between items-center shadow-2xs">
        <Link href="/" className="flex items-center gap-2.5 text-[#7A1C28] font-bold text-sm hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          <span>{content.backHome}</span>
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          {(['EN', 'GU', 'HI'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                lang === l ? 'bg-[#7A1C28] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {l === 'EN' ? 'English' : l === 'GU' ? 'ગુજરાતી' : 'हिंदी'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8 text-left">
        
        {/* Title Section */}
        <div className="space-y-2 border-b border-stone-200/80 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#A14E15] text-xs font-bold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Official Legal Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">{content.title}</h1>
          <p className="text-sm sm:text-base text-stone-600 font-medium">{content.subtitle}</p>
          <p className="text-xs text-stone-400 font-mono pt-1">{content.lastUpdated}</p>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-8 text-stone-800 leading-relaxed text-sm sm:text-base">
          {content.sections.map((sec, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#7A1C28] flex items-center gap-2">
                <span>{sec.heading}</span>
              </h2>
              <p className="text-stone-700 leading-relaxed">{sec.text}</p>
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="bg-[#FAF6EE] border border-amber-200/80 rounded-3xl p-6 text-center space-y-2">
          <p className="text-xs font-bold text-[#A14E15] uppercase tracking-wider">Official Inquiries</p>
          <p className="text-sm font-semibold text-stone-800">Shree Ganeshambika Jyotish — Narendragiri Goswami Ji</p>
          <p className="text-xs text-stone-600">Surat, Gujarat, India • Authenticated Vedic Guidance</p>
        </div>

      </main>
    </div>
  );
}
