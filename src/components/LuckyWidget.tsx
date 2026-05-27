"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Hash, Palette } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = [
  { nameKo: "레드", nameEn: "Red", bg: "bg-red-500", text: "text-red-500", border: "border-red-500" },
  { nameKo: "오렌지", nameEn: "Orange", bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500" },
  { nameKo: "옐로우", nameEn: "Yellow", bg: "bg-yellow-400", text: "text-yellow-400", border: "border-yellow-400" },
  { nameKo: "그린", nameEn: "Green", bg: "bg-green-500", text: "text-green-500", border: "border-green-500" },
  { nameKo: "블루", nameEn: "Blue", bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
  { nameKo: "퍼플", nameEn: "Purple", bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500" },
  { nameKo: "핑크", nameEn: "Pink", bg: "bg-pink-500", text: "text-pink-500", border: "border-pink-500" },
  { nameKo: "화이트", nameEn: "White", bg: "bg-white", text: "text-white", border: "border-white" },
  { nameKo: "블랙", nameEn: "Black", bg: "bg-black", text: "text-slate-900", border: "border-slate-700" }
];

export default function LuckyWidget({ seed }: { seed: string }) {
  const { language } = useLanguage();
  
  // Create a deterministic hash from seed and today's date
  const today = new Date().toISOString().split('T')[0];
  const combinedStr = `${seed}-${today}`;
  
  let hash = 0;
  for (let i = 0; i < combinedStr.length; i++) {
    hash = ((hash << 5) - hash) + combinedStr.charCodeAt(i);
    hash |= 0; 
  }
  
  const absHash = Math.abs(hash);
  const colorIndex = absHash % COLORS.length;
  const luckyNumber = (absHash % 99) + 1; // 1 to 99
  
  const luckyColor = COLORS[colorIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-slate-900/40 border border-slate-700 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-around gap-4 shadow-xl relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 blur-2xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-2 sm:mb-0 w-full sm:w-auto justify-center border-b sm:border-b-0 sm:border-r border-slate-700/50 pb-3 sm:pb-0 sm:pr-6">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <span className="font-bold text-slate-200">
          {language === "ko" ? "오늘의 행운" : "Today's Luck"}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Color */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
            <Palette className="w-3 h-3" />
            {language === "ko" ? "행운의 색상" : "Lucky Color"}
          </div>
          <div className={`w-8 h-8 rounded-full ${luckyColor.bg} ${luckyColor.nameEn === 'Black' ? 'border border-slate-700' : 'shadow-lg'} group-hover:scale-110 transition-transform`} />
          <span className={`text-sm font-bold ${luckyColor.nameEn === 'Black' ? 'text-slate-300' : luckyColor.text}`}>
            {language === "ko" ? luckyColor.nameKo : luckyColor.nameEn}
          </span>
        </div>

        <div className="w-px h-12 bg-slate-700/50 mx-2" />

        {/* Number */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
            <Hash className="w-3 h-3" />
            {language === "ko" ? "행운의 숫자" : "Lucky Number"}
          </div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 group-hover:scale-110 transition-transform drop-shadow-md">
            {luckyNumber}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
