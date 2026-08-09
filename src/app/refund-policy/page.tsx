'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

type Language = 'EN' | 'GU' | 'HI';

export default function RefundPolicyPage() {
  const [lang, setLang] = useState<Language>('GU');

  const content = {
    GU: {
      title: 'રિફંડ અને રદ્દીકરણ નીતિ (Refund & Cancellation Policy)',
      subtitle: 'ડિજિટલ જ્યોતિષ સેવાઓ અને કુંડળી પરામર્શ માટે રિફંડની માહિતી',
      lastUpdated: 'છેલ્લું અપડેટ: 9 ઓગસ્ટ 2026',
      backHome: 'મુખ્ય પાના પર પાછા જાવ',
      sections: [
        {
          heading: '૧. ડિજિટલ સેવાઓનું સ્વરૂપ (Digital Custom Services)',
          text: 'કુંડળી ગણતરી અને પરામર્શ એ દરેક ગ્રાહકની વ્યક્તિગત જન્મ વિગતો અનુસાર ખાસ તૈયાર કરવામાં આવતી ડિજિટલ સેવા છે. એકવાર ગણતરી અને રિપોર્ટ પ્રક્રિયા શરૂ થઈ જાય પછી ઓર્ડર રદ કરી શકાતો નથી.',
        },
        {
          heading: '૨. રિફંડની પાત્રતા (Refund Eligibility)',
          text: 'ડિજિટલ સેવા હોવાથી સામાન્ય રીતે ફી નોન-રિફંડેબલ (Non-Refundable) છે. જો કે, નીચેના કિસ્સામાં રિફંડ માટે વિચારણા કરવામાં આવશે:',
          items: [
            'જો ગ્રાહક દ્વારા ભૂલથી ડુપ્લિકેટ પેમેન્ટ (એકથી વધુ વાર) થઈ ગયું હોય.',
            'જો ટેકનિકલ ખામીના કારણે ૭૨ કલાક સુધી કુંડળી રિપોર્ટ જનરેટ ન થઈ શકે.',
          ],
        },
        {
          heading: '૩. રિફંડની પ્રક્રિયા (Refund Process)',
          text: 'પાત્રતા ધરાવતા કિસ્સામાં ગ્રાહકે વોટ્સએપ અથવા ઈમેઈલ પર પેમેન્ટ રસીદ સાથે વિનંતી મોકલવાની રહેશે. ચકાસણી બાદ ૫-૭ કામકાજના દિવસોમાં મૂળ પેમેન્ટ પદ્ધતિમાં રિફંડ જમા કરવામાં આવશે.',
        },
      ],
    },
    HI: {
      title: 'रिफंड और रद्दीकरण नीति (Refund & Cancellation Policy)',
      subtitle: 'डिजिटल ज्योतिष सेवाओं और कुंडली परामर्श के लिए रिफंड की जानकारी',
      lastUpdated: 'अंतिम अपडेट: 9 अगस्त 2026',
      backHome: 'मुख्य पृष्ठ पर वापस जाएं',
      sections: [
        {
          heading: '1. डिजिटल सेवाओं का स्वरूप (Digital Custom Services)',
          text: 'कुंडली गणना और परामर्श प्रत्येक ग्राहक के व्यक्तिगत जन्म विवरण के अनुसार विशेष रूप से तैयार की जाने वाली डिजिटल सेवा है। एक बार गणना और रिपोर्ट प्रक्रिया शुरू होने के बाद ऑर्डर रद्द नहीं किया जा सकता है।',
        },
        {
          heading: '2. रिफंड की पात्रता (Refund Eligibility)',
          text: 'डिजिटल सेवा होने के कारण आमतौर पर फीस नॉन-रिफंडेबल (Non-Refundable) है। हालांकि, निम्नलिखित स्थिति में रिफंड पर विचार किया जाएगा:',
          items: [
            'यदि ग्राहक द्वारा गलती से डुप्लिकेट भुगतान (एक से अधिक बार) हो गया हो।',
            'यदि तकनीकी खराबी के कारण 72 घंटों तक कुंडली रिपोर्ट जनरेट न हो सके।',
          ],
        },
        {
          heading: '3. रिफंड की प्रक्रिया (Refund Process)',
          text: 'पात्र स्थिति में ग्राहक को व्हाट्सएप या ईमेल पर भुगतान रसीद के साथ अनुरोध भेजना होगा। सत्यापन के बाद 5-7 कार्य दिवसों में मूल भुगतान विधि में रिफंड जमा कर दिया जाएगा।',
        },
      ],
    },
    EN: {
      title: 'Refund & Cancellation Policy',
      subtitle: 'Refund terms for digital Kundli reports and astrological consultation services',
      lastUpdated: 'Last Updated: August 9, 2026',
      backHome: 'Back to Home',
      sections: [
        {
          heading: '1. Nature of Custom Digital Services',
          text: 'Astrological consultations and Kundli calculations are personalized digital services prepared specifically based on individual birth details. Orders cannot be cancelled once processing has begun.',
        },
        {
          heading: '2. Refund Eligibility',
          text: 'Fees paid for digital services are non-refundable. Refunds are considered exclusively under the following conditions:',
          items: [
            'Accidental duplicate payments made for the same service.',
            'Technical failure preventing Kundli delivery within 72 hours.',
          ],
        },
        {
          heading: '3. Refund Resolution',
          text: 'For approved duplicate charges, funds will be refunded back to the original payment source within 5-7 working business days.',
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Digital Services Terms</span>
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
              {sec.items && (
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-stone-700 font-medium">
                  {sec.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="bg-[#FAF6EE] border border-amber-200/80 rounded-3xl p-6 text-center space-y-2">
          <p className="text-xs font-bold text-[#A14E15] uppercase tracking-wider">Refund Support</p>
          <p className="text-sm font-semibold text-stone-800">Shree Ganeshambika Jyotish — Narendragiri Goswami Ji</p>
          <p className="text-xs text-stone-600">Surat, Gujarat, India • Instant Support via WhatsApp</p>
        </div>

      </main>
    </div>
  );
}
