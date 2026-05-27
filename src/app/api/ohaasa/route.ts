import { NextResponse } from "next/server";

const ZODIAC_SIGNS = [
  { id: "aries", icon: "♈", nameKo: "양자리", nameEn: "Aries", date: "03.21 - 04.19" },
  { id: "taurus", icon: "♉", nameKo: "황소자리", nameEn: "Taurus", date: "04.20 - 05.20" },
  { id: "gemini", icon: "♊", nameKo: "쌍둥이자리", nameEn: "Gemini", date: "05.21 - 06.20" },
  { id: "cancer", icon: "♋", nameKo: "게자리", nameEn: "Cancer", date: "06.21 - 07.22" },
  { id: "leo", icon: "♌", nameKo: "사자자리", nameEn: "Leo", date: "07.23 - 08.22" },
  { id: "virgo", icon: "♍", nameKo: "처녀자리", nameEn: "Virgo", date: "08.23 - 09.22" },
  { id: "libra", icon: "♎", nameKo: "천칭자리", nameEn: "Libra", date: "09.23 - 10.22" },
  { id: "scorpio", icon: "♏", nameKo: "전갈자리", nameEn: "Scorpio", date: "10.23 - 11.21" },
  { id: "sagittarius", icon: "♐", nameKo: "사수자리", nameEn: "Sagittarius", date: "11.22 - 12.21" },
  { id: "capricorn", icon: "♑", nameKo: "염소자리", nameEn: "Capricorn", date: "12.22 - 01.19" },
  { id: "aquarius", icon: "♒", nameKo: "물병자리", nameEn: "Aquarius", date: "01.20 - 02.18" },
  { id: "pisces", icon: "♓", nameKo: "물고기자리", nameEn: "Pisces", date: "02.19 - 03.20" },
];

const COLORS = ["빨간색", "주황색", "노란색", "초록색", "파란색", "남색", "보라색", "핑크색", "검은색", "흰색", "갈색", "회색", "금색", "은색", "하늘색", "베이지색"];
const ITEMS = ["커피", "향수", "은반지", "책", "거울", "운동화", "머그컵", "이어폰", "손수건", "초콜릿", "펜", "우산", "지갑", "안경", "목도리", "시계", "립스틱", "에코백", "다이어리", "스마트폰 케이스"];

// Simple seeded random number generator
function xfc32(a: number, b: number, c: number, d: number) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

// Generates a seed from a date string (e.g. "2026-05-28")
function getSeedFromDate(dateStr: string) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = Math.imul(31, hash) + dateStr.charCodeAt(i) | 0;
  }
  return hash;
}

export async function GET() {
  try {
    // Get current date in KST
    const now = new Date();
    const kstOptions = { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" } as const;
    const formatter = new Intl.DateTimeFormat("en-CA", kstOptions); 
    // en-CA format returns YYYY-MM-DD
    const dateStr = formatter.format(now);

    const seed = getSeedFromDate(dateStr);
    const rand = xfc32(seed, seed + 1, seed + 2, seed + 3);

    // Shuffle zodiac signs
    const signs = [...ZODIAC_SIGNS];
    for (let i = signs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [signs[i], signs[j]] = [signs[j], signs[i]];
    }

    // Assign lucky items and colors
    const ranking = signs.map((sign, index) => {
      const colorIndex = Math.floor(rand() * COLORS.length);
      const itemIndex = Math.floor(rand() * ITEMS.length);
      
      return {
        rank: index + 1,
        ...sign,
        luckyColor: COLORS[colorIndex],
        luckyItem: ITEMS[itemIndex]
      };
    });

    return NextResponse.json({
      date: dateStr,
      ranking
    });
  } catch (error: any) {
    console.error("Failed to generate ranking:", error);
    return NextResponse.json({ error: "Failed to generate ranking" }, { status: 500 });
  }
}
