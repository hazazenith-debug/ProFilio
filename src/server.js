import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/portfolio/generate`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed.");
  });
});
