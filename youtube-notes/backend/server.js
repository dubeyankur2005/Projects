require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { YoutubeTranscript } = require("youtube-transcript");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-notes", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    // Get transcript
    const transcriptData =
      await YoutubeTranscript.fetchTranscript(videoUrl);

    const transcript = transcriptData
  .map((item) => item.text)
  .join(" ")
  .slice(0, 15000);

    // const transcript = "JavaScript is a programming language used for web development.";

    // Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

 const prompt = `
Create professional study notes from this transcript.

IMPORTANT:
- Return ONLY Markdown.
- Put each heading on a new line.
- Use proper Markdown syntax.
- Use bullet points.
- Use spacing between sections.

Format exactly like this:

# Title

## Overview

Paragraph

## Key Concepts

- Point 1
- Point 2
- Point 3

## Important Rules

- Rule 1
- Rule 2

## Examples

- Example 1

## Summary

Short summary

Transcript:
${transcript}
`;

   let result;

for (let i = 0; i < 3; i++) {
  try {
    result = await model.generateContent(prompt);
    break;
  } catch (error) {
    if (i === 2) throw error;

    console.log(`Retry ${i + 1}/3`);

    await new Promise((resolve) =>
      setTimeout(resolve, 3000)
    );
  }
}

    const notes = result.response.text();

    res.json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      notes: "Failed to generate notes.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});