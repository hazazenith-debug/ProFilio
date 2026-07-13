import express from "express";
import {
  generatePortfolio,
  savePortfolio,
  getMyPortfolios,
  deletePortfolio,
  getPortfolioById
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/portfolio/generate (Protected)
router.post("/generate", protect, generatePortfolio);

// Protected Portfolio Database Actions
router.post("/save", protect, savePortfolio);
router.get("/my-portfolios", protect, getMyPortfolios);
router.delete("/:id", protect, deletePortfolio);

// Public Portfolio Retrieval
router.get("/:id", getPortfolioById);



export default router;
