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
    skillLevels: {
      type: [mongoose.Schema.Types.Mixed],
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
    },
    // Cached GitHub data fields
    avatarUrl: {
      type: String,
      default: ""
    },
    blog: {
      type: String,
      default: ""
    },
    followers: {
      type: Number,
      default: 0
    },
    publicRepos: {
      type: Number,
      default: 0
    },
    activityLevel: {
      type: String,
      default: "Active"
    },
    topRepositories: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    // AI Generated Text Fields
    aiHeadline: {
      type: String,
      default: ""
    },
    aiAboutMe: {
      type: String,
      default: ""
    },
    aiCoreStrengths: {
      type: [String],
      default: []
    },
    aiGrowthPaths: {
      type: [String],
      default: []
    },
    aiCareerPath: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
export default Portfolio;
