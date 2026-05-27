"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InstallPrompt() {
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt if we haven't shown it recently
      const lastPrompt = localStorage.getItem('lastInstallPrompt');
      if (!lastPrompt || Date.now() - parseInt(lastPrompt) > 1000 * 60 * 60 * 24 * 7) {
        setIsInstallPromptVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallPromptVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsInstallPromptVisible(false);
    localStorage.setItem('lastInstallPrompt', Date.now().toString());
  };

  if (!isInstallPromptVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 z-50 animate-fade-in-up">
      <div className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 shadow-2xl max-w-sm ml-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl border border-indigo-500/40">
            📱
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1 text-sm">
              {language === 'ko' ? '스마트폰 앱으로 더 편하게!' : 'Install our app!'}
            </h4>
            <p className="text-indigo-200/80 text-xs mb-3 leading-relaxed">
              {language === 'ko' ? '홈 화면에 앱을 추가하고 언제든 운명을 확인하세요.' : 'Add to home screen for quick access to your destiny.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {language === 'ko' ? '설치하기' : 'Install'}
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
              >
                {language === 'ko' ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
