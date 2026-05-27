"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Stars } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FamilySites from "@/components/FamilySites";
import AdSense from "@/components/AdSense";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col items-center w-full">
      {/* Mystical Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10" />



      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full min-h-[85dvh] flex flex-col items-center justify-center max-w-2xl mx-auto text-center z-10 space-y-6 px-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-2"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Image src="/mascot.png" alt="Mystic AI Mascot" fill className="object-cover" />
          </div>
        </motion.div>

        <div className="space-y-4 px-4 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_2px_24px_rgba(165,180,252,0.8)] tracking-tight break-keep text-balance w-full" style={{background: 'linear-gradient(135deg, #c7d2fe, #e9d5ff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none'}}>
            {t("home.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-indigo-100 font-light max-w-lg mx-auto leading-relaxed break-keep text-balance drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            {t("home.subtitle")}
          </p>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/daily" className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Sparkles className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
              {t("nav.daily")}
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
          </Link>
          
          <Link href="/tarot" className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Stars className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
              {t("nav.tarot")}
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
          </Link>

          <Link href="/ohaasa" className="group relative px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(217,70,239,0.5)] hover:shadow-[0_0_60px_-15px_rgba(217,70,239,0.7)] transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Sparkles className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
              오하아사 운세
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
          </Link>

          <Link href="/saju" className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Sparkles className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
              {t("nav.saju")}
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
          </Link>
        </div>
      </motion.div>

      {/* Family Services Cross-Linking */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full z-10 pb-12"
      >
        <FamilySites />
        <div className="py-8 w-full max-w-4xl mx-auto">
          <AdSense />
        </div>
      </motion.div>
    </div>
  );
}
