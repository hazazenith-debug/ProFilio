import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Remove markdown code fences from output
function cleanHtmlOutput(text) {
  if (!text) return "";
  
  let cleanText = text.trim();
  
  if (cleanText.startsWith("```html")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }
  
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  
  return cleanText.trim();
}

async function generateWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();
  
  return cleanHtmlOutput(rawText);
}

async function generateWithOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing in .env file.");
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional web designer that writes beautiful, single-file, responsive HTML templates containing both structure and styled blocks."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const rawText = completion.choices[0].message.content;
  return cleanHtmlOutput(rawText);
}

// Routes to the active AI provider (gemini / openai)
export async function generatePortfolioHtml(prompt) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase().trim();

  try {
    if (provider === "gemini") {
      return await generateWithGemini(prompt);
    } else if (provider === "openai") {
      return await generateWithOpenAI(prompt);
    } else {
      throw new Error(`Unsupported AI_PROVIDER "${provider}". Use 'gemini' or 'openai'.`);
    }
  } catch (error) {
    console.error("AI generation error:", error.message);
    throw new Error(`AI Generation Failed: ${error.message}`);
  }
}
