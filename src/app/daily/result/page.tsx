"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Download, Volume2, VolumeX, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import confetti from "canvas-confetti";
import CaptureWrapper from "@/components/CaptureWrapper";
import LuckyWidget from "@/components/LuckyWidget";
import { AdBanner } from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import CoupangAd from "@/components/CoupangAd";

const ZODIAC_SIGNS: Record<string, { icon: string, nameKo: string, nameEn: string, date: string }> = {
  "aries": { icon: "♈", nameKo: "양자리", nameEn: "Aries", date: "03.21 - 04.19" },
  "taurus": { icon: "♉", nameKo: "황소자리", nameEn: "Taurus", date: "04.20 - 05.20" },
  "gemini": { icon: "♊", nameKo: "쌍둥이자리", nameEn: "Gemini", date: "05.21 - 06.20" },
  "cancer": { icon: "♋", nameKo: "게자리", nameEn: "Cancer", date: "06.21 - 07.22" },
  "leo": { icon: "♌", nameKo: "사자자리", nameEn: "Leo", date: "07.23 - 08.22" },
  "virgo": { icon: "♍", nameKo: "처녀자리", nameEn: "Virgo", date: "08.23 - 09.22" },
  "libra": { icon: "♎", nameKo: "천칭자리", nameEn: "Libra", date: "09.23 - 10.22" },
  "scorpio": { icon: "♏", nameKo: "전갈자리", nameEn: "Scorpio", date: "10.23 - 11.21" },
  "sagittarius": { icon: "♐", nameKo: "사수자리", nameEn: "Sagittarius", date: "11.22 - 12.21" },
  "capricorn": { icon: "♑", nameKo: "염소자리", nameEn: "Capricorn", date: "12.22 - 01.19" },
  "aquarius": { icon: "♒", nameKo: "물병자리", nameEn: "Aquarius", date: "01.20 - 02.18" },
  "pisces": { icon: "♓", nameKo: "물고기자리", nameEn: "Pisces", date: "02.19 - 03.20" },
};

function DailyResultContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const signId = searchParams.get("sign") || "aries";
  
  const signInfo = ZODIAC_SIGNS[signId] || ZODIAC_SIGNS["aries"];

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user" | "ai", text: string}[]>([]);
  
  const [resultText, setResultText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const res = await fetch("/api/daily", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sign: signInfo.nameEn, language }),
        });
        const data = await res.json();
        if (data.result) {
          setResultText(data.result);
        } else {
          setResultText(language === "ko" ? "별빛이 흐려져 운세를 읽지 못했습니다. 잠시 후 다시 시도해주세요." : "The stars are cloudy right now. Please try again later.");
        }
      } catch (e) {
        setResultText(language === "ko" ? "운명을 읽는 중 오류가 발생했습니다." : "An error occurred while reading your destiny.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();

    return () => {
      if (synth) synth.cancel();
    };
  }, [language, signInfo.nameEn]);

  const handleSpeak = () => {
    if (!synth) return;
    
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(resultText);
    utterance.lang = language === "ko" ? "ko-KR" : "en-US";
    utterance.rate = 0.85; 
    utterance.pitch = 0.9;
    
    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const userInput = chatInput;
    const newHistory = [...chatHistory, { role: "user" as const, text: userInput }];
    setChatHistory(newHistory);
    setChatInput("");
    setIsChatLoading(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: chatHistory,
          context: resultText,
          language,
          userMessage: userInput
        }),
      });
      const data = await res.json();
      
      if (data.result) {
        setChatHistory(prev => [...prev, { role: "ai", text: data.result }]);
      } else {
        setChatHistory(prev => [...prev, { role: "ai", text: language === "ko" ? "우주의 속삭임을 듣지 못했습니다." : "I couldn't hear the cosmos." }]);
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "ai", text: language === "ko" ? "연결이 불안정합니다. 다시 시도해주세요." : "Connection unstable. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 pt-20 pb-32">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-indigo-950 -z-10" />
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none -z-10 mix-blend-screen" />
      
      <div className="w-full max-w-4xl mx-auto z-10">
        <Link href="/daily" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors self-start mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{language === "ko" ? "다시 선택하기" : "Select Again"}</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-200 via-blue-200 to-purple-400 tracking-tight mb-4 drop-shadow-sm">
            {t("daily.result.title")}
          </h1>
        </div>

        {/* Shareable Destiny Card Section */}
        <CaptureWrapper filename="mystic-daily">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500/30 rounded-tl-3xl m-4" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/30 rounded-tr-3xl m-4" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/30 rounded-bl-3xl m-4" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500/30 rounded-br-3xl m-4" />

            <div className="text-center mb-10 border-b border-blue-500/20 pb-6">
              <div className="text-6xl mb-4">{signInfo.icon}</div>
              <h2 className="text-2xl font-bold text-indigo-100">
                {language === "ko" ? signInfo.nameKo : signInfo.nameEn}
              </h2>
              <div className="text-indigo-400/80 text-sm mt-2 font-medium tracking-widest">
                {signInfo.date}
              </div>
            </div>

            <LuckyWidget seed={signId} />

            <div className="max-w-2xl mx-auto text-center px-4">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-6 opacity-80" />
              {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-6 my-12">
                  <div className="text-7xl animate-bounce">✨</div>
                  <div className="text-xl md:text-2xl font-bold text-amber-300 animate-pulse text-center">
                    {language === "ko" ? "점성술사가 오늘의 별자리를 읽고 있습니다..." : "The Astrologer is reading your daily stars..."}
                  </div>
                  <div className="text-sm text-slate-400">
                    {language === "ko" ? "잠시만 기다려주세요 (약 10~15초 소요)" : "Please wait a moment (takes about 10~15 seconds)"}
                  </div>
                </div>
              ) : (
                <p className="text-lg md:text-2xl leading-relaxed text-white font-medium break-keep drop-shadow-md">
                  "{resultText}"
                </p>
              )}
            </div>
            
            <div className="text-center mt-12 text-slate-500 text-xs">
              Generated by Mystic AI
            </div>
          </div>
        </CaptureWrapper>

        {/* AdSense Banner */}
        <div className="mt-8">
          <AdBanner dataAdSlot="1867596538" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <button 
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isSpeaking ? "bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]" : "bg-slate-800 text-pink-200 hover:bg-slate-700"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isSpeaking ? (language === "ko" ? "목소리 끄기" : "Stop Voice") : (language === "ko" ? "운명 듣기" : "Listen to Destiny")}
          </button>
        </div>

        <div className="mt-8">
          <ShareButtons 
            title={language === "ko" ? "오늘의 별자리 운세" : "Daily Horoscope"}
            description={resultText ? resultText.slice(0, 100) + "..." : "오늘의 운세를 확인해보세요!"}
            kakaoAppKey={process.env.NEXT_PUBLIC_KAKAO_APP_KEY || ""}
          />
        </div>

        {/* Coupang Ad */}
        <CoupangAd type="daily" />

        <div className="mt-16 bg-slate-900/40 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-indigo-100">
              {language === "ko" ? "점성술사와의 대화" : "Chat with Astrologer"}
            </h2>
          </div>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            <div className="bg-slate-800/60 p-4 rounded-2xl rounded-tl-sm text-indigo-100 text-sm md:text-base border border-slate-700">
              {language === "ko" 
                ? "오늘의 운세에 대해 더 궁금한 점이 있으신가요? 직업운, 연애운 등 무엇이든 물어보세요." 
                : "Do you have any further questions about your horoscope? Ask about career, love, etc."}
            </div>
            
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base ${
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-sm" 
                    : "bg-slate-800/60 text-indigo-100 rounded-tl-sm border border-slate-700"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/60 p-4 rounded-2xl rounded-tl-sm text-indigo-300 text-sm md:text-base border border-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading || !resultText}
              placeholder={language === "ko" ? "추가 질문을 입력하세요..." : "Ask a follow-up question..."}
              className="w-full bg-slate-950 border border-slate-700 rounded-full py-3 pl-5 pr-12 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function DailyResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-indigo-300">Consulting the Stars...</div>}>
      <DailyResultContent />
    </Suspense>
  );
}
