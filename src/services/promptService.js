// Builds the prompt sent to the AI model to generate JSON review text
export function buildPrompt(profile, analysis, userData) {
  const developerData = {
    username: userData.github || profile.login,
    name: userData.name || profile.name || profile.login,
    title: userData.title || analysis.mainStack,
    location: userData.location || profile.location || "Remote / Global",
    aboutMe: userData.aboutMe || profile.bio || "Active software developer showcasing custom builds and engineering solutions.",
    selectedSkills: userData.selectedSkills || [],
    topRepositories: analysis.topRepositories || []
  };

  return `
You are a world-class "Senior Technical Recruiter".
Your task is to analyze the developer's profile details and write engaging, recruiters-eye narrative reviews and professional highlights.
You must return your output ONLY as a raw, valid JSON object matching the schema below. Do not wrap the JSON in markdown code blocks.

JSON Output Schema:
{
  "headline": "A short, recruiter-level professional headline for this developer (e.g. 'Full-Stack Architect Crafting Distributed Node.js & Database Systems' or similar, highly tailored to their stack and manual title '${developerData.title}')",
  "aboutMe": "An engaging, recruiter's-eye review paragraph (around 60-80 words) summarizing their background, coding style, and obvious strengths based on their repositories and bio. Make it sound highly encouraging, energetic, and professional.",
  "coreStrengths": [
    "Strength 1 (bullet point, professional highlight)",
    "Strength 2 (bullet point, professional highlight)",
    "Strength 3 (bullet point, professional highlight)"
  ],
  "growthPaths": [
    "Constructive skill/tech expansion advice 1 (friendly tip on what they should learn/explore next)",
    "Constructive skill/tech expansion advice 2 (friendly tip on what they should learn/explore next)"
  ],
  "careerPath": "Suggested career recommendation paragraph (around 30-40 words, e.g. 'Youssef looks well aligned for junior-to-mid full-stack roles...')"
}

Here is the developer's raw details:
=========================================
Name: ${developerData.name}
GitHub Username: ${developerData.username}
Location: ${developerData.location}
About Me / Bio: "${developerData.aboutMe}"
Professional Title: ${developerData.title}
Selected Skills & Technologies: ${developerData.selectedSkills.join(", ")}

Top Repositories:
${developerData.topRepositories.map((repo, i) => `
${i + 1}. [${repo.name}]
   - Description: ${repo.description}
   - Primary Language: ${repo.language}
   - Stars: ${repo.stars} | Forks: ${repo.forks}
`).join("\n")}
=========================================
`;
}
