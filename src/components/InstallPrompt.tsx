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
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.3)] max-w-sm ml-auto group">
        {/* Animated background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors duration-500"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
        
        <div className="relative flex items-start gap-4 z-10">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-xl flex items-center justify-center text-3xl border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse">
            ✨
          </div>
          <div className="flex-1">
            <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300 font-bold mb-1 text-base tracking-tight">
              {language === 'ko' ? '스마트폰 앱으로 더 편하게!' : 'Install Mystic AI'}
            </h4>
            <p className="text-purple-100/80 text-xs mb-4 leading-relaxed font-light">
              {language === 'ko' ? '홈 화면에 앱을 추가하고 언제든 마법처럼 운명을 확인하세요.' : 'Add to home screen for quick access to your destiny anytime.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:-translate-y-0.5"
              >
                {language === 'ko' ? '앱 설치하기' : 'Install App'}
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs font-medium rounded-xl transition-all hover:text-white"
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
