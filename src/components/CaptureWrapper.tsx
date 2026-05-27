"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface CaptureWrapperProps {
  children: React.ReactNode;
  filename?: string;
}

export default function CaptureWrapper({ children, filename = "mystic-result" }: CaptureWrapperProps) {
  const { language } = useLanguage();
  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);

  const handleCapture = async () => {
    if (!captureRef.current) return;
    try {
      setIsCapturing(true);
      
      // 약간의 지연을 주어 화면 렌더링이 안정화되도록 함
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(captureRef.current, { 
        cacheBust: true,
        backgroundColor: '#020617', // 배경을 어두운 테마 기본색으로 지정
        style: {
           transform: 'scale(1)',
           transformOrigin: 'top left',
        }
      });
      
      const link = document.createElement("a");
      link.download = `${filename}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      setIsCaptured(true);
      setTimeout(() => setIsCaptured(false), 3000);
    } catch (err) {
      console.error("Failed to capture image", err);
      alert(language === "ko" ? "이미지 저장에 실패했습니다. 다시 시도해주세요." : "Failed to save image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div ref={captureRef} className="w-full relative pb-4">
        {/* 워터마크 추가 (캡처 영역 안에 포함됨) */}
        {children}
        <div className="w-full text-center mt-6 mb-2 opacity-50">
          <p className="text-xs text-slate-400 font-bold tracking-widest">MYSTIC AI</p>
          <p className="text-[10px] text-slate-500">https://mystic-ai.vercel.app</p>
        </div>
      </div>
      
      <div className="mt-4 mb-8 flex justify-center w-full">
        <button
          onClick={handleCapture}
          disabled={isCapturing || isCaptured}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${
            isCaptured 
              ? "bg-emerald-600 text-white" 
              : "bg-slate-800 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50 hover:text-white"
          }`}
        >
          {isCapturing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Download className="w-5 h-5 opacity-50" />
            </motion.div>
          ) : isCaptured ? (
            <Check className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          
          {isCapturing 
            ? (language === "ko" ? "고화질 렌더링 중..." : "Rendering...") 
            : isCaptured 
              ? (language === "ko" ? "저장 완료!" : "Saved!")
              : (language === "ko" ? "📸 결과를 이미지로 소장하기" : "Save Result as Image")}
        </button>
      </div>
    </div>
  );
}
