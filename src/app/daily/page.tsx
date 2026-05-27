"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ZODIAC_SIGNS = [
  { id: "aries", icon: "♈", nameKo: "양자리", nameEn: "Aries", date: "03.21 - 04.19" },
  { id: "taurus", icon: "♉", nameKo: "황소자리", nameEn: "Taurus", date: "04.20 - 05.20" },
  { id: "gemini", icon: "♊", nameKo: "쌍둥이자리", nameEn: "Gemini", date: "05.21 - 06.20" },
  { id: "cancer", icon: "♋", nameKo: "게자리", nameEn: "Cancer", date: "06.21 - 07.22" },
  { id: "leo", icon: "♌", nameKo: "사자자리", nameEn: "Leo", date: "07.23 - 08.22" },
  { id: "virgo", icon: "♍", nameKo: "처녀자리", nameEn: "Virgo", date: "08.23 - 09.22" },
  { id: "libra", icon: "♎", nameKo: "천칭자리", nameEn: "Libra", date: "09.23 - 10.22" },
  { id: "scorpio", icon: "♏", nameKo: "전갈자리", nameEn: "Scorpio", date: "10.23 - 11.21" },
  { id: "sagittarius", icon: "♐", nameKo: "사수자리", nameEn: "Sagittarius", date: "11.22 - 12.21" },
  { id: "capricorn", icon: "♑", nameKo: "염소자리", nameEn: "Capricorn", date: "12.22 - 01.19" },
  { id: "aquarius", icon: "♒", nameKo: "물병자리", nameEn: "Aquarius", date: "01.20 - 02.18" },
  { id: "pisces", icon: "♓", nameKo: "물고기자리", nameEn: "Pisces", date: "02.19 - 03.20" },
];

export default function DailyPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = () => {
    if (!selectedSign) return;

    setIsAnalyzing(true);
    // Simulate loading and redirect with query params
    setTimeout(() => {
      router.push(`/daily/result?sign=${selectedSign}`);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center p-4 pt-20 pb-32">
      {/* Mystical Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-indigo-950 -z-10" />
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none -z-10 mix-blend-screen" />
      
      <div className="w-full max-w-4xl mx-auto z-10 flex flex-col h-full">
        <Link href="/" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors self-start mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{t("tarot.back")}</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 break-keep" style={{background: 'linear-gradient(135deg, #bfdbfe, #c7d2fe, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            {t("daily.title")}
          </h1>
          <p className="text-blue-100 font-light text-base break-keep px-4">
            {t("daily.subtitle")}
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          <h2 className="text-center text-xl text-indigo-100 font-medium mb-8">
            {t("daily.select")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
            {ZODIAC_SIGNS.map((sign) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={sign.id}
                onClick={() => setSelectedSign(sign.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  selectedSign === sign.id
                    ? "bg-indigo-600/30 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    : "bg-slate-950/50 border-blue-900/30 hover:border-indigo-500/50 hover:bg-slate-800/50"
                }`}
              >
                <span className="text-4xl mb-2 text-indigo-200">{sign.icon}</span>
                <span className="text-indigo-100 font-medium text-sm md:text-base">
                  {language === "ko" ? sign.nameKo : sign.nameEn}
                </span>
                <span className="text-slate-400 text-xs mt-1 tracking-tight">
                  {sign.date}
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedSign && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-0 left-0 w-full p-4 md:p-8 z-50 pointer-events-none flex justify-center"
              >
                <div className="w-full max-w-4xl pointer-events-auto bg-slate-900/80 backdrop-blur-xl p-4 md:p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                  <button
                    onClick={handleSubmit}
                    disabled={isAnalyzing}
                    className="w-full relative group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold text-white text-lg md:text-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Sun className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    )}
                    {isAnalyzing ? t("daily.analyzing") : t("daily.analyze")}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
