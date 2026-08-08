'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, Plus, Sparkles, Smartphone } from 'lucide-react';

interface PWAInstallBannerProps {
  lang?: 'EN' | 'GU' | 'HI';
}

export default function PWAInstallBanner({ lang = 'GU' }: PWAInstallBannerProps) {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return; // Do not show inside installed app
    }

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // 3. Capture beforeinstallprompt for Android Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Always show banner on mobile browsers (iOS or Android) if not installed
    const isMobile = /iphone|ipad|ipod|android|mobile/.test(userAgent);
    if (isMobile) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      alert(
        lang === 'GU'
          ? 'બ્રાઉઝર મેનૂ (3 બિંદુઓ ⋮) પર ક્લિક કરીને "Add to Home screen" પસંદ કરો.'
          : lang === 'HI'
          ? 'ब्राउज़र मेनू (3 बिंदु ⋮) पर क्लिक करके "Add to Home screen" चुनें।'
          : 'Tap browser menu (3 dots ⋮) and select "Add to Home screen".'
      );
    }
  };

  if (!showBanner) return null;

  const t = {
    GU: {
      title: 'અસ્તરો-સેવા ગુરુજી એપ ઇન્સ્ટોલ કરો',
      subtitle: 'એક જ ટેપમાં ફોનની હોમ સ્ક્રીન પરથી ડાયરેક્ટ ખોલવા માટે ડાઉનલોડ કરો.',
      installBtn: 'મોબાઈલમાં એપ ઇન્સ્ટોલ કરો',
      iosTitle: 'iPhone માં એપ કેવી રીતે ઉમેરવી:',
      iosStep1: '૧. Safari ના નીચેના Share બટન [↑] પર ટૅપ કરો.',
      iosStep2: '૨. "Add to Home Screen" (હોમ સ્ક્રીન પર ઉમેરો) પસંદ કરો.',
      gotIt: 'સમજાઈ ગયું',
    },
    HI: {
      title: 'एस्ट्रो-सेवा गुरुजी ऐप इंस्टॉल करें',
      subtitle: 'एक ही टैप में फोन की होम स्क्रीन से डायरेक्ट खोलने के लिए डाउनलोड करें।',
      installBtn: 'मोबाइल में ऐप इंस्टॉल करें',
      iosTitle: 'iPhone में ऐप कैसे जोड़ें:',
      iosStep1: '1. Safari के निचले Share बटन [↑] पर टैप करें।',
      iosStep2: '2. "Add to Home Screen" चुनें।',
      gotIt: 'समझ गया',
    },
    EN: {
      title: 'Install Astro-Seva Guruji App',
      subtitle: 'Install on your mobile home screen for instant one-tap access.',
      installBtn: 'Install App on Mobile',
      iosTitle: 'How to Install on iPhone:',
      iosStep1: '1. Tap Safari Share button [↑] at the bottom.',
      iosStep2: '2. Scroll down and tap "Add to Home Screen".',
      gotIt: 'Got It',
    },
  }[lang];

  return (
    <div className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:right-6 sm:left-auto z-[9999] max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#7A1C28] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 backdrop-blur-md relative">
        
        <div className="flex items-start gap-3.5">
          {/* Sacred Om App Icon */}
          <div className="w-12 h-12 rounded-2xl bg-amber-100/10 border border-amber-400/40 p-1 shrink-0 flex items-center justify-center shadow-inner">
            <img src="/icon.svg" alt="Astro-Seva" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Mobile Web App</span>
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-amber-50 leading-tight">
              {t.title}
            </h4>
            <p className="text-xs text-amber-100/80 leading-relaxed font-normal">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Single Prominent Full-Width Install Button */}
        <div className="mt-4 pt-1">
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Download className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>{t.installBtn}</span>
          </button>
        </div>

        {/* iOS Step-by-Step Instructions Modal Overlay */}
        {showIOSInstructions && (
          <div className="mt-4 p-3.5 bg-black/40 border border-amber-400/30 rounded-2xl space-y-2 text-left animate-in fade-in">
            <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.iosTitle}</span>
            </h5>
            <p className="text-[11px] text-amber-100 flex items-center gap-2">
              <Share className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t.iosStep1}</span>
            </p>
            <p className="text-[11px] text-amber-100 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t.iosStep2}</span>
            </p>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-2 bg-amber-400 text-stone-950 font-bold py-1.5 rounded-lg text-xs cursor-pointer text-center"
            >
              {t.gotIt}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
