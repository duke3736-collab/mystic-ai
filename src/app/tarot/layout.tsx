import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "타로카드 - 무료 연애운, 금전운, 취업운 타로점 | Mystic AI",
  description: "Mystic AI가 제공하는 고퀄리티 켈틱크로스 타로점. 연애운, 금전운, 직장운, 학업운 등 궁금한 모든 것을 무료 타로로 확인해 보세요.",
  keywords: ["타로", "타로카드", "무료타로", "타로점", "연애운", "금전운", "직장운", "취업운", "학업운", "켈틱크로스", "오늘의타로", "AI타로", "타로해석"],
  openGraph: {
    title: "타로카드 - 무료 연애운, 금전운 타로점 | Mystic AI",
    description: "AI 타로 마스터가 당신의 과거, 현재, 미래를 정확하게 짚어드립니다.",
  },
};

export default function TarotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
