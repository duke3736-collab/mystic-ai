"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Stars } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TarotPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 10 cards to choose from
  const totalCards = Array.from({ length: 10 }, (_, i) => i);

  const toggleCard = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((c) => c !== index));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate short loading before redirecting
    setTimeout(() => {
      router.push(`/tarot/result?cards=${selectedCards.join(",")}`);
    }, 1500);
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
            {selectedCards.length} / 3 {t("tarot.selected")}
          </div>
        </div>

        {/* Card Spread */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
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
                          {selectionOrder === 0 && t("tarot.past")}
                          {selectionOrder === 1 && t("tarot.present")}
                          {selectionOrder === 2 && t("tarot.future")}
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
        {selectedCards.length === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex justify-center pb-20"
          >
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-bold text-white text-lg shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
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
      </div>
    </div>
  );
}
