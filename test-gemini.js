const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBLZGYkCRGa3o4Y4ua_2W71RN_KIeCZxls");
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
