import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { sendEmailAlert } from "@/lib/sendEmailAlert";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { cards, language } = await req.json();
    
    if (!cards || (cards.length !== 3 && cards.length !== 10)) {
      return NextResponse.json({ error: "Invalid cards provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const cardNames = [
      "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
      "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
      "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
      "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
      "Judgement", "The World"
    ];

    let systemPrompt = "";

    if (cards.length === 3) {
      const pastCard = cardNames[cards[0]];
      const presentCard = cardNames[cards[1]];
      const futureCard = cardNames[cards[2]];

      systemPrompt = `You are a mystical and wise Tarot Master. 
The user has drawn 3 cards:
1. Past: ${pastCard}
2. Present: ${presentCard}
3. Future: ${futureCard}

Provide a deep, mystical, and encouraging reading based on these cards. 
Keep the reading around 3-4 sentences (about 60-80 words). Do not use bullet points or introductory fluff. Just deliver the reading directly in a poetic and empathetic tone.

${language === "ko" ? "IMPORTANT: Write the response completely in Korean (한국어)." : "IMPORTANT: Write the response completely in English."}
`;
    } else if (cards.length === 10) {
      const drawnCards = cards.map((idx: number) => cardNames[idx]);
      systemPrompt = `You are a mystical and wise Tarot Master. 
The user has drawn 10 cards for a Celtic Cross spread:
1. The Present / The Querent: ${drawnCards[0]}
2. The Challenge / Obstacle: ${drawnCards[1]}
3. The Past: ${drawnCards[2]}
4. The Future: ${drawnCards[3]}
5. Conscious Goals: ${drawnCards[4]}
6. Unconscious Influences: ${drawnCards[5]}
7. Advice / Self: ${drawnCards[6]}
8. External Influences: ${drawnCards[7]}
9. Hopes and Fears: ${drawnCards[8]}
10. The Ultimate Outcome: ${drawnCards[9]}

Provide a deep, profound, and structured reading based on these cards. 
Keep the reading around 3 paragraphs (about 150-200 words). Do not use bullet points, but use line breaks for readability. Deliver a highly mystical, empathetic, and insightful reading.

${language === "ko" ? "IMPORTANT: Write the response completely in Korean (한국어)." : "IMPORTANT: Write the response completely in English."}
`;
    }

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for rate limit error (429)
    if (error.message?.includes("429") || error.status === 429) {
      await sendEmailAlert(
        "제미나이 API 한도 초과 발생 (Tarot API)",
        `타로카드 분석 API에서 429 Too Many Requests 에러가 발생했습니다.<br/><br/>
         <strong>상세 에러 내용:</strong><br/>
         <pre style="background:#f1f5f9; padding:10px; border-radius:5px; white-space:pre-wrap;">${error.message}</pre>`
      );
    }

    return NextResponse.json(
      { error: "Failed to generate reading", details: error.message },
      { status: 500 }
    );
  }
}
