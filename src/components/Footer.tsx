'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  lang?: 'EN' | 'GU' | 'HI';
}

export default function Footer({ lang = 'GU' }: FooterProps) {
  const t = {
    GU: {
      brandTitle: 'શ્રી ગણેશામ્બિકા જ્યોતિષ',
      brandSubtitle: 'નરેન્દ્રગિરી ગોસ્વામીજી — શાક્ત ઉપાસક, હનુમાન ઉપાસક, ભૈરવ ઉપાસક, કર્ણ પિશાચિની ઉપાસક',
      linksTitle: 'અંગત અને કાનૂની માહિતી',
      privacy: 'ગોપનીયતા નીતિ (Privacy Policy)',
      terms: 'નિયમો અને શરતો (Terms & Conditions)',
      refund: 'રિફંડ અને રદ્દીકરણ નીતિ (Refund Policy)',
      adminLogin: 'ગુરુજી એડમિન પોર્ટલ (Admin Login)',
      copyright: '© 2026 શ્રી ગણેશામ્બિકા જ્યોતિષ. સર્વાધિકાર સુરક્ષિત.',
      tagline: 'વૈદિક પરંપરા અને આધ્યાત્મિક ઉપાસના દ્વારા જીવન માર્ગદર્શન',
    },
    HI: {
      brandTitle: 'श्री गणेशाम्बिका ज्योतिष',
      brandSubtitle: 'नरेन्द्रगिरि गोस्वामी जी — शाक्त उपासक, हनुमान उपासक, भैरव उपासक, कर्ण पिशाचिनी उपासक',
      linksTitle: 'कानूनी जानकारी',
      privacy: 'गोपनीयता नीति (Privacy Policy)',
      terms: 'नियम और शर्तें (Terms & Conditions)',
      refund: 'रिफंड नीति (Refund Policy)',
      adminLogin: 'गुरुजी एडमिन पोर्टल (Admin Login)',
      copyright: '© 2026 श्री गणेशाम्बिका ज्योतिष। सर्वाधिकार सुरक्षित।',
      tagline: 'वैदिक परंपरा और आध्यात्मिक उपासना द्वारा जीवन मार्गदर्शन',
    },
    EN: {
      brandTitle: 'Shree Ganeshambika Jyotish',
      brandSubtitle: 'Narendragiri Goswami Ji — Shaakta, Hanuman, Bhairava & Karna Pishachini Upasak',
      linksTitle: 'Legal & Policies',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      refund: 'Refund & Cancellation Policy',
      adminLogin: 'Guruji Admin Portal',
      copyright: '© 2026 Shree Ganeshambika Jyotish. All rights reserved.',
      tagline: 'Vedic Tradition & Spiritual Upasana Guidance',
    },
  }[lang];

  return (
    <footer className="bg-[#1C1817] text-stone-300 font-sans pt-12 pb-16 border-t-2 border-amber-600/30 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info (Cols 1-7) */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-amber-100 tracking-tight">{t.brandTitle}</h3>
                <p className="text-xs text-amber-300/80 font-medium">{t.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-xl">
              {t.brandSubtitle}
            </p>

            <div className="inline-flex items-center gap-2 text-[11px] text-emerald-400 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% SSL Encrypted & Private Data Protection</span>
            </div>
          </div>

          {/* Quick Legal Links (Cols 8-12) */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.linksTitle}</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-stone-300">
              <li>
                <Link href="/privacy" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{t.privacy}</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{t.terms}</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{t.refund}</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Sacred Chanting Bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-medium">
          <p>{t.copyright}</p>
          <p className="text-amber-400/70 font-serif tracking-widest">
            {lang === 'EN' ? '॥ Shree Ganeshay Namah ॥' : lang === 'GU' ? '॥ શ્રી ગણેશાય નમઃ ॥' : '॥ श्री गणेशाय नमः ॥'}
          </p>
        </div>

      </div>
    </footer>
  );
}
