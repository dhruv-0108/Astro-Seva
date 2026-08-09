'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { Button } from '../../components/ui/shadcn/button';

type Language = 'EN' | 'GU' | 'HI';

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<Language>('GU');

  const content = {
    GU: {
      title: 'ગોપનીયતા નીતિ (Privacy Policy)',
      subtitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સેવાઓ દ્વારા તમારા ડેટાની સુરક્ષા અને ગોપનીયતાની ખાતરી',
      lastUpdated: 'છેલ્લું અપડેટ: 9 ઓગસ્ટ 2026',
      backHome: 'મુખ્ય પાના પર પાછા જાવ',
      sections: [
        {
          heading: '૧. અમે કયો ડેટા એકત્રિત કરીએ છીએ?',
          text: 'શ્રી ગણેશામ્બિકા જ્યોતિષ સેવાઓમાં કુંડળી ગણતરી અને જ્યોતિષીય પરામર્શ માટે અમે નીચેની માહિતી એકત્ર કરીએ છીએ:',
          items: [
            'પૂરું નામ (Client Full Name)',
            'વોટ્સએપ ફોન નંબર (WhatsApp Contact Number)',
            'જન્મ તારીખ અને પિનપોઈન્ટ જન્મ સમય (Date & Exact Time of Birth)',
            'જન્મ સ્થળ - ગામ/શહેર અને રેખાંશ-અક્ષાંશ (Birth Place Coordinates)',
          ],
        },
        {
          heading: '૨. ડેટાનો ઉપયોગ કેવી રીતે થાય છે?',
          text: 'તમારી માહિતીનો ઉપયોગ માત્ર અને માત્ર નીચેના હેતુઓ માટે થાય છે:',
          items: [
            'નરેન્દ્રગિરી ગોસ્વામીજી દ્વારા વૈદિક પરાશરી પદ્ધતિ મુજબ સચોટ જન્મ કુંડળી, ગ્રહ ગોચર અને મહાદશાની ગણતરી કરવા માટે.',
            'તમારી તૈયાર થયેલી કુંડળીનો રિપોર્ટ વોટ્સએપ પર સિક્યોર લિંક દ્વારા મોકલવા માટે.',
            'અમે ક્યારેય પણ તમારો ફોન નંબર કે જન્મ વિગતો કોઈ તૃતીય પક્ષ (Third Party) ને વેચતા કે શેર કરતા નથી.',
          ],
        },
        {
          heading: '૩. ડેટા સુરક્ષા અને સંગ્રહ (Data Security)',
          text: 'તમારો તમામ ડેટા ગૂગલ ફાયરબેઝ ક્લાઉડ (Google Cloud Firebase Firestore) માં અત્યંત સુરક્ષિત રીતે સંગ્રહિત થાય છે. માત્ર અધિકૃત નરેન્દ્રગિરી ગોસ્વામીજી (એડમિન) જ આ માહિતી જોઈ શકે છે. જાહેરમાં કે અન્ય કોઈ વ્યક્તિ માટે તમારો અંગત ડેટા અપ્રાપ્ય છે.',
        },
        {
          heading: '૪. કૂકીઝ અને એનાલિટિક્સ (Cookies)',
          text: 'અમારી વેબસાઇટ ભાષા પસંદગી (ગુજરાતી, હિન્દી, અંગ્રેજી) અને યુઝર અનુભવ સુધારવા માટે લોકલ સ્ટોરેજનો ઉપયોગ કરે છે. અમે બિનજરૂરી ટ્રેકિંગ કૂકીઝનો ઉપયોગ કરતા નથી.',
        },
        {
          heading: '૫. તમારા અધિકારો (Your Rights)',
          text: 'જો તમે તમારી કુંડળી વિગતો અથવા સંપર્ક નંબર સિસ્ટમમાંથી કાયમી માટે કાઢી નાખવા (Delete) માંગતા હોવ, તો તમે કોઈપણ સમયે અમારો સંપર્ક કરી શકો છો. તમારી વિનંતીના ૨૪ કલાકમાં તમારો ડેટા કાઢી નાખવામાં આવશે.',
        },
      ],
    },
    HI: {
      title: 'गोपनीयता नीति (Privacy Policy)',
      subtitle: 'श्री गणेशाम्बिका ज्योतिष सेवाओं द्वारा आपके डेटा की सुरक्षा और गोपनीयता की गारंटी',
      lastUpdated: 'अंतिम अपडेट: 9 अगस्त 2026',
      backHome: 'मुख्य पृष्ठ पर वापस जाएं',
      sections: [
        {
          heading: '1. हम कौन सा डेटा एकत्र करते हैं?',
          text: 'श्री गणेशाम्बिका ज्योतिष सेवाओं में कुंडली गणना और ज्योतिषीय परामर्श के लिए हम निम्नलिखित जानकारी एकत्र करते हैं:',
          items: [
            'पूरा नाम (Client Full Name)',
            'व्हाट्सएप फोन नंबर (WhatsApp Contact Number)',
            'जन्म तिथि और सटीक जन्म समय (Date & Exact Time of Birth)',
            'जन्म स्थान - गांव/शहर और अक्षांश-देशांतर (Birth Place Coordinates)',
          ],
        },
        {
          heading: '2. डेटा का उपयोग कैसे किया जाता है?',
          text: 'आपकी जानकारी का उपयोग केवल और केवल निम्नलिखित उद्देश्यों के लिए किया जाता है:',
          items: [
            'नरेन्द्रगिरि गोस्वामी जी द्वारा वैदिक पराशरी पद्धति के अनुसार सटीक जन्म कुंडली, ग्रह गोचर और महादशा की गणना करने के लिए।',
            'आपकी तैयार कुंडली रिपोर्ट व्हाट्सएप पर सुरक्षित लिंक के माध्यम से भेजने के लिए।',
            'हम कभी भी आपका फोन नंबर या जन्म विवरण किसी तीसरे पक्ष (Third Party) को बेचते या साझा नहीं करते हैं।',
          ],
        },
        {
          heading: '3. डेटा सुरक्षा और भंडारण (Data Security)',
          text: 'आपका सारा डेटा गूगल फायरबेस क्लाउड (Google Cloud Firebase Firestore) में अत्यंत सुरक्षित रूप से संग्रहीत किया जाता है। केवल अधिकृत नरेन्द्रगिरि गोस्वामी जी (एडमिन) ही यह जानकारी देख सकते हैं। सार्वजनिक रूप से या किसी अन्य व्यक्ति के लिए आपका व्यक्तिगत डेटा अप्राप्य है।',
        },
        {
          heading: '4. कुकीज़ और एनालिटिक्स (Cookies)',
          text: 'हमारी वेबसाइट भाषा वरीयता (गुजराती, हिंदी, अंग्रेजी) और उपयोगकर्ता अनुभव को सुधारने के लिए लोकल स्टोरेज का उपयोग करती है। हम अनावश्यक ट्रैकिंग कुकीज़ का उपयोग नहीं करते हैं।',
        },
        {
          heading: '5. आपके अधिकार (Your Rights)',
          text: 'यदि आप अपनी कुंडली विवरण या संपर्क नंबर सिस्टम से स्थायी रूप से हटाना (Delete) चाहते हैं, तो आप किसी भी समय हमसे संपर्क कर सकते हैं। आपके अनुरोध के 24 घंटों के भीतर आपका डेटा हटा दिया जाएगा।',
        },
      ],
    },
    EN: {
      title: 'Privacy Policy',
      subtitle: 'How Shree Ganeshambika Jyotish protects and respects your personal birth data',
      lastUpdated: 'Last Updated: August 9, 2026',
      backHome: 'Back to Home',
      sections: [
        {
          heading: '1. Information We Collect',
          text: 'To compute authentic Parashari Vedic astrological horoscopes and provide consultations, we collect:',
          items: [
            'Full Client Name',
            'WhatsApp Contact Phone Number',
            'Date of Birth & Exact Time of Birth',
            'Place of Birth (Village / Town / City & Geographical Coordinates)',
          ],
        },
        {
          heading: '2. How Your Information Is Used',
          text: 'Your personal and birth information is strictly used for:',
          items: [
            'Calculating precise Kundli horoscopes, planetary transit (Gochar), and Vimshottari Dasha periods by Narendragiri Goswami Ji.',
            'Delivering your completed digital Kundli report directly to your WhatsApp phone number via a secure private URL.',
            'We NEVER sell, rent, or share your phone number or birth details with any third party or marketing agency.',
          ],
        },
        {
          heading: '3. Data Storage & Security',
          text: 'All submission data is encrypted and securely stored in Google Cloud Firebase Firestore with strict access control rules (`request.auth != null`). Only authorized administrator Narendragiri Goswami Ji can access client records.',
        },
        {
          heading: '4. Cookies & Storage',
          text: 'We use local browser storage strictly to remember your language preference (Gujarati, Hindi, English). We do not use intrusive third-party advertising or tracking cookies.',
        },
        {
          heading: '5. Data Deletion Rights',
          text: 'You have full rights to request the permanent deletion of your birth records from our database at any time by contacting us directly.',
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Secure & Confidential</span>
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
          <p className="text-xs font-bold text-[#A14E15] uppercase tracking-wider">Contact for Privacy & Data Inquiries</p>
          <p className="text-sm font-semibold text-stone-800">Shree Ganeshambika Jyotish — Narendragiri Goswami Ji</p>
          <p className="text-xs text-stone-600">Surat, Gujarat, India • WhatsApp Support Available</p>
        </div>

      </main>
    </div>
  );
}
