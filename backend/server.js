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

app.post("/api/storyboard", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ storyboard: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
