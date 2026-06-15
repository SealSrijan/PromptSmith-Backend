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
You are an expert prompt engineer.

Rewrite the user's prompt into a more detailed,
clear, professional prompt.

Return ONLY JSON:

{
  "improvedPrompt": "..."
}

User Prompt:
${message.prompt}
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