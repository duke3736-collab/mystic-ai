import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "평생 사주팔자 - 무료 명리학, 궁합, 신년운세 | Mystic AI",
  description: "전통 명리학 기반의 정확한 AI 사주팔자 풀이. 나의 평생 운세, 대운, 연애운, 재물운, 궁합까지 무료 사주로 확인해 보세요.",
  keywords: ["사주", "사주팔자", "무료사주", "평생사주", "명리학", "사주풀이", "궁합", "신년운세", "대운", "재물운", "연애운", "만세력", "AI사주"],
  openGraph: {
    title: "평생 사주팔자 - 무료 명리학, 신년운세 | Mystic AI",
    description: "당신의 타고난 운명과 앞으로의 대운을 AI 명리학자가 분석해 드립니다.",
  },
};

export default function SajuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
