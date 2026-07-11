import express from "express";
import { signUp, signIn, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/signin", signIn);

// Protected routes
router.get("/me", protect, getMe);

export default router;
