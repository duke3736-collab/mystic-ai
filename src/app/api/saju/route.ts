import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { name, gender, dob, time, language } = await req.json();
    
    if (!name || !dob) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `You are a master of Eastern Astrology (Saju / Four Pillars of Destiny) and Bazi.
The user's information:
- Name: ${name}
- Gender: ${gender}
- Date of Birth: ${dob}
- Time of Birth: ${time}

Based on these details, calculate their primary Five Elements (Wood, Fire, Earth, Metal, Water) balance and provide a deeply mystical and highly detailed destiny reading.
You MUST format your response as a valid JSON object with exactly the following four keys:
- "total": Overall lifetime fortune and innate energy flow (3-4 sentences).
- "early": Early life destiny (0-20s), focusing on childhood, study, and early character (3-4 sentences).
- "middle": Middle life destiny (30s-50s), focusing on career, wealth, and marriage (3-4 sentences).
- "late": Late life destiny (60s+), focusing on health, legacy, and peace (3-4 sentences).

Do not include any other text outside the JSON block.

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
