import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { sendEmailAlert } from "@/lib/sendEmailAlert";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { history, context, language, userMessage } = await req.json();
    
    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Format chat history for Gemini API
    const formattedHistory = history.map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const systemInstruction = `You are a mystical and wise Oracle (Tarot Master & Astrologer). 
The user has just received the following destiny reading:
"${context}"

Answer their follow-up questions in a concise, empathetic, and mystical tone based on the reading they received. Keep your answers relatively short (1-3 sentences) to maintain a chat-like experience.

${language === "ko" ? "IMPORTANT: Write the response completely in Korean (한국어)." : "IMPORTANT: Write the response completely in English."}`;

    // Prepend the system prompt as the first model message in the history context
    // if the history is empty, or pass it via systemInstruction if supported.
    // For simplicity with gemini-1.5, we can use systemInstruction, but to be safe across models we just prepend it.
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Follow these instructions: " + systemInstruction }] },
        { role: "model", parts: [{ text: "Understood." }] },
        ...formattedHistory
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);

    // Check for rate limit error (429)
    if (error.message?.includes("429") || error.status === 429) {
      await sendEmailAlert(
        "제미나이 API 한도 초과 발생 (Chat API)",
        `채팅 API에서 429 Too Many Requests 에러가 발생했습니다.<br/><br/>
         <strong>상세 에러 내용:</strong><br/>
         <pre style="background:#f1f5f9; padding:10px; border-radius:5px; white-space:pre-wrap;">${error.message}</pre>`
      );
    }

    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
