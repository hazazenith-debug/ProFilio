import fs from "fs";
import { getUser, getRepositories, getStatistics } from "../services/githubService.js";
import { analyzeDeveloperProfile } from "../services/analysisService.js";
import { buildPrompt } from "../services/promptService.js";
import { generatePortfolioHtml } from "../services/aiService.js";
import Portfolio from "../models/Portfolio.js";


// POST /api/portfolio/generate
export async function generatePortfolio(req, res) {
  const githubUsername = req.body.githubUsername || req.query.githubUsername;
  const theme = req.body.theme || req.query.theme;
  const name = req.body.name || req.query.name;
  const title = req.body.title || req.query.title;
  const email = req.body.email || req.query.email;
  const location = req.body.location || req.query.location;
  const aboutMe = req.body.aboutMe || req.query.aboutMe;
  const selectedSkills = req.body.selectedSkills || req.query.selectedSkills;

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

    // Cache Check: Check if theme already exists in database and inputs match
    const existingPortfolio = await Portfolio.findOne({ githubUsername: new RegExp(`^${trimmedUsername}$`, 'i') });
    if (existingPortfolio && existingPortfolio.generatedThemes && existingPortfolio.generatedThemes.get(selectedTheme)) {
      const reqSkills = Array.isArray(selectedSkills) ? selectedSkills : (selectedSkills ? selectedSkills.split(",") : []);
      const skillsMatch = Array.isArray(existingPortfolio.selectedSkills)
        ? reqSkills.length === existingPortfolio.selectedSkills.length && reqSkills.every(s => existingPortfolio.selectedSkills.includes(s))
        : true;

      const fieldsMatch =
        (!name || name.trim() === existingPortfolio.name) &&
        (!title || title.trim() === existingPortfolio.title) &&
        (!email || email.trim() === existingPortfolio.email) &&
        (!location || location.trim() === existingPortfolio.location) &&
        (!aboutMe || aboutMe.trim() === existingPortfolio.aboutMe) &&
        skillsMatch;

      if (fieldsMatch) {
        console.log(`[Cache Hit] Returning pre-generated theme: ${selectedTheme} for ${trimmedUsername}`);
        return res.status(200).json({
          success: true,
          metadata: {
            username: trimmedUsername,
            theme: selectedTheme,
            generatedAt: new Date().toISOString(),
            cached: true
          },
          portfolioHtml: existingPortfolio.generatedThemes.get(selectedTheme)
        });
      }
    }

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

    const userData = {
      github: trimmedUsername,
      name: name || profile.name || profile.login,
      title: title || analysis.mainStack,
      email: email || "",
      location: location || profile.location || "",
      aboutMe: aboutMe || profile.bio || "",
      selectedSkills: Array.isArray(selectedSkills) ? selectedSkills : (selectedSkills ? selectedSkills.split(",") : [])
    };

    const prompt = buildPrompt(profile, analysis, selectedTheme, userData);
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

/**
 * @desc    Save or update a generated portfolio
 * @route   POST /api/portfolio/save
 * @access  Private
 */
export async function savePortfolio(req, res) {
  try {
    const {
      githubUsername,
      theme,
      name,
      title,
      email,
      location,
      aboutMe,
      selectedSkills,
      portfolioHtml
    } = req.body;

    // 1. Validate required fields
    if (!githubUsername || typeof githubUsername !== "string" || githubUsername.trim() === "") {
      return res.status(400).json({ success: false, message: "githubUsername is required and must be a string." });
    }
    if (!theme || typeof theme !== "string" || theme.trim() === "") {
      return res.status(400).json({ success: false, message: "theme is required and must be a string." });
    }
    if (!portfolioHtml || typeof portfolioHtml !== "string" || portfolioHtml.trim() === "") {
      return res.status(400).json({ success: false, message: "portfolioHtml is required and must be a string." });
    }

    const allowedThemes = ["dark", "minimal", "cyberpunk", "glassmorphism"];
    if (!allowedThemes.includes(theme.toLowerCase().trim())) {
      return res.status(400).json({ success: false, message: `${theme} is not a valid theme.` });
    }

    // 2. Build the portfolio data
    const portfolioData = {
      userId: req.user._id,
      githubUsername: githubUsername.trim(),
      theme: theme.toLowerCase().trim(),
      name: typeof name === "string" ? name.trim() : "",
      title: typeof title === "string" ? title.trim() : "",
      email: typeof email === "string" ? email.trim() : "",
      location: typeof location === "string" ? location.trim() : "",
      aboutMe: typeof aboutMe === "string" ? aboutMe.trim() : "",
      selectedSkills: Array.isArray(selectedSkills) ? selectedSkills.map(s => String(s).trim()) : [],
      portfolioHtml: portfolioHtml
    };

    // 3. Upsert: if a portfolio with same githubUsername and userId exists, update it. Otherwise, create.
    const existing = await Portfolio.findOne({ userId: req.user._id, githubUsername: portfolioData.githubUsername });
    
    let generatedThemes = new Map();
    if (existing) {
      // Invalidate cache if inputs modified
      const skillsMatch = Array.isArray(portfolioData.selectedSkills) && Array.isArray(existing.selectedSkills)
        ? portfolioData.selectedSkills.length === existing.selectedSkills.length && portfolioData.selectedSkills.every(s => existing.selectedSkills.includes(s))
        : false;

      const inputsMatch =
        portfolioData.name === existing.name &&
        portfolioData.title === existing.title &&
        portfolioData.email === existing.email &&
        portfolioData.location === existing.location &&
        portfolioData.aboutMe === existing.aboutMe &&
        skillsMatch;

      if (inputsMatch && existing.generatedThemes) {
        generatedThemes = existing.generatedThemes;
      }
    }
    
    generatedThemes.set(portfolioData.theme, portfolioData.portfolioHtml);
    portfolioData.generatedThemes = generatedThemes;

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id, githubUsername: portfolioData.githubUsername },
      portfolioData,
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Portfolio saved successfully.",
      portfolio
    });
  } catch (error) {
    console.error("SavePortfolio error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving the portfolio."
    });
  }
}

/**
 * @desc    Get all portfolios saved by current user
 * @route   GET /api/portfolio/my-portfolios
 * @access  Private
 */
export async function getMyPortfolios(req, res) {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json({
      success: true,
      portfolios
    });
  } catch (error) {
    console.error("GetMyPortfolios error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving your portfolios."
    });
  }
}

/**
 * @desc    Delete a saved portfolio
 * @route   DELETE /api/portfolio/:id
 * @access  Private
 */
export async function deletePortfolio(req, res) {
  try {
    const portfolioId = req.params.id;

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found."
      });
    }

    // Ensure the portfolio belongs to the authenticated user
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this portfolio."
      });
    }

    await Portfolio.findByIdAndDelete(portfolioId);

    return res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully."
    });
  } catch (error) {
    console.error("DeletePortfolio error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the portfolio."
    });
  }
}

/**
 * @desc    Get a single portfolio by ID (Public)
 * @route   GET /api/portfolio/:id
 * @access  Public
 */
export async function getPortfolioById(req, res) {
  try {
    const portfolioId = req.params.id;

    // Check if valid ObjectId format to prevent Mongoose cast error crashes
    if (!portfolioId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID format."
      });
    }

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found."
      });
    }

    return res.status(200).json({
      success: true,
      portfolio
    });
  } catch (error) {
    console.error("GetPortfolioById error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the portfolio."
    });
  }
}


