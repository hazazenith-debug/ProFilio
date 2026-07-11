import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    githubUsername: {
      type: String,
      required: [true, "GitHub username is required"],
      trim: true
    },
    theme: {
      type: String,
      required: [true, "Theme is required"],
      enum: {
        values: ["dark", "minimal", "cyberpunk", "glassmorphism"],
        message: "{VALUE} is not a supported theme"
      }
    },
    name: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    aboutMe: {
      type: String
    },
    selectedSkills: {
      type: [String],
      default: []
    },
    portfolioHtml: {
      type: String,
      required: [true, "Portfolio HTML content is required"]
    },
    generatedThemes: {
      type: Map,
      of: String,
      default: () => new Map()
    }
  },
  {
    timestamps: true
  }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
export default Portfolio;
