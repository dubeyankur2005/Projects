const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

async function generateScenes(script) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
Convert the following script into video scenes.

Return ONLY a JSON array.

Example:
[
  {
    "scene": 1,
    "description": "AI transforming healthcare"
  }
]

Script:
${script}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = generateScenes;