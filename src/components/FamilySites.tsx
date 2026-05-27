"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function FamilySites() {
  const { language } = useLanguage();

  const sites = [
    {
      nameKo: "여름휴가 지도",
      nameEn: "Summer Map",
      descKo: "국내 최고의 여름 휴가지를 찾아보세요",
      descEn: "Find the best summer vacation spots",
      url: "https://map.weknews.com",
      icon: "🏖️",
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      nameKo: "핀인사이트",
      nameEn: "Fin Insight",
      descKo: "복잡한 세금과 금융 계산을 한 번에",
      descEn: "Complex tax & financial calculations made easy",
      url: "https://tools.weknews.com",
      icon: "📊",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    // {
    //   nameKo: "커넥트 AI",
    //   nameEn: "Connect AI",
    //   descKo: "당신만을 위한 AI 비서 서비스",
    //   descEn: "Your personal AI assistant service",
    //   url: "https://ai.weknews.com",
    //   icon: "🤖",
    //   color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    // }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-10 px-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-300">
          {language === "ko" ? "패밀리 서비스" : "Our Family Services"}
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          {language === "ko" ? "다양한 맞춤형 서비스를 경험해보세요" : "Explore our other customized services"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sites.map((site, index) => (
          <a
            key={index}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-lg ${site.color}`}
          >
            <div className="text-4xl mb-3">{site.icon}</div>
            <h4 className="font-bold text-lg mb-1">{language === "ko" ? site.nameKo : site.nameEn}</h4>
            <p className="text-xs text-center opacity-80">{language === "ko" ? site.descKo : site.descEn}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
