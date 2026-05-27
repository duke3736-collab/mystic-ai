import nodemailer from "nodemailer";

export async function sendEmailAlert(subject: string, message: string) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    // 환경 변수가 설정되지 않았다면 발송 생략 (개발 환경 등에서 에러 방지)
    if (!user || !pass) {
      console.warn("EMAIL_USER or EMAIL_PASS is not set. Skipping email alert.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Mystic AI Monitor" <${user}>`,
      to: "duke3736@gmail.com", // 수신자는 항상 대표님 이메일
      subject: `[Mystic AI] 🚨 ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48; border-bottom: 2px solid #f43f5e; padding-bottom: 10px;">Mystic AI 시스템 경고</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            <strong>오류 내용:</strong><br/>
            ${message}
          </p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 5px; font-size: 14px; color: #64748b;">
            <p style="margin: 0;"><strong>조치 사항:</strong></p>
            <ul style="margin-top: 5px; padding-left: 20px;">
              <li>제미나이(Gemini) API 무료 할당량(Rate Limit) 초과일 수 있습니다.</li>
              <li>Google AI Studio에서 현재 사용량을 확인해 주세요.</li>
              <li>지속 발생 시, API 결제 플랜을 Pay-as-you-go로 업그레이드 해야 할 수 있습니다.</li>
            </ul>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
            본 메일은 Mystic AI 자동 모니터링 시스템에 의해 발송되었습니다.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email alert sent: ${subject}`);
  } catch (error) {
    console.error("Failed to send email alert:", error);
  }
}
