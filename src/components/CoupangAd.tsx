"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CoupangAdProps {
  type: "tarot" | "saju" | "daily";
}

export default function CoupangAd({ type }: CoupangAdProps) {
  const { language } = useLanguage();

  const coupangLinks = {
    tarot: "https://link.coupang.com/a/d6qUzhMlMa",
    saju: "https://link.coupang.com/a/d6q3wOjViC",
    daily: "https://link.coupang.com/a/d6q9DStJWm",
  };

  const COUPANG_LINK = coupangLinks[type] || "https://coupa.ng/placeholder";

  const adContent = {
    tarot: {
      ko: {
        title: "타로의 영감을 깨우는 신비로운 에너지 🌙",
        desc: "나만의 타로카드와 마음을 정화하는 인센스 스틱 구경하기",
        button: "행운의 타로 용품 보기"
      },
      en: {
        title: "Mystical Energy to Awaken Tarot Inspiration 🌙",
        desc: "Discover your own tarot cards and mind-cleansing incense sticks",
        button: "View Lucky Tarot Items"
      }
    },
    saju: {
      ko: {
        title: "내 사주에 부족한 기운을 채워줄 '행운의 아이템' ✨",
        desc: "재물운과 성공운을 끌어올리는 풍수지리 인테리어 소품 보기",
        button: "재물운 인테리어 소품 보기"
      },
      en: {
        title: "Lucky Items to Fill the Missing Energy in Your Destiny ✨",
        desc: "View Feng Shui interior accessories that boost wealth and success",
        button: "View Wealth Accessories"
      }
    },
    daily: {
      ko: {
        title: "오늘 나의 운세를 상승시켜줄 '행운의 소품' 🍀",
        desc: "기분 좋은 하루를 위한 나만의 작은 선물 구경하기",
        button: "오늘의 행운 아이템 보기"
      },
      en: {
        title: "Lucky Accessories to Boost Your Horoscope Today 🍀",
        desc: "Discover a small gift for yourself for a pleasant day",
        button: "View Today's Lucky Items"
      }
    }
  };

  const content = adContent[type][language as "ko" | "en"] || adContent[type]["ko"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full mt-10 mb-6"
    >
      <Link href={COUPANG_LINK} target="_blank" rel="noopener noreferrer" className="block w-full">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 group">
          
          {/* Background Glow */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all" />

          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 z-10">
            
            {/* Icon & Text */}
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex flex-shrink-0 w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-indigo-400 mb-1 tracking-wider uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Mystic Recommendation</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white break-keep leading-tight group-hover:text-indigo-200 transition-colors">
                  {content.title}
                </h4>
                <p className="text-sm text-slate-400 break-keep mt-1">
                  {content.desc}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto flex-shrink-0">
              <div className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md group-hover:shadow-indigo-500/30">
                <span>{content.button}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
          </div>
          
          {/* Ad Label */}
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-800/80 border border-slate-700 rounded text-[10px] text-slate-400">
            AD
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
