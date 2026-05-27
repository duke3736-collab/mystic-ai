"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Download, Volume2, VolumeX, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { AdBanner } from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";

function TarotResultContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const cardsParam = searchParams.get("cards");
  const cardIndexes = cardsParam ? cardsParam.split(",").map(Number) : [0, 1, 2];
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user" | "ai", text: string}[]>([]);
  
  const [resultText, setResultText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    // Fetch AI Reading
    const fetchReading = async () => {
      try {
        const res = await fetch("/api/tarot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cards: cardIndexes, language }),
        });
        const data = await res.json();
        if (data.result) {
          setResultText(data.result);
        } else {
          setResultText(language === "ko" ? "운명을 읽는 중 별빛이 흐려졌습니다. 잠시 후 다시 시도해주세요." : "The stars are cloudy right now. Please try again later.");
        }
      } catch (e) {
        setResultText(language === "ko" ? "운명을 읽는 중 오류가 발생했습니다." : "An error occurred while reading your destiny.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();

    // Trigger magical confetti on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#818cf8', '#c084fc', '#fcd34d']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#818cf8', '#c084fc', '#fcd34d']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      if (synth) synth.cancel();
    };
  }, [language]); // Depend on language so it refetches if changed

  const handleSpeak = () => {
    if (!synth) return;
    
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(resultText);
    utterance.lang = language === "ko" ? "ko-KR" : "en-US";
    utterance.rate = 0.85; // slightly slower for mystical feel
    utterance.pitch = 0.9;
    
    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#020617", // slate-950
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "my_destiny_card.png";
      a.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
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
        setChatHistory(prev => [...prev, { role: "ai", text: language === "ko" ? "별들의 속삭임을 듣지 못했습니다. 다시 물어보시겠어요?" : "I couldn't hear the stars. Could you ask again?" }]);
      }
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "ai", text: language === "ko" ? "마법의 기운이 불안정합니다. 다시 시도해주세요." : "The magic energy is unstable. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 pt-20 pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10" />
      
      <div className="w-full max-w-4xl mx-auto z-10">
        <Link href="/tarot" className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors self-start mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{language === "ko" ? "다시 뽑기" : "Draw Again"}</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 tracking-tight mb-4 drop-shadow-sm">
            {language === "ko" ? "당신의 운명" : "Your Destiny"}
          </h1>
        </div>

        {/* Shareable Destiny Card Section */}
        <div 
          ref={cardRef}
          className="bg-slate-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-3xl m-4" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-3xl m-4" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-3xl m-4" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-3xl m-4" />

          {/* Display The Cards */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 mt-6">
            {cardIndexes.map((cardIndex, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-yellow-500/70 text-xs md:text-sm font-bold tracking-widest mb-3">
                  {cardIndexes.length === 3 ? (
                    <>
                      {index === 0 && (language === "ko" ? "과거" : "PAST")}
                      {index === 1 && (language === "ko" ? "현재" : "PRESENT")}
                      {index === 2 && (language === "ko" ? "미래" : "FUTURE")}
                    </>
                  ) : (
                    `CARD ${index + 1}`
                  )}
                </div>
                <div className={`relative ${cardIndexes.length > 3 ? 'w-16 h-24 md:w-20 md:h-32' : 'w-24 h-36 md:w-32 md:h-48'} rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-500/40`}>
                  <Image 
                    src={`/images/tarot/front_${cardIndex + 1}.png`} 
                    alt="Tarot Card" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Interpretation */}
          <div className="max-w-2xl mx-auto text-center px-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-6 opacity-80" />
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-6 my-12">
                <div className="text-7xl animate-bounce">🔮</div>
                <div className="text-xl md:text-2xl font-bold text-indigo-300 animate-pulse text-center">
                  {language === "ko" ? "타로 마스터가 운명의 카드를 읽고 있습니다..." : "The Tarot Master is reading your cards..."}
                </div>
                <div className="text-sm text-slate-400">
                  {language === "ko" ? "잠시만 기다려주세요 (약 10~15초 소요)" : "Please wait a moment (takes about 10~15 seconds)"}
                </div>
              </div>
            ) : resultText ? (
              <p className="text-base md:text-xl leading-relaxed text-white font-medium break-keep drop-shadow-md">
                {resultText}
              </p>
            ) : (
              <p className="text-base text-red-300">
                {language === "ko" ? "운명을 읽는 중 오류가 발생했습니다. 다시 시도해주세요." : "An error occurred. Please try again."}
              </p>
            )}
          </div>
          
          <div className="text-center mt-12 text-slate-500 text-xs">
            Generated by Mystic AI
          </div>
        </div>

        {/* AdSense Banner */}
        <div className="mt-8">
          <AdBanner dataAdSlot="1867596538" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <button 
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isSpeaking ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]" : "bg-slate-800 text-indigo-200 hover:bg-slate-700"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isSpeaking ? (language === "ko" ? "목소리 끄기" : "Stop Voice") : (language === "ko" ? "운명 듣기" : "Listen to Destiny")}
          </button>
          
          <button 
            onClick={handleDownloadImage}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-105"
          >
            <Download className="w-5 h-5" />
            {language === "ko" ? "운명 카드 저장" : "Save Destiny Card"}
          </button>
        </div>

        <div className="mt-8">
          <ShareButtons 
            title={language === "ko" ? "나의 타로카드 운명 결과" : "My Tarot Destiny"}
            description={resultText ? resultText.slice(0, 100) + "..." : "타로카드 결과를 확인해보세요!"}
            kakaoAppKey={process.env.NEXT_PUBLIC_KAKAO_APP_KEY || ""}
          />
        </div>

        {/* Interactive Chat Session */}
        <div className="mt-16 bg-slate-900/40 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-indigo-100">
              {language === "ko" ? "타로 마스터와 티타임" : "Tea Time with Tarot Master"}
            </h2>
          </div>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            <div className="bg-slate-800/60 p-4 rounded-2xl rounded-tl-sm text-indigo-100 text-sm md:text-base border border-slate-700">
              {language === "ko" 
                ? "결과에 대해 더 궁금한 점이 있으신가요? 무엇이든 물어보세요." 
                : "Do you have any further questions about your reading? Ask me anything."}
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

export default function TarotResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-indigo-300">Loading Destiny...</div>}>
      <TarotResultContent />
    </Suspense>
  );
}
