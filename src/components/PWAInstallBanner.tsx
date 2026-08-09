'use client';

import React, { useEffect, useState } from 'react';
import { Download, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface PWAInstallBannerProps {
  lang?: 'EN' | 'GU' | 'HI';
}

export default function PWAInstallBanner({ lang = 'GU' }: PWAInstallBannerProps) {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isInstalledSuccess, setIsInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // 0. Register Service Worker required for Chrome PWA Installation Engine
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.error('SW registration failed:', err));
    }

    // 1. Check if already running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return; // Hide inside installed app
    }

    // 2. Listen for appinstalled browser event
    const handleAppInstalled = () => {
      setIsInstalledSuccess(true);
      setIsInstalling(false);
      setTimeout(() => setShowBanner(false), 3000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 3. Capture beforeinstallprompt for Android Chrome & auto-trigger native prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
      setShowBanner(true);

      // Auto-trigger browser native installation dialog on page load after 600ms
      setTimeout(() => {
        try {
          (e as any).prompt();
        } catch (err) {
          console.error('Auto prompt error:', err);
        }
      }, 600);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Continuously active for 20 days starting today (Aug 9 - Aug 29) on all browsers if not installed
    const activeUntil = new Date('2026-08-29T23:59:59+05:30').getTime();
    if (Date.now() <= activeUntil) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptObj = deferredPrompt || (window as any).deferredPrompt;
    if (promptObj) {
      try {
        setIsInstalling(true);
        await promptObj.prompt();
        const choice = await promptObj.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalledSuccess(true);
          setIsInstalling(false);
          setTimeout(() => setShowBanner(false), 3000);
        } else {
          setIsInstalling(false);
        }
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
      } catch (err) {
        console.error(err);
        setIsInstalling(false);
      }
    } else {
      // Direct visual feedback if prompt is already executing in background
      setIsInstalling(true);
      setTimeout(() => {
        setIsInstalling(false);
      }, 3000);
    }
  };

  if (!showBanner) return null;

  const t = {
    GU: {
      title: 'અસ્તરો-સેવા મોબાઇલ એપ',
      subtitle: 'ફોનની હોમ સ્ક્રીન પરથી ડાયરેક્ટ ખોલવા માટે ડાઉનલોડ કરો',
      installBtn: 'હમણાં ઇન્સ્ટોલ કરો',
      installing: 'એપ ઇન્સ્ટોલ થઈ રહી છે...',
      installed: '✓ એપ ઇન્સ્ટોલ થઈ ગઈ! હોમ સ્ક્રીન પર આયકન ઉમેરાઈ ગયું છે.',
    },
    HI: {
      title: 'एस्ट्रो-सेवा मोबाइल ऐप',
      subtitle: 'फोन की होम स्क्रीन से डायरेक्ट खोलने के लिए डाउनलोड करें',
      installBtn: 'अभी इंस्टॉल करें',
      installing: 'ऐप इंस्टॉल हो रहा है...',
      installed: '✓ ऐप इंस्टॉल हो गया! होम स्क्रीन पर आइकॉन जुड़ गया है।',
    },
    EN: {
      title: 'Astro-Seva Mobile App',
      subtitle: 'Download to open directly from mobile home screen',
      installBtn: 'INSTALL NOW',
      installing: 'Installing Astro-Seva App...',
      installed: '✓ App Installed Successfully! Check your phone home screen.',
    },
  }[lang];

  return (
    <div className="fixed bottom-4 inset-x-3 sm:bottom-6 sm:right-6 sm:left-auto z-[99999] max-w-md w-full animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="bg-[#7A1C28] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-amber-400/40 backdrop-blur-md text-left">
        
        {/* Top Row with Sacred Om Icon & App Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100/10 border border-amber-300/40 p-1 shrink-0 flex items-center justify-center shadow-md">
            <img src="/icon.svg" alt="Astro-Seva" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Official Guruji App</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-amber-100 leading-snug truncate">
              {t.title}
            </h4>
            <p className="text-xs text-amber-200/80 leading-tight font-normal">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Action Area: Installing Spinner / Success Badge / Big Install Button */}
        <div className="mt-4">
          {isInstalledSuccess ? (
            <div className="w-full bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>{t.installed}</span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black py-3.5 px-4 rounded-2xl text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98 tracking-wide uppercase disabled:opacity-90"
            >
              {isInstalling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                  <span>{t.installing}</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 stroke-[3]" />
                  <span>{t.installBtn}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
