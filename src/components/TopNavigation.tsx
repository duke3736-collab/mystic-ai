"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function TopNavigation() {
  const { language, setLanguage } = useLanguage();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/bgm.wav?v=2");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    
    if (isMusicPlaying) {
      audioRef.current.play().catch(() => {
        setIsMusicPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
      <button
        onClick={toggleMusic}
        className="p-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 text-indigo-300 hover:text-white transition-colors"
        aria-label="Toggle Music"
      >
        {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 opacity-50" />}
      </button>

      <div className="flex gap-2 bg-slate-900/50 backdrop-blur-md p-1 rounded-full border border-slate-700/50">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            language === "en" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("ko")}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            language === "ko" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          KR
        </button>
      </div>
    </div>
  );
}
