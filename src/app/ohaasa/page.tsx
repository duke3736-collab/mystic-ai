"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdSense from "@/components/AdSense";
import CoupangAd from "@/components/CoupangAd";

interface RankingItem {
  id: string;
  icon: string;
  nameKo: string;
  nameEn: string;
  date: string;
  rank: number;
  luckyColor: string;
  luckyItem: string;
}

export default function OhaasaPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [todayDate, setTodayDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedSign, setSelectedSign] = useState<RankingItem | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch("/api/ohaasa");
        const data = await res.json();
        setRanking(data.ranking);
        setTodayDate(data.date);
      } catch (err) {
        console.error("Failed to load ranking", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const handleSignClick = async (sign: RankingItem) => {
    setSelectedSign(sign);
    setAdvice("");
    setIsAdviceLoading(true);

    try {
      const res = await fetch("/api/ohaasa/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signKo: sign.nameKo,
          rank: sign.rank,
          luckyColor: sign.luckyColor,
          luckyItem: sign.luckyItem,
          date: todayDate,
        }),
      });
      const data = await res.json();
      setAdvice(data.advice);
    } catch (err) {
      console.error("Failed to load advice", err);
      setAdvice("운세를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsAdviceLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedSign(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col items-center p-4 pt-32 pb-48">
      {/* Mystical Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900 via-indigo-950 to-slate-950 -z-10" />
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none -z-10 mix-blend-screen" />
      
      <div className="w-full max-w-2xl mx-auto z-10 flex flex-col h-full">
        <Link href="/" className="flex items-center gap-2 text-fuchsia-300 hover:text-white transition-colors self-start mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>메인으로</span>
        </Link>

        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-200 rounded-full text-xs font-bold mb-3">
            매일 자정 업데이트
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 break-keep text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-200 to-indigo-300">
            오하아사 별자리 랭킹
          </h1>
          <p className="text-indigo-200 font-medium text-sm md:text-base break-keep px-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> {todayDate} 오늘의 행운 순위 <Sparkles className="w-4 h-4" />
          </p>
        </div>

        <div className="mb-8 w-full max-w-lg mx-auto">
          <AdSense />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="text-5xl">
              🔮
            </motion.div>
            <p className="text-fuchsia-200 font-bold animate-pulse">별들의 움직임을 읽는 중...</p>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {ranking.map((sign, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={sign.id}
                onClick={() => handleSignClick(sign)}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] border backdrop-blur-sm ${
                  sign.rank === 1 
                    ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.2)]" 
                    : sign.rank === 2
                    ? "bg-gradient-to-r from-slate-300/20 to-slate-400/20 border-slate-300/50"
                    : sign.rank === 3
                    ? "bg-gradient-to-r from-orange-400/20 to-amber-600/20 border-orange-400/50"
                    : "bg-slate-900/40 border-indigo-500/20 hover:border-fuchsia-400/40 hover:bg-slate-800/60"
                }`}
              >
                {sign.rank === 1 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 blur-3xl rounded-full pointer-events-none"></div>
                )}
                <div className="flex items-center p-4 sm:p-5 gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-xl font-black shadow-inner ${
                    sign.rank === 1 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 shadow-yellow-400/50" :
                    sign.rank === 2 ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 shadow-slate-300/50" :
                    sign.rank === 3 ? "bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950 shadow-orange-400/50" :
                    "bg-indigo-950/50 text-indigo-300 border border-indigo-500/30"
                  }`}>
                    {sign.rank}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{sign.icon}</span>
                      <h2 className="text-lg font-bold text-white truncate">{sign.nameKo}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-medium">
                      <span className="bg-slate-950/50 px-2 py-1 rounded-md text-slate-300 border border-slate-800">
                        색상: <span className="text-white">{sign.luckyColor}</span>
                      </span>
                      <span className="bg-slate-950/50 px-2 py-1 rounded-md text-slate-300 border border-slate-800">
                        아이템: <span className="text-white">{sign.luckyItem}</span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-fuchsia-400/50 group-hover:text-fuchsia-300 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-b from-indigo-950 to-slate-950 rounded-3xl p-6 border border-fuchsia-500/30 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    {selectedSign.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedSign.nameKo}</h3>
                    <p className="text-fuchsia-300 font-bold text-sm">오늘의 순위: {selectedSign.rank}위</p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-white p-2">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-400 mb-1">행운의 색상</div>
                  <div className="font-bold text-white">{selectedSign.luckyColor}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-400 mb-1">행운의 아이템</div>
                  <div className="font-bold text-white">{selectedSign.luckyItem}</div>
                </div>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-5 min-h-[120px] relative z-10">
                {isAdviceLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="text-fuchsia-400">
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <p className="text-sm text-indigo-300 font-medium">AI 별의 정령이 조언을 속삭이는 중...</p>
                  </div>
                ) : (
                  <p className="text-indigo-100 leading-relaxed font-medium text-sm md:text-base whitespace-pre-wrap">
                    {advice}
                  </p>
                )}
              </div>

              {/* Coupang Ad */}
              <div className="mt-4">
                <CoupangAd type="daily" compact={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
