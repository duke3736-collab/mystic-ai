"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Stars, Lock, Unlock, PlaySquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TarotPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [spreadType, setSpreadType] = useState<'3-card' | 'celtic' | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // We display 22 cards (Major Arcana size) to choose from
  const totalCards = Array.from({ length: 22 }, (_, i) => i);
  const maxCards = spreadType === 'celtic' ? 10 : 3;

  const toggleCard = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((c) => c !== index));
    } else if (selectedCards.length < maxCards) {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      router.push(`/tarot/result?type=${spreadType}&cards=${selectedCards.join(",")}`);
    }, 1500);
  };

  const handleSelectCeltic = () => {
    if (isPremiumUnlocked) {
      setSpreadType('celtic');
    } else {
      setShowPremiumModal(true);
    }
  };

  const handleUnlockPremium = () => {
    // In real app: trigger AdMob or IAP
    setIsPremiumUnlocked(true);
    setShowPremiumModal(false);
    setSpreadType('celtic');
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center p-4 pt-20">
      {/* Mystical Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-4xl mx-auto z-10 flex flex-col h-full">
        <Link href="/" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors self-start mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{t("tarot.back")}</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-3 break-keep" style={{background: 'linear-gradient(135deg, #c7d2fe, #e9d5ff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            {t("tarot.title")}
          </h1>
          <p className="text-indigo-100 font-light text-base break-keep px-4">
            {t("tarot.subtitle")}
          </p>
          <div className="mt-4 inline-block px-4 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-200 font-medium tracking-widest">
            {spreadType ? `${selectedCards.length} / ${maxCards} ${t("tarot.selected")}` : (language === "ko" ? "스프레드를 선택해주세요" : "Please select a spread")}
          </div>
        </div>

        {!spreadType ? (
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10 w-full max-w-2xl mx-auto">
            {/* 3-Card Spread */}
            <button 
              onClick={() => setSpreadType('3-card')}
              className="w-full flex-1 group bg-slate-900/60 backdrop-blur-md border-2 border-indigo-500/30 hover:border-indigo-400 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] text-left"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 mb-6 group-hover:scale-110 transition-transform">
                <Stars className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{language === "ko" ? "과거·현재·미래 (3장)" : "Past, Present, Future (3 Cards)"}</h3>
              <p className="text-indigo-200/70 text-sm mb-6">{language === "ko" ? "문제의 흐름과 가까운 미래를 빠르게 진단하는 기본 스프레드" : "A basic spread that quickly diagnoses the problem and near future"}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold text-sm">
                {language === "ko" ? "무료 이용" : "Free"}
              </div>
            </button>

            {/* Celtic Cross Spread */}
            <button 
              onClick={handleSelectCeltic}
              className="w-full flex-1 group relative bg-gradient-to-b from-indigo-900/60 to-purple-900/60 backdrop-blur-md border-2 border-yellow-500/30 hover:border-yellow-400 rounded-3xl p-8 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{language === "ko" ? "켈틱 크로스 (10장)" : "Celtic Cross (10 Cards)"}</h3>
                <p className="text-yellow-100/70 text-sm mb-6">{language === "ko" ? "문제의 본질, 장애물, 잠재적 결과까지 심층적으로 분석하는 최고급 스프레드" : "Premium spread analyzing root causes, obstacles, and outcomes in depth"}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg font-bold text-sm">
                  {isPremiumUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {language === "ko" ? "프리미엄 전용" : "Premium Only"}
                </div>
              </div>
            </button>
          </div>
        ) : (
          <>
            {/* Card Spread */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4 pb-32">
          {totalCards.map((cardIndex) => {
            const isSelected = selectedCards.includes(cardIndex);
            const selectionOrder = selectedCards.indexOf(cardIndex);
            
            return (
              <motion.div
                key={cardIndex}
                whileHover={{ y: isSelected ? -10 : -10 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateY: isSelected ? 180 : 0,
                  y: isSelected ? -10 : 0,
                }}
                onClick={() => toggleCard(cardIndex)}
                className={`relative w-20 h-32 sm:w-28 sm:h-44 md:w-32 md:h-48 cursor-pointer preserve-3d transition-shadow duration-500 ${
                  isSelected ? "z-20 shadow-[0_0_30px_rgba(99,102,241,0.6)]" : "shadow-lg hover:shadow-indigo-500/30"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Card Back */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image 
                    src="/images/tarot/back.png" 
                    alt="Tarot Card Back" 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                  <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-xl" />
                </div>

                {/* Card Front (Selected) */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl bg-slate-900"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {isSelected && (
                    <>
                      <Image 
                        src={`/images/tarot/front_${selectionOrder + 1}.png`} 
                        alt="Tarot Card Front" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100px, 150px"
                      />
                      <div className="absolute inset-0 border-2 border-yellow-500/40 rounded-xl" />
                      {/* Label Overlay */}
                      <div className="absolute bottom-2 left-0 right-0 text-center z-10">
                        <div className="inline-block px-3 py-1 bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded-full text-yellow-200 font-bold text-xs sm:text-sm tracking-widest shadow-lg">
                          {spreadType === '3-card' ? (
                            <>
                              {selectionOrder === 0 && t("tarot.past")}
                              {selectionOrder === 1 && t("tarot.present")}
                              {selectionOrder === 2 && t("tarot.future")}
                            </>
                          ) : (
                            language === "ko" ? `카드 ${selectionOrder + 1}` : `Card ${selectionOrder + 1}`
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
            </div>

            {/* Analyze Button */}
            {selectedCards.length === maxCards && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none"
              >
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="pointer-events-auto group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(99,102,241,0.8)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,1)] transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                >
              <span className="flex items-center gap-2">
                {isAnalyzing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                )}
                {isAnalyzing ? t("tarot.analyzing") : t("tarot.analyze")}
              </span>
              <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Premium Unlock Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(234,179,8,0.15)] relative">
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-400 mb-6 mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-center text-white mb-3">{language === "ko" ? "프리미엄 스프레드" : "Premium Spread"}</h3>
            <p className="text-slate-300 text-center text-sm mb-8 leading-relaxed">
              {language === "ko" ? "켈틱 크로스(10장) 스프레드는 심층 분석을 제공하는 프리미엄 기능입니다. 광고를 시청하고 무료로 잠금 해제하시겠습니까?" : "The Celtic Cross (10 Cards) spread is a premium feature providing in-depth analysis. Watch a short ad to unlock it for free?"}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleUnlockPremium}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02]"
              >
                <PlaySquare className="w-5 h-5" />
                {language === "ko" ? "광고 보고 무료로 열기" : "Watch Ad to Unlock"}
              </button>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
              >
                {language === "ko" ? "다음에 하기" : "Maybe Later"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
