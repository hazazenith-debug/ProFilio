import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PortfolioGenie API is running."
  });
});

// Portfolio endpoints
app.use("/api/portfolio", portfolioRoutes);

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
