import express from "express";
import { generatePortfolio } from "../controllers/portfolioController.js";

const router = express.Router();

// POST /api/portfolio/generate
// Body: { githubUsername: "username", theme: "dark" | "minimal" | "cyberpunk" | "glassmorphism" }
router.post("/generate", generatePortfolio);

export default router;
