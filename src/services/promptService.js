import { getThemeConfig } from "../utils/themeHelper.js";

// Builds the prompt sent to the AI model
export function buildPrompt(profile, analysis, themeName) {
  const theme = getThemeConfig(themeName);
  
  const developerData = {
    username: profile.login,
    name: profile.name || profile.login,
    avatarUrl: profile.avatar_url,
    bio: profile.bio || "Active software developer showcasing custom builds and engineering solutions.",
    location: profile.location || "Remote / Global",
    blog: profile.blog || "",
    followers: profile.followers || 0,
    publicRepos: profile.public_repos || 0,
    mainStack: analysis.mainStack,
    activityLevel: analysis.activityLevel,
    scores: analysis.scores,
    mostUsedLanguages: analysis.mostUsedLanguages,
    detectedTechnologies: analysis.detectedTechnologies,
    topRepositories: analysis.topRepositories
  };

  return `
You are a world-class "Senior Technical Recruiter and Portfolio Designer".
Your task is to analyze a developer's GitHub profile data, calculated metrics, and project aggregates, and design a gorgeous, ultra-modern, fully responsive single-file HTML portfolio page that is completely ready to render.

Here is the developer's computed profile data:
=========================================
Name: ${developerData.name}
GitHub Username: ${developerData.username}
Avatar URL: ${developerData.avatarUrl}
Location: ${developerData.location}
Bio: "${developerData.bio}"
Blog/Website: "${developerData.blog}"
Followers: ${developerData.followers}
Public Repositories Count: ${developerData.publicRepos}
Main Developer Profile: ${developerData.mainStack}
GitHub Activity Level: ${developerData.activityLevel}

Expertise Scores (0-100 scale):
- Frontend: ${developerData.scores.frontend}/100
- Backend: ${developerData.scores.backend}/100
- Database: ${developerData.scores.database}/100
- DevOps: ${developerData.scores.devops}/100

Primary Languages: ${developerData.mostUsedLanguages.join(", ")}
Detected Tech Stack: ${developerData.detectedTechnologies.join(", ")}

Top Repositories to Feature:
${developerData.topRepositories.map((repo, i) => `
${i + 1}. [${repo.name}]
   - Description: ${repo.description}
   - Primary Language: ${repo.language}
   - Stars: ${repo.stars} | Forks: ${repo.forks}
   - Project URL: ${repo.url}
`).join("\n")}
=========================================

YOUR VISUAL THEME AND STYLING DIRECTIVES:
=========================================
You must structure the page styling around the requested Theme: "${themeName.toUpperCase()}".
Use these theme design guidelines exactly to create a premium appearance:

1. Theme Name: ${theme.name}
2. Core Typography:
   - Load this font via Google Fonts in the <head>: ${theme.googleFontUrl}
   - Set Font Family to: ${theme.fontFamily}
3. Base Colors:
   - Primary Background: ${theme.colors.background}
   - Primary Text Color: ${theme.colors.text}
   - Secondary/Muted Text: ${theme.colors.secondaryText}
   - Core Accent: ${theme.colors.primaryAccent}
   - Supporting Accent: ${theme.colors.secondaryAccent}
   - Card Background: ${theme.colors.cardBackground}
   - Card Border: ${theme.colors.borderColor}
4. Custom Theme CSS Guidelines:
${theme.styles}
=========================================

PORTFOLIO CONTENT & STRUCTURAL REQUIREMENTS:
Your generated HTML must include the following structural sections:

1. **HERO SECTION**:
   - Display a professional, eye-catching title like "PortfolioGenie Profile".
   - Include a premium, modern headshot layout featuring the GitHub avatar: "${developerData.avatarUrl}".
   - Write a recruiter-level "Professional Headline" for this developer (e.g., "Full-Stack Architect Crafting Distributed Node.js & Database Systems" or similar, highly tailored to their high scores).
   - Display key metadata (Location, followers count, public repositories count) in custom chips.
   - Clean social action links (GitHub profile button, blog/website button if present).

2. **ABOUT ME**:
   - Write an engaging, recruiters-eye review summarizing their background, coding style, and obvious strengths based on their repositories. Make it sound highly encouraging, energetic, and professional!

3. **TECHNICAL EXPERTISE (SCORES)**:
   - Display the computed skills as beautiful progress gauges or custom-styled progress bars (using the class names provided in the Theme CSS: ".card", ".progress-bar-fill", etc.).
   - Make the gauges look extremely sleek (rounded bar ends, elegant numeric readouts, and clear labels for Frontend, Backend, Database, and DevOps).
   - Create a clean "Tags/Chips" grid for all the detected technologies: ${developerData.detectedTechnologies.join(", ")}.

4. **FEATURED PROJECTS (TOP REPOSITORIES)**:
   - Display the 4 repositories in a balanced 2x2 grid (or single column on mobile).
   - Each card must display the repository name, description, primary language (styled in a small badge), stars count, and forks count.
   - Add a high-fidelity "View Project" or "GitHub Source" button that opens their repository url in a new tab (using target="_blank").
   - Ensure the card hover styles match the theme guidelines.

5. **RECRUITER REVIEW & INSIGHTS**:
   - Create a designated card for "Recruiter Insights" divided into:
     *   **Core Strengths**: 3 bulleted insights on what makes this developer stand out based on their stack.
     *   **Suggested Growth Paths**: 2 constructive, friendly tips on technologies they should explore next to level up their scores.
     *   **Suggested Career Path**: A short recruiter recommendation paragraph (e.g., "Excellent candidate for scaling enterprise cloud APIs").

6. **FOOTER**:
   - Link back to their GitHub profile.
   - Include a tag "Generated with ⚡ PortfolioGenie" to attribute the platform.

CRITICAL CODE CONSTRAINTS:
- You must return ONLY the complete raw, valid HTML output.
- DO NOT wrap the output in markdown tick blocks (such as \`\`\`html ... \`\`\`). Your response must start directly with "<!DOCTYPE html>" and end with "</html>".
- Keep all CSS in a single <style> tag in the head. No external CSS files.
- Absolutely NO external JavaScript scripts or libraries (you may use FontAwesome icons via cdn if you want visual social icons, e.g., "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css").
- Make sure the HTML is fully responsive (works on Mobile, Tablet, and Desktop using proper flex and grid viewport handling, like max-width wrappers, meta viewport tags, and box-sizing reset).
- Make the portfolio look like a premium, state-of-the-art developer platform.
`;
}
