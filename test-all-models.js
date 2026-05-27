const apiKey = process.env.GEMINI_API_KEY;
async function fetchModels() {
  let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  while (url) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      data.models.forEach(m => console.log(m.name, "-", m.supportedGenerationMethods?.includes("generateContent") ? "generateContent" : ""));
    }
    if (data.nextPageToken) {
      url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageToken=${data.nextPageToken}`;
    } else {
      url = '';
    }
  }
}
fetchModels();
