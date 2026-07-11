import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate JWT token helper
function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "super_secret_jwt_key_change_me_in_production_1234567890",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Validate inputs exist and are strings
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Name is required and must be a valid string." });
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ success: false, message: "Email is required and must be a valid string." });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({ success: false, message: "Password is required and must be a valid string." });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 2. Validate format criteria
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ success: false, message: "Name must be between 2 and 50 characters long." });
    }
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }
    if (trimmedPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    // 3. Check for existing user
    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    // 4. Create new User
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword
    });

    // 5. Generate session token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during account creation. Please try again."
    });
  }
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/signin
 * @access  Public
 */
export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs exist
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({ success: false, message: "Password is required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // 2. Validate email format briefly to avoid scanning db with malicious payloads
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    // 3. Find user in database
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      // Return a generic error message for security
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // 4. Match password
    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // 5. Generate session token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error("SignIn error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during authentication. Please try again."
    });
  }
}

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function getMe(req, res) {
  try {
    // req.user is set by the protect middleware
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not retrieve user session."
    });
  }
}
