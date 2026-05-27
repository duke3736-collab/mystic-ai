"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Moon, Sun, User, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SajuPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "female",
    year: "1980",
    month: "01",
    day: "01",
    time: "unknown",
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from(
    { length: getDaysInMonth(parseInt(formData.year), parseInt(formData.month)) },
    (_, i) => i + 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsAnalyzing(true);
    // Simulate loading and redirect with query params
    setTimeout(() => {
      const query = new URLSearchParams(formData).toString();
      router.push(`/saju/result?${query}`);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center p-4 pt-20 pb-32">
      {/* Mystical Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 -z-10" />
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-2xl mx-auto z-10 flex flex-col h-full">
        <Link href="/" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors self-start mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{t("tarot.back")}</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 break-keep" style={{background: 'linear-gradient(135deg, #6ee7b7, #99f6e4, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            {t("saju.title")}
          </h1>
          <p className="text-emerald-100 font-light text-base break-keep px-4">
            {t("saju.subtitle")}
          </p>
        </div>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative"
        >
          {/* Decorative Yin Yang subtle background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-64 h-64 fill-current text-emerald-100">
              <path d="M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 M50,0 A25,25 0 0,0 50,50 A25,25 0 0,1 50,100 A50,50 0 0,0 50,0" />
              <circle cx="50" cy="25" r="8" fill="black" />
              <circle cx="50" cy="75" r="8" fill="white" />
            </svg>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                <User className="w-4 h-4" />
                {t("saju.name")}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder-slate-600"
                placeholder="John Doe"
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                <Moon className="w-4 h-4" />
                {t("saju.gender")}
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "female" })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    formData.gender === "female"
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                      : "bg-slate-950/50 border-emerald-500/30 text-slate-400 hover:border-emerald-500/50"
                  }`}
                >
                  {t("saju.female")} (Yin)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: "male" })}
                  className={`flex-1 py-3 rounded-xl border transition-all ${
                    formData.gender === "male"
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                      : "bg-slate-950/50 border-emerald-500/30 text-slate-400 hover:border-emerald-500/50"
                  }`}
                >
                  {t("saju.male")} (Yang)
                </button>
              </div>
            </div>

            {/* Date of Birth Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                {t("saju.dob")}
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-1/3 bg-slate-950/50 border border-emerald-500/30 rounded-xl px-2 md:px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}{language === "ko" ? "년" : ""}</option>
                  ))}
                </select>
                <select
                  value={formData.month}
                  onChange={(e) => {
                    const newMonth = e.target.value;
                    const maxDays = getDaysInMonth(parseInt(formData.year), parseInt(newMonth));
                    let newDay = parseInt(formData.day);
                    if (newDay > maxDays) newDay = maxDays;
                    setFormData({ ...formData, month: newMonth, day: newDay.toString().padStart(2, '0') });
                  }}
                  className="w-1/3 bg-slate-950/50 border border-emerald-500/30 rounded-xl px-2 md:px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
                >
                  {months.map((m) => {
                    const val = m.toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}{language === "ko" ? "월" : ""}</option>;
                  })}
                </select>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-1/3 bg-slate-950/50 border border-emerald-500/30 rounded-xl px-2 md:px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
                >
                  {days.map((d) => {
                    const val = d.toString().padStart(2, '0');
                    return <option key={val} value={val}>{val}{language === "ko" ? "일" : ""}</option>;
                  })}
                </select>
              </div>
            </div>

            {/* Time of Birth Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                <Clock className="w-4 h-4" />
                {t("saju.time")}
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-950/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
              >
                <option value="unknown">{t("saju.unknown")}</option>
                <option value="00:00-01:00">23:00 - 01:00 (자시/Rat)</option>
                <option value="01:00-03:00">01:00 - 03:00 (축시/Ox)</option>
                <option value="03:00-05:00">03:00 - 05:00 (인시/Tiger)</option>
                <option value="05:00-07:00">05:00 - 07:00 (묘시/Rabbit)</option>
                <option value="07:00-09:00">07:00 - 09:00 (진시/Dragon)</option>
                <option value="09:00-11:00">09:00 - 11:00 (사시/Snake)</option>
                <option value="11:00-13:00">11:00 - 13:00 (오시/Horse)</option>
                <option value="13:00-15:00">13:00 - 15:00 (미시/Goat)</option>
                <option value="15:00-17:00">15:00 - 17:00 (신시/Monkey)</option>
                <option value="17:00-19:00">17:00 - 19:00 (유시/Rooster)</option>
                <option value="19:00-21:00">19:00 - 21:00 (술시/Dog)</option>
                <option value="21:00-23:00">21:00 - 23:00 (해시/Pig)</option>
              </select>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isAnalyzing || !formData.name}
                className="w-full relative group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                )}
                {isAnalyzing ? t("saju.analyzing") : t("saju.analyze")}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
