import { getUser, getRepositories, getStatistics } from "../services/githubService.js";
import { analyzeDeveloperProfile } from "../services/analysisService.js";
import { buildPrompt } from "../services/promptService.js";
import { generateDeveloperInsights } from "../services/aiService.js";
import { renderPortfolioHtml } from "../services/templateService.js";
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

    // Check if we have the AI generated insights and GitHub data in the request body or in MongoDB
    let aiHeadline = req.body.aiHeadline;
    let aiAboutMe = req.body.aiAboutMe;
    let aiCoreStrengths = req.body.aiCoreStrengths;
    let aiGrowthPaths = req.body.aiGrowthPaths;
    let aiCareerPath = req.body.aiCareerPath;
    let githubData = req.body.githubData;

    const existingPortfolio = await Portfolio.findOne({ githubUsername: new RegExp(`^${trimmedUsername}$`, 'i') });

    // Fallback to database cache if body is missing the data
    if (!aiHeadline && existingPortfolio && existingPortfolio.aiHeadline) {
      console.log(`[DB Cache Hit] Retrieving AI recruiter insights for ${trimmedUsername} from DB`);
      aiHeadline = existingPortfolio.aiHeadline;
      aiAboutMe = existingPortfolio.aiAboutMe;
      aiCoreStrengths = existingPortfolio.aiCoreStrengths;
      aiGrowthPaths = existingPortfolio.aiGrowthPaths;
      aiCareerPath = existingPortfolio.aiCareerPath;
    }

    if (!githubData && existingPortfolio && existingPortfolio.avatarUrl) {
      console.log(`[DB Cache Hit] Retrieving GitHub user statistics for ${trimmedUsername} from DB`);
      githubData = {
        avatarUrl: existingPortfolio.avatarUrl,
        blog: existingPortfolio.blog || "",
        followers: existingPortfolio.followers || 0,
        publicRepos: existingPortfolio.publicRepos || 0,
        activityLevel: existingPortfolio.activityLevel || "Active",
        topRepositories: existingPortfolio.topRepositories || []
      };
    }

    let portfolioHtml;

    // If we have both AI insights and GitHub data, render the template instantly
    if (aiHeadline && githubData) {
      console.log(`[Template Engine] Rendering portfolio HTML instantly for theme: ${selectedTheme}`);
      
      const renderData = {
        theme: selectedTheme,
        name: name || existingPortfolio?.name || trimmedUsername,
        title: title || existingPortfolio?.title || "Software Engineer",
        email: email || existingPortfolio?.email || "",
        location: location || existingPortfolio?.location || "Remote / Global",
        aboutMe: aboutMe || existingPortfolio?.aboutMe || "",
        selectedSkills: Array.isArray(selectedSkills) 
          ? selectedSkills 
          : (selectedSkills ? selectedSkills.split(",") : (existingPortfolio?.selectedSkills || [])),
        githubUsername: trimmedUsername,
        avatarUrl: githubData.avatarUrl,
        blog: githubData.blog,
        followers: githubData.followers,
        publicRepos: githubData.publicRepos,
        activityLevel: githubData.activityLevel,
        topRepositories: githubData.topRepositories,
        aiHeadline,
        aiAboutMe,
        aiCoreStrengths,
        aiGrowthPaths,
        aiCareerPath
      };

      portfolioHtml = renderPortfolioHtml(renderData);
    } else {
      // Cache Miss: We need to fetch GitHub data and call the AI for the JSON insights
      console.log(`[Cache Miss] Querying GitHub API and AI for new developer insights: ${trimmedUsername}`);
      
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

      const parsedSkills = Array.isArray(selectedSkills)
        ? selectedSkills
        : (selectedSkills ? selectedSkills.split(",") : []);

      const userData = {
        github: trimmedUsername,
        name: name || profile.name || profile.login,
        title: title || analysis.mainStack,
        email: email || "",
        location: location || profile.location || "",
        aboutMe: aboutMe || profile.bio || "",
        selectedSkills: parsedSkills
      };

      const prompt = buildPrompt(profile, analysis, userData);
      const aiInsights = await generateDeveloperInsights(prompt);

      aiHeadline = aiInsights.headline;
      aiAboutMe = aiInsights.aboutMe;
      aiCoreStrengths = aiInsights.coreStrengths;
      aiGrowthPaths = aiInsights.growthPaths;
      aiCareerPath = aiInsights.careerPath;

      githubData = {
        avatarUrl: profile.avatar_url,
        blog: profile.blog || "",
        followers: profile.followers || 0,
        publicRepos: profile.public_repos || 0,
        activityLevel: analysis.activityLevel || "Active",
        topRepositories: analysis.topRepositories || []
      };

      const renderData = {
        theme: selectedTheme,
        name: userData.name,
        title: userData.title,
        email: userData.email,
        location: userData.location,
        aboutMe: userData.aboutMe,
        selectedSkills: userData.selectedSkills,
        githubUsername: trimmedUsername,
        avatarUrl: githubData.avatarUrl,
        blog: githubData.blog,
        followers: githubData.followers,
        publicRepos: githubData.publicRepos,
        activityLevel: githubData.activityLevel,
        topRepositories: githubData.topRepositories,
        aiHeadline,
        aiAboutMe,
        aiCoreStrengths,
        aiGrowthPaths,
        aiCareerPath
      };

      portfolioHtml = renderPortfolioHtml(renderData);
    }



    console.log(`--- Portfolio Generation Completed for "${trimmedUsername}" ---\n`);

    // Response: { success, metadata, githubData, aiData, portfolioHtml }
    return res.status(200).json({
      success: true,
      metadata: {
        username: trimmedUsername,
        theme: selectedTheme,
        generatedAt: new Date().toISOString()
      },
      githubData,
      aiData: {
        aiHeadline,
        aiAboutMe,
        aiCoreStrengths,
        aiGrowthPaths,
        aiCareerPath
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
      portfolioHtml,
      githubData,
      aiData
    } = req.body;

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

    const existing = await Portfolio.findOne({ userId: req.user._id, githubUsername: githubUsername.trim() });

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
      portfolioHtml: portfolioHtml,

      avatarUrl: githubData?.avatarUrl || existing?.avatarUrl || "",
      blog: githubData?.blog || existing?.blog || "",
      followers: githubData?.followers || existing?.followers || 0,
      publicRepos: githubData?.publicRepos || existing?.publicRepos || 0,
      activityLevel: githubData?.activityLevel || existing?.activityLevel || "Active",
      topRepositories: githubData?.topRepositories || existing?.topRepositories || [],

      aiHeadline: aiData?.aiHeadline || existing?.aiHeadline || "",
      aiAboutMe: aiData?.aiAboutMe || existing?.aiAboutMe || "",
      aiCoreStrengths: aiData?.aiCoreStrengths || existing?.aiCoreStrengths || [],
      aiGrowthPaths: aiData?.aiGrowthPaths || existing?.aiGrowthPaths || [],
      aiCareerPath: aiData?.aiCareerPath || existing?.aiCareerPath || ""
    };

    let generatedThemes = new Map();
    if (existing) {
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


export async function getPortfolioById(req, res) {
  try {
    const portfolioId = req.params.id;

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


