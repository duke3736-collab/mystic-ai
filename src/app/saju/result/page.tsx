"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Download, Volume2, VolumeX, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { AdBanner } from "@/components/AdBanner";

function SajuResultContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  
  const name = searchParams.get("name") || "";
  const gender = searchParams.get("gender") || "female";
  const year = searchParams.get("year") || "1980";
  const month = searchParams.get("month") || "01";
  const day = searchParams.get("day") || "01";
  const dob = `${year}-${month}-${day}`;
  const time = searchParams.get("time") || "unknown";

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user" | "ai", text: string}[]>([]);
  
  const [resultText, setResultText] = useState<{ total: string; early: string; middle: string; late: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const res = await fetch("/api/saju", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, gender, dob, time, language }),
        });
        const data = await res.json();
        if (data.result) {
          try {
            // The API will return a JSON string inside data.result
            const parsed = JSON.parse(data.result.replace(/```json/g, '').replace(/```/g, '').trim());
            setResultText(parsed);
          } catch (err) {
            console.error("Failed to parse JSON result", err);
            // Fallback for parsing error
            setResultText({
              total: language === "ko" ? "운세를 불러오는 데 실패했습니다." : "Failed to load destiny.",
              early: "",
              middle: "",
              late: ""
            });
          }
        } else {
          setResultText(null);
        }
      } catch (e) {
        setResultText(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (name && year) {
      fetchReading();
    } else {
      setIsLoading(false);
    }

    // Trigger magical confetti on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#34d399', '#2dd4bf', '#3b82f6'] // Emerald, Teal, Blue
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#34d399', '#2dd4bf', '#3b82f6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      if (synth) synth.cancel();
    };
  }, [language, name, gender, dob, time]);

  const handleSpeak = () => {
    if (!synth) return;
    
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullText = resultText ? `${resultText.total} ${resultText.early} ${resultText.middle} ${resultText.late}` : "";
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = language === "ko" ? "ko-KR" : "en-US";
    utterance.rate = 0.85; 
    utterance.pitch = 0.9;
    
    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#020617",
        scale: 2,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "my_saju_energy.png";
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
          context: resultText ? JSON.stringify(resultText) : "",
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
      setChatHistory(prev => [...prev, { role: "ai", text: language === "ko" ? "우주의 기운이 불안정합니다. 다시 시도해주세요." : "The cosmic energy is unstable. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 pt-20 pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 -z-10" />
      
      <div className="w-full max-w-4xl mx-auto z-10">
        <Link href="/saju" className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors self-start mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{language === "ko" ? "다시 분석하기" : "Analyze Again"}</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-200 via-teal-200 to-blue-400 tracking-tight mb-4 drop-shadow-sm">
            {t("saju.result.title")}
          </h1>
        </div>

        {/* Shareable Destiny Card Section */}
        <div 
          ref={cardRef}
          className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-3xl m-4" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-3xl m-4" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-3xl m-4" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-emerald-500/30 rounded-br-3xl m-4" />

          {/* User Info Header */}
          <div className="text-center mb-10 border-b border-emerald-500/20 pb-6">
            <h2 className="text-2xl font-bold text-emerald-100">{name}</h2>
            <div className="text-emerald-400/80 text-sm mt-2 font-medium tracking-widest">
              {dob} • {time === "unknown" ? t("saju.unknown") : time} • {gender === "male" ? t("saju.male") : t("saju.female")}
            </div>
          </div>

          {/* Elements Visualization */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
            <div className="flex flex-col items-center p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/20 w-24">
              <span className="text-3xl mb-2">🪵</span>
              <span className="text-emerald-200 text-xs font-bold tracking-widest">{language === "ko" ? "목(Wood)" : "WOOD"}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-red-950/40 rounded-2xl border border-red-500/20 w-24">
              <span className="text-3xl mb-2">🔥</span>
              <span className="text-red-200 text-xs font-bold tracking-widest">{language === "ko" ? "화(Fire)" : "FIRE"}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-950/40 rounded-2xl border border-yellow-500/20 w-24">
              <span className="text-3xl mb-2">🌍</span>
              <span className="text-yellow-200 text-xs font-bold tracking-widest">{language === "ko" ? "토(Earth)" : "EARTH"}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-500/20 w-24">
              <span className="text-3xl mb-2">⚙️</span>
              <span className="text-slate-300 text-xs font-bold tracking-widest">{language === "ko" ? "금(Metal)" : "METAL"}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-blue-950/40 rounded-2xl border border-blue-500/20 w-24">
              <span className="text-3xl mb-2">💧</span>
              <span className="text-blue-200 text-xs font-bold tracking-widest">{language === "ko" ? "수(Water)" : "WATER"}</span>
            </div>
          </div>

          {/* AI Interpretation */}
          <div className="max-w-3xl mx-auto px-4 mt-8">
            <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-10 opacity-80" />
            {isLoading ? (
              <div className="animate-pulse space-y-10">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 bg-slate-700/50 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : resultText ? (
              <div className="space-y-12 text-left">
                {/* Total Fortune */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-10 -mt-10" />
                  <h3 className="text-xl md:text-2xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span> {language === "ko" ? "총운 (Lifetime)" : "Overall Destiny"}
                  </h3>
                  <p className="text-base md:text-lg leading-loose text-emerald-50 font-medium break-keep drop-shadow-sm">
                    {resultText.total}
                  </p>
                </div>

                {/* Early Life */}
                <div className="p-4 md:p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50">
                  <h3 className="text-lg md:text-xl font-bold text-emerald-300 mb-3 border-b border-emerald-500/20 pb-2">
                    {language === "ko" ? "초년운 (Early Life)" : "Early Life (0-20s)"}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-slate-100 font-medium break-keep">
                    {resultText.early}
                  </p>
                </div>

                {/* Middle Life */}
                <div className="p-4 md:p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50">
                  <h3 className="text-lg md:text-xl font-bold text-yellow-300 mb-3 border-b border-yellow-500/20 pb-2">
                    {language === "ko" ? "중년운 (Middle Life)" : "Middle Life (30s-50s)"}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-slate-100 font-medium break-keep">
                    {resultText.middle}
                  </p>
                </div>

                {/* Late Life */}
                <div className="p-4 md:p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50">
                  <h3 className="text-lg md:text-xl font-bold text-blue-300 mb-3 border-b border-blue-500/20 pb-2">
                    {language === "ko" ? "말년운 (Late Life)" : "Late Life (60s+)"}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-slate-100 font-medium break-keep">
                    {resultText.late}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Failed to load reading.</p>
            )}
          </div>
          
          <div className="text-center mt-12 text-slate-500 text-xs">
            Generated by Mystic AI
          </div>
        </div>

        {/* AdSense Banner */}
        <div className="mt-8">
          <AdBanner dataAdSlot="SAJU_RESULT_SLOT_ID" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <button 
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isSpeaking ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(52,211,153,0.5)]" : "bg-slate-800 text-emerald-200 hover:bg-slate-700"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            {isSpeaking ? (language === "ko" ? "목소리 끄기" : "Stop Voice") : (language === "ko" ? "운명 듣기" : "Listen to Destiny")}
          </button>
          
          <button 
            onClick={handleDownloadImage}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:scale-105"
          >
            <Download className="w-5 h-5" />
            {language === "ko" ? "사주 카드 저장 & 공유" : "Save & Share Saju Card"}
          </button>
        </div>

        {/* Interactive Chat Session */}
        <div className="mt-16 bg-slate-900/40 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-emerald-100">
              {language === "ko" ? "명리학자와의 대화" : "Chat with Astrologer"}
            </h2>
          </div>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            <div className="bg-slate-800/60 p-4 rounded-2xl rounded-tl-sm text-emerald-100 text-sm md:text-base border border-slate-700">
              {language === "ko" 
                ? "결과에 대해 더 궁금한 점이 있으신가요? 직업운, 연애운 등 무엇이든 물어보세요." 
                : "Do you have any further questions about your elements? Ask about career, love, etc."}
            </div>
            
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base ${
                  msg.role === "user" 
                    ? "bg-emerald-600 text-white rounded-tr-sm" 
                    : "bg-slate-800/60 text-emerald-100 rounded-tl-sm border border-slate-700"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/60 p-4 rounded-2xl rounded-tl-sm text-emerald-300 text-sm md:text-base border border-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
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
              className="w-full bg-slate-950 border border-slate-700 rounded-full py-3 pl-5 pr-12 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SajuResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-emerald-300">Calculating Elements...</div>}>
      <SajuResultContent />
    </Suspense>
  );
}
