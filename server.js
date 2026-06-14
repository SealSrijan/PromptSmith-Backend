require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

// Gemini Setup
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 PromptSmith Backend Running");
});

// Prompt Analysis Endpoint
app.post("/api/analyze-prompt", async (req, res) => {
  try {

    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const instruction = `
You are PromptSmith, an elite prompt engineer.

Analyze the user's prompt and return ONLY valid JSON.

JSON format:

{
  "score": number,
  "category": string,
  "feedback": [
    {
      "element": string,
      "status": "missing",
      "advice": string,
      "example": string
    }
  ],
  "improvedPrompt": string
}

Rules:
- score must be from 0 to 100
- category must be short
- feedback should identify missing prompt components
- improvedPrompt should preserve user intent but significantly improve quality
- Return ONLY JSON
- Do not wrap in markdown

User Prompt:
${userPrompt}
`;

    const result = await model.generateContent(
      instruction
    );

    const rawText =
      result.response.text();

    console.log("===== GEMINI RESPONSE =====");
    console.log(rawText);

    // Remove markdown fences if Gemini adds them
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    res.json(parsed);

  } catch (error) {

    console.error("===== SERVER ERROR =====");
    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
});

// Start Server
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `🚀 PromptSmith Backend Running on Port ${PORT}`
  );
});