"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    "nav.daily": "오늘의 운세",
    "nav.tarot": "타로 읽기",
    "nav.saju": "글로벌 사주",
    "home.title": "별빛이 들려주는 당신의 운명",
    "home.subtitle": "수천 년의 동양 철학과 서양 타로의 신비로운 결합",
    "home.cta": "내 운명 확인하기",
    "tarot.title": "3장의 카드를 선택하세요",
    "tarot.subtitle": "마음속으로 질문을 깊게 떠올리며 과거, 현재, 미래를 의미하는 카드를 3장 고르세요.",
    "tarot.selected": "선택됨",
    "tarot.past": "과거",
    "tarot.present": "현재",
    "tarot.future": "미래",
    "tarot.analyze": "내 운명 분석하기",
    "tarot.analyzing": "운명의 별자리 읽는 중...",
    "tarot.back": "뒤로 가기",
    "saju.title": "동양 사주 분석",
    "saju.subtitle": "우주가 당신이 태어난 순간에 부여한 오행의 기운을 분석합니다.",
    "saju.name": "이름",
    "saju.gender": "성별",
    "saju.male": "남성",
    "saju.female": "여성",
    "saju.dob": "생년월일",
    "saju.time": "태어난 시간",
    "saju.unknown": "모름",
    "saju.analyze": "내 오행 기운 확인하기",
    "saju.analyzing": "사주의 기운을 읽는 중...",
    "saju.result.title": "당신의 오행 분석 결과",
    "daily.title": "오늘의 별자리 운세",
    "daily.subtitle": "우주의 별들이 오늘 당신에게 전하는 메시지를 확인하세요.",
    "daily.select": "당신의 별자리를 선택하세요",
    "daily.analyze": "오늘의 운세 읽기",
    "daily.analyzing": "별들의 흐름을 분석하는 중...",
    "daily.result.title": "오늘의 운세 결과"
  },
  en: {
    "nav.daily": "Daily Horoscope",
    "nav.tarot": "Tarot Reading",
    "nav.saju": "Eastern Saju",
    "home.title": "Destiny Told by Starlight",
    "home.subtitle": "A mystical blend of ancient Eastern philosophy and Western Tarot",
    "home.cta": "Discover My Fate",
    "tarot.title": "Select 3 Cards",
    "tarot.subtitle": "Focus deeply on your question. Select three cards for your Past, Present, and Future.",
    "tarot.selected": "SELECTED",
    "tarot.past": "PAST",
    "tarot.present": "PRESENT",
    "tarot.future": "FUTURE",
    "tarot.analyze": "Analyze My Destiny",
    "tarot.analyzing": "Reading Destiny...",
    "tarot.back": "Back",
    "saju.title": "Eastern Astrology",
    "saju.subtitle": "Analyze the energy of the Five Elements bestowed upon you at birth.",
    "saju.name": "Name",
    "saju.gender": "Gender",
    "saju.male": "Male",
    "saju.female": "Female",
    "saju.dob": "Date of Birth",
    "saju.time": "Time of Birth",
    "saju.unknown": "Unknown",
    "saju.analyze": "Reveal My Elements",
    "saju.analyzing": "Reading your cosmic energy...",
    "saju.result.title": "Your Five Elements Analysis",
    "daily.title": "Daily Horoscope",
    "daily.subtitle": "Listen to the messages the stars have for you today.",
    "daily.select": "Select your Zodiac sign",
    "daily.analyze": "Read Today's Horoscope",
    "daily.analyzing": "Reading the flow of stars...",
    "daily.result.title": "Today's Destiny"
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Detect browser language on mount
    const browserLang = navigator.language;
    if (browserLang.startsWith("ko")) {
      setLanguage("ko");
    }
  }, []);

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
