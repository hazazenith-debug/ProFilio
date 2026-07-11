import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  let token;

  // Check for Token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authorized: Token missing"
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_jwt_key_change_me_in_production_1234567890");

      // Get user from the token, excluding the password field
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized: User no longer exists"
        });
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized: Token is invalid or expired"
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized: No token provided"
    });
  }
}
