import dotenv from "dotenv";

dotenv.config();

// Helper to clean code blocks and parse JSON safely
function cleanAndParseJson(text) {
  if (!text) return null;
  
  let cleanText = text.trim();
  
  // Strip markdown code fences if they exist
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }
  
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  
  cleanText = cleanText.trim();
  
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("[JSON Parser Error] Failed to parse AI JSON response:", error.message);
    
    // Fallback: try to extract substring between first '{' and last '}'
    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const nestedJson = cleanText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(nestedJson);
      } catch (nestedErr) {
        console.error("[JSON Parser Fallback Error] Nested JSON parsing failed:", nestedErr.message);
      }
    }
    
    throw new Error(`AI generated invalid JSON: ${error.message}`);
  }
}

// Request and parse the structured recruiter insights in JSON format
export async function generateDeveloperInsights(prompt) {
  const apiKey = process.env.FREE_API_KEY || "dummy-key";
  const apiEndpoint = process.env.FREE_API_ENDPOINT || "https://api.freemodel.dev/v1/chat/completions";
  const model = process.env.FREE_API_MODEL || "openai-t1-sg";

  console.log(`\n[AI Generator] Querying API for JSON insights: ${apiEndpoint}`);
  console.log(`[AI Generator] Utilizing model: ${model}`);

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a professional technical recruiter. You return structured developer assessments strictly in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5 // Lower temperature for more structured, predictable JSON output
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    
    if (!rawText) {
      throw new Error("No response content returned from the API.");
    }

    return cleanAndParseJson(rawText);
  } catch (error) {
    console.error("[AI Generator] Error:", error.message);
    throw new Error(`AI Insight Generation Failed: ${error.message}`);
  }
}
