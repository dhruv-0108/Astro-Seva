'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, Plus, Smartphone } from 'lucide-react';

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
      return; // Hide inside installed app
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

    // 4. Continuously active for 48 hours starting today (Aug 9 - Aug 11) on all browsers if not installed
    const activeUntil = new Date('2026-08-11T23:59:59+05:30').getTime();
    if (Date.now() <= activeUntil) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error(err);
        setShowIOSInstructions(true);
      }
    } else {
      setShowIOSInstructions((prev) => !prev);
    }
  };

  if (!showBanner) return null;

  const t = {
    GU: {
      title: 'અસ્તરો-સેવા મોબાઇલ એપ',
      subtitle: 'ફોનની હોમ સ્ક્રીન પરથી સિંગલ ટેપમાં ડાયરેક્ટ ખોલો',
      installBtn: 'હમણાં ઇન્સ્ટોલ કરો',
      iosTitle: 'ઇન્સ્ટોલ કરવા માટે સરળ 2 સ્ટેપ:',
      iosStep1: '૧. બ્રાઉઝરના Share [↑] અથવા મેનૂ (3 બિંદુઓ ⋮) પર ટૅપ કરો.',
      iosStep2: '૨. "Add to Home Screen" (હોમ સ્ક્રીન પર ઉમેરો) પસંદ કરો.',
      gotIt: 'બરાબર છે',
    },
    HI: {
      title: 'एस्ट्रो-सेवा मोबाइल ऐप',
      subtitle: 'फोन की होम स्क्रीन से सिंगल टैप में डायरेक्ट खोलें',
      installBtn: 'अभी इंस्टॉल करें',
      iosTitle: 'इंस्टॉल करने के लिए सरल 2 स्टेप:',
      iosStep1: '1. ब्राउज़र के Share [↑] या मेनू (3 बिंदु ⋮) पर टैप करें।',
      iosStep2: '2. "Add to Home Screen" चुनें।',
      gotIt: 'ठीक है',
    },
    EN: {
      title: 'Astro-Seva Mobile App',
      subtitle: 'Open directly from home screen with one tap',
      installBtn: 'INSTALL NOW',
      iosTitle: 'Simple 2 Steps to Add:',
      iosStep1: '1. Tap Share [↑] or Menu (3 dots ⋮).',
      iosStep2: '2. Tap "Add to Home Screen".',
      gotIt: 'Got It',
    },
  }[lang];

  return (
    <div className="fixed bottom-4 inset-x-3 sm:bottom-6 sm:right-6 sm:left-auto z-[99999] max-w-md w-full animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="bg-[#7A1C28] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-amber-400/40 backdrop-blur-md text-left">
        
        {/* Simple Top Row with App Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100/10 border border-amber-300/40 p-1 shrink-0 flex items-center justify-center shadow-md">
            <img src="/icon.svg" alt="Astro-Seva" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-amber-100 leading-snug truncate">
              {t.title}
            </h4>
            <p className="text-xs text-amber-200/80 leading-tight font-normal">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Big Simple Prominent INSTALL NOW Button */}
        <div className="mt-4">
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black py-3.5 px-4 rounded-2xl text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98 tracking-wide uppercase"
          >
            <Download className="w-5 h-5 stroke-[3]" />
            <span>{t.installBtn}</span>
          </button>
        </div>

        {/* Simple iOS Instructions Popup */}
        {showIOSInstructions && (
          <div className="mt-3.5 p-3.5 bg-black/50 border border-amber-400/40 rounded-2xl space-y-2 text-left animate-in fade-in">
            <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>{t.iosTitle}</span>
            </h5>
            <p className="text-xs text-amber-100 flex items-center gap-2">
              <Share className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.iosStep1}</span>
            </p>
            <p className="text-xs text-amber-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.iosStep2}</span>
            </p>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-2 bg-amber-400 text-stone-950 font-bold py-2 rounded-xl text-xs cursor-pointer text-center"
            >
              {t.gotIt}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
