"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CoupangAd from "@/components/CoupangAd";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface AnalyzingOverlayProps {
  type: "tarot" | "saju" | "daily";
  onComplete: () => void;
  duration?: number;
}

export default function AnalyzingOverlay({ type, onComplete, duration = 4000 }: AnalyzingOverlayProps) {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 4초 동안 프로그레스 바가 차오름
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10" />
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center z-10">
        {/* Magical Icon */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ rotate: { repeat: Infinity, duration: 3, ease: "linear" }, scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
          className="w-24 h-24 mb-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
        >
          <Sparkles className="w-10 h-10 text-indigo-300" />
        </motion.div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-2 text-center drop-shadow-md">
          {language === "ko" ? "운명을 분석하고 있습니다" : "Analyzing your destiny"}
        </h2>
        <p className="text-indigo-200/70 text-sm mb-10 text-center px-4 leading-relaxed">
          {language === "ko" 
            ? "우주의 기운을 모아 당신만의 특별한 해석을 생성 중입니다. 잠시만 기다려주세요." 
            : "Gathering cosmic energy to generate your personalized interpretation. Please wait."}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-12 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Sponsored Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full"
        >
          <CoupangAd type={type} compact={true} />
        </motion.div>
      </div>
    </motion.div>
  );
}
