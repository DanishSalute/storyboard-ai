import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// System prompt to enforce storyboard format and content validation
const SYSTEM_PROMPT = `You are a storyboard generation assistant. Your task is to:
1. Analyze if the user's prompt is appropriate for creating a visual storyboard
2. If appropriate, generate a detailed storyboard with the following structure:
   - Title
   - Scene-by-scene breakdown with:
     * Scene Number
     * Visual Description
     * Camera Angle/Shot Type
     * Characters/Actions
     * Mood/Atmosphere
3. If the prompt is inappropriate, offensive, or cannot be visualized as a storyboard, respond with: "I can't generate a storyboard with this prompt."

APPROPRIATE PROMPTS: stories, scenarios, narratives, film scenes, animations, etc.
INAPPROPRIATE PROMPTS: personal advice, technical questions, offensive content, non-visual concepts, etc.

Always respond in this exact format:
If valid: Provide the structured storyboard
If invalid: "I can't generate a storyboard with this prompt."`;

app.post("/api/storyboard", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Prompt: "${prompt}"\n\nStoryboard:`;
    
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    // Check if the response indicates inability to generate
    if (text.includes("I can't generate a storyboard with this prompt")) {
      return res.json({ 
        storyboard: null,
        message: "I can't generate a storyboard with this prompt.",
        error: true
      });
    }

    res.json({ 
      storyboard: text,
      message: "Storyboard generated successfully",
      error: false
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to generate content.",
      message: "Server error occurred"
    });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));