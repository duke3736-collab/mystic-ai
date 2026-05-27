import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 운세 - 별자리 운세, 띠별 무료 운세 | Mystic AI",
  description: "서양 점성술 기반의 맞춤형 오늘의 운세. 당신의 별자리에 따른 오늘 하루의 재물운, 애정운, 행운의 색상과 숫자를 확인하세요.",
  keywords: ["오늘의운세", "운세", "무료운세", "별자리운세", "띠별운세", "오늘운세", "애정운", "재물운", "행운의색상", "행운의숫자", "AI운세", "점성술"],
  openGraph: {
    title: "오늘의 운세 - 별자리 무료 운세 | Mystic AI",
    description: "AI 점성술사가 매일 새롭게 당신의 하루를 예측해 드립니다.",
  },
};

export default function DailyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
