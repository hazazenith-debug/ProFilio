import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const viewDistPath = path.join(__dirname, "View", "dist");
app.use(express.static(viewDistPath));

// API endpoints
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/auth", authRoutes);


app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(viewDistPath, "index.html"), (err) => {
    if (err) {
      next();
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message);
  
  res.status(500).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred."
  });
});

export default app;
