import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { cards, language } = await req.json();
    
    if (!cards || cards.length !== 3) {
      return NextResponse.json({ error: "Invalid cards provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const cardNames = [
      "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
      "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit"
    ];

    const pastCard = cardNames[cards[0]];
    const presentCard = cardNames[cards[1]];
    const futureCard = cardNames[cards[2]];

    const systemPrompt = `You are a mystical and wise Tarot Master. 
The user has drawn 3 cards:
1. Past: ${pastCard}
2. Present: ${presentCard}
3. Future: ${futureCard}

Provide a deep, mystical, and encouraging reading based on these cards. 
Keep the reading around 3-4 sentences (about 60-80 words). Do not use bullet points or introductory fluff. Just deliver the reading directly in a poetic and empathetic tone.

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
