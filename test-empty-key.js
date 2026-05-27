const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(""); // Empty key
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    await model.generateContent("Hello");
  } catch (e) {
    console.error(e.message);
  }
}
run();
