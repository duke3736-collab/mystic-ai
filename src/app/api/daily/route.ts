import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { sign, language } = await req.json();
    
    if (!sign) {
      return NextResponse.json({ error: "Missing zodiac sign" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate reading" },
      { status: 500 }
    );
  }
}
