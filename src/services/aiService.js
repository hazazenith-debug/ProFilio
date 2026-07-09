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

// Direct fetch connection to the configured free API endpoint
export async function generatePortfolioHtml(prompt) {
  const apiKey = process.env.FREE_API_KEY || "dummy-key";
  const apiEndpoint = process.env.FREE_API_ENDPOINT || "https://api.freemodel.dev/v1/chat/completions";
  const model = process.env.FREE_API_MODEL || "openai-t0";

  console.log(`\n[AI Generator] Connecting to API endpoint: ${apiEndpoint}`);
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
            content: "You are a professional web designer that writes beautiful, single-file, responsive HTML templates containing both structure and styled blocks."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
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

    return cleanHtmlOutput(rawText);
  } catch (error) {
    console.error("[AI Generator] Error:", error.message);
    throw new Error(`AI Generation Failed: ${error.message}`);
  }
}
