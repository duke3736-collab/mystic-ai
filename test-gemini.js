const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI("AIzaSyBLZGYkCRGa3o4Y4ua_2W71RN_KIeCZxls");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  try {
    const result = await model.generateContent("Hello");
    console.log("Success! " + result.response.text());
  } catch (e) {
    console.error("Error with gemini-2.5-flash: " + e.message);
  }
}
run();
