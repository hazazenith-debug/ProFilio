import fs from "fs";
import { getUser, getRepositories, getStatistics } from "../services/githubService.js";
import { analyzeDeveloperProfile } from "../services/analysisService.js";
import { buildPrompt } from "../services/promptService.js";
import { generatePortfolioHtml } from "../services/aiService.js";

// POST /api/portfolio/generate
export async function generatePortfolio(req, res) {
  const githubUsername = req.body.githubUsername || req.query.githubUsername;
  const theme = req.body.theme || req.query.theme;

  if (!githubUsername || typeof githubUsername !== "string" || githubUsername.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "githubUsername is required in the request body or query parameters."
    });
  }

  const allowedThemes = ["dark", "minimal", "cyberpunk", "glassmorphism"];
  const selectedTheme = allowedThemes.includes((theme || "").toLowerCase().trim()) 
    ? theme.toLowerCase().trim() 
    : "dark";

  const trimmedUsername = githubUsername.trim();

  try {
    console.log(`\n--- Starting Portfolio Generation for "${trimmedUsername}" [Theme: ${selectedTheme}] ---`);

    const profile = await getUser(trimmedUsername);
    const repos = await getRepositories(trimmedUsername);

    if (!repos || repos.length === 0) {
      return res.status(400).json({
        success: false,
        message: `GitHub user "${trimmedUsername}" has no public repositories.`
      });
    }

    const statistics = await getStatistics(trimmedUsername, repos);
    const analysis = analyzeDeveloperProfile(repos, statistics.languageStats);
    const prompt = buildPrompt(profile, analysis, selectedTheme);
    const portfolioHtml = await generatePortfolioHtml(prompt);

    // Save HTML to file for preview
    fs.writeFileSync("portfolio.html", portfolioHtml);
    console.log(`✅ HTML saved to portfolio.html`);

    console.log(`--- Portfolio Generation Completed for "${trimmedUsername}" ---\n`);

    // Response: { success, metadata, portfolioHtml }
    return res.status(200).json({
      success: true,
      metadata: {
        username: trimmedUsername,
        theme: selectedTheme,
        generatedAt: new Date().toISOString()
      },
      portfolioHtml
    });

  } catch (error) {
    console.error(`Error:`, error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: `GitHub user "${trimmedUsername}" not found.`
      });
    }

    return res.status(500).json({
      success: false,
      message: `Failed to generate portfolio: ${error.message}`
    });
  }
}
