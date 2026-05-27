import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { sendEmailAlert } from "@/lib/sendEmailAlert";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { signKo, rank, luckyColor, luckyItem, date } = await req.json();

    if (!signKo || !rank || !luckyColor || !luckyItem || !date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `당신은 일본의 유명 별자리 운세 코너 '오하아사' 스타일로 운세를 풀이해 주는 신비롭고 친절한 점성술사입니다.
오늘 날짜: ${date}
사용자 별자리: ${signKo}
오늘의 순위: 12개 별자리 중 ${rank}위
행운의 색상: ${luckyColor}
행운의 아이템: ${luckyItem}

위 정보를 바탕으로 사용자에게 오늘 하루를 어떻게 보내면 좋을지 3~4문장 분량의 짧고 임팩트 있는 조언을 한국어로 작성해 주세요.
말투는 다정하고 친근한 "~해요", "~해보세요" 체를 사용하세요.
순위가 높다면 축하와 함께 적극적인 행동을 권장하고, 순위가 낮다면 위로와 함께 조심해야 할 점을 알려주면서 행운의 아이템/색상을 활용해 기운을 북돋아주는 내용을 반드시 포함하세요.
불필요한 인사말이나 서론 없이 바로 운세 내용만 출력하세요.`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({ advice: text });
  } catch (error: any) {
    console.error("Gemini API Error (Ohaasa):", error);

    // Check for rate limit error (429)
    if (error.message?.includes("429") || error.status === 429) {
      await sendEmailAlert(
        "제미나이 API 한도 초과 발생 (Ohaasa API)",
        `오하아사 조언 API에서 429 Too Many Requests 에러가 발생했습니다.<br/><br/>
         <strong>상세 에러 내용:</strong><br/>
         <pre style="background:#f1f5f9; padding:10px; border-radius:5px; white-space:pre-wrap;">${error.message}</pre>`
      );
    }

    return NextResponse.json(
      { error: "Failed to generate advice", details: error.message },
      { status: 500 }
    );
  }
}
