const { GoogleGenerativeAI } = require("@google/generative-ai");
async function test() {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyBobLBgBhMZu8Im6q3dwnf3KR7yNGh0prM");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello!");
    console.log("SUCCESS:", result.response.text());
  } catch (error) {
    console.error("ERROR:", error);
  }
}
test();
