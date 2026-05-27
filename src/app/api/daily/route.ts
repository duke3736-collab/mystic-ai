import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { sendEmailAlert } from "@/lib/sendEmailAlert";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { sign, language } = await req.json();
    
    if (!sign) {
      return NextResponse.json({ error: "Missing zodiac sign" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `You are a mystical Western Astrologer. 
The user is asking for their Daily Horoscope for the Zodiac sign: ${sign}.
Based on current astrological transits (or just a generalized uplifting daily horoscope), provide a poetic, wise, and highly accurate-sounding reading for their day.
Focus on areas of Love, Career, and General Energy.
Keep the reading around 3-4 sentences. Do not use bullet points or introductory fluff. Deliver the reading directly.

${language === "ko" ? "IMPORTANT: Write the response completely in Korean (한국어)." : "IMPORTANT: Write the response completely in English."}
`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Check for rate limit error (429)
    if (error.message?.includes("429") || error.status === 429) {
      await sendEmailAlert(
        "제미나이 API 한도 초과 발생 (Daily API)",
        `오늘의 운세 API에서 429 Too Many Requests 에러가 발생했습니다.<br/><br/>
         <strong>상세 에러 내용:</strong><br/>
         <pre style="background:#f1f5f9; padding:10px; border-radius:5px; white-space:pre-wrap;">${error.message}</pre>`
      );
    }

    return NextResponse.json(
      { error: "Failed to generate reading" },
      { status: 500 }
    );
  }
}
