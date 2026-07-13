const LANGUAGE_CATEGORIES = {
  frontend: ["javascript", "typescript", "html", "css", "vue", "svelte", "scss", "less", "elm"],
  backend: ["python", "java", "go", "ruby", "c#", "php", "c++", "c", "rust", "kotlin", "swift", "scala", "elixir"],
  database: ["sql", "plsql", "tsql"],
  devops: ["dockerfile", "shell", "hcl", "yaml", "makefile", "nginx"]
};

const KEYWORDS = {
  frontend: ["react", "angular", "vue", "nextjs", "frontend", "css", "html", "tailwind", "bootstrap", "redux", "sass", "web", "ui", "ux", "styled-components", "responsive"],
  backend: ["api", "express", "django", "spring", "backend", "node", "fastapi", "laravel", "server", "rest", "graphql", "serverless", "jwt", "auth", "middleware"],
  database: ["database", "db", "sql", "mongo", "postgres", "mysql", "sqlite", "orm", "mongoose", "prisma", "firebase", "supabase", "dynamodb", "mariadb", "nosql", "redis"],
  devops: ["docker", "kubernetes", "ci/cd", "pipeline", "aws", "azure", "gcp", "jenkins", "actions", "deploy", "nginx", "terraform", "ansible", "heroku", "vercel", "github-actions"]
};

export function analyzeDeveloperProfile(repos, languageStats, selectedSkills) {
  let scores = {
    frontend: 15,
    backend: 15,
    database: 15,
    devops: 15
  };

  const detectedTech = new Set();

  // Analyze selected skills to boost category scores and ensure they are in detectedTech
  (selectedSkills || []).forEach(skill => {
    const skillLower = skill.toLowerCase().trim();
    let matched = false;

    for (const [category, languages] of Object.entries(LANGUAGE_CATEGORIES)) {
      if (languages.includes(skillLower)) {
        scores[category] += 15;
        detectedTech.add(skill);
        matched = true;
      }
    }

    for (const [category, keywords] of Object.entries(KEYWORDS)) {
      if (keywords.includes(skillLower) || skillLower.includes(category)) {
        scores[category] += 15;
        detectedTech.add(skill);
        matched = true;
      }
    }

    if (!matched) {
      if (skillLower.includes("sql") || skillLower.includes("db") || skillLower.includes("graph") || skillLower.includes("cache") || skillLower.includes("store")) {
        scores.database += 15;
      } else if (skillLower.includes("css") || skillLower.includes("style") || skillLower.includes("design") || skillLower.includes("web") || skillLower.includes("js") || skillLower.includes("ts") || skillLower.includes("react") || skillLower.includes("vue") || skillLower.includes("nuxt") || skillLower.includes("next")) {
        scores.frontend += 15;
      } else if (skillLower.includes("api") || skillLower.includes("server") || skillLower.includes("rest") || skillLower.includes("django") || skillLower.includes("spring") || skillLower.includes("nest") || skillLower.includes("koa") || skillLower.includes("fastapi")) {
        scores.backend += 15;
      } else if (skillLower.includes("docker") || skillLower.includes("kube") || skillLower.includes("ci") || skillLower.includes("cd") || skillLower.includes("aws") || skillLower.includes("cloud") || skillLower.includes("deploy") || skillLower.includes("nginx") || skillLower.includes("pipeline")) {
        scores.devops += 15;
      }
      detectedTech.add(skill);
    }
  });

  repos.forEach(repo => {
    const primaryLang = (repo.language || "").toLowerCase().trim();
    const description = (repo.description || "").toLowerCase();
    const name = (repo.name || "").toLowerCase();
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    const scanText = `${name} ${description} ${topics.join(" ")}`;

    for (const [category, languages] of Object.entries(LANGUAGE_CATEGORIES)) {
      if (languages.includes(primaryLang)) {
        scores[category] += 10;
        detectedTech.add(repo.language);
      }
    }

    for (const [category, keywords] of Object.entries(KEYWORDS)) {
      keywords.forEach(keyword => {
        if (scanText.includes(keyword)) {
          scores[category] += 15;
          
          if (keyword === "react") detectedTech.add("React");
          if (keyword === "angular") detectedTech.add("Angular");
          if (keyword === "vue") detectedTech.add("Vue.js");
          if (keyword === "nextjs") detectedTech.add("Next.js");
          if (keyword === "tailwind") detectedTech.add("TailwindCSS");
          if (keyword === "node") detectedTech.add("Node.js");
          if (keyword === "express") detectedTech.add("Express.js");
          if (keyword === "django") detectedTech.add("Django");
          if (keyword === "fastapi") detectedTech.add("FastAPI");
          if (keyword === "postgres") detectedTech.add("PostgreSQL");
          if (keyword === "mongo") detectedTech.add("MongoDB");
          if (keyword === "mysql") detectedTech.add("MySQL");
          if (keyword === "prisma") detectedTech.add("Prisma");
          if (keyword === "firebase") detectedTech.add("Firebase");
          if (keyword === "supabase") detectedTech.add("Supabase");
          if (keyword === "docker") detectedTech.add("Docker");
          if (keyword === "kubernetes") detectedTech.add("Kubernetes");
          if (keyword === "aws") detectedTech.add("AWS");
        }
      });
    }
  });

  // Cap scores at 100
  Object.keys(scores).forEach(category => {
    scores[category] = Math.min(scores[category], 100);
  });

  const sortedLanguages = Object.entries(languageStats || {})
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang)
    .slice(0, 5);

  if (sortedLanguages.length === 0) {
    const uniqueLangs = [...new Set(repos.map(r => r.language).filter(Boolean))];
    sortedLanguages.push(...uniqueLangs.slice(0, 5));
  }

  sortedLanguages.forEach(lang => detectedTech.add(lang));

  // Determine main stack
  let mainStack = "Full Stack";
  const maxScore = Math.max(scores.frontend, scores.backend, scores.database, scores.devops);
  if (maxScore > 30) {
    if (scores.frontend === maxScore) mainStack = "Frontend Developer";
    else if (scores.backend === maxScore && scores.database > 50) mainStack = "Backend & Database Developer";
    else if (scores.backend === maxScore) mainStack = "Backend Developer";
    else if (scores.devops === maxScore) mainStack = "DevOps Engineer";
  }

  // Activity level (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentUpdates = repos.filter(repo => {
    const updatedAt = new Date(repo.updated_at);
    return updatedAt >= thirtyDaysAgo;
  }).length;

  let activityLevel = "Low";
  if (recentUpdates >= 5) {
    activityLevel = "High";
  } else if (recentUpdates >= 2) {
    activityLevel = "Medium";
  }

  // Top 4 featured repos (by stars, forks, size)
  const topRepositories = [...repos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      if (b.forks_count !== a.forks_count) {
        return b.forks_count - a.forks_count;
      }
      return b.size - a.size;
    })
    .slice(0, 4)
    .map(repo => ({
      name: repo.name,
      description: repo.description || "No description provided.",
      url: repo.html_url,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || "Other",
      topics: repo.topics || []
    }));

  const skillLevels = calculateSkillLevels(selectedSkills, repos, languageStats);

  return {
    scores,
    mostUsedLanguages: sortedLanguages,
    detectedTechnologies: [...detectedTech].slice(0, 12),
    mainStack,
    activityLevel,
    topRepositories,
    skillLevels
  };
}

export function calculateSkillLevels(selectedSkills, repos, languageStats) {
  const repoList = Array.isArray(repos) ? repos : [];
  const stats = languageStats || {};

  return (selectedSkills || []).map(skill => {
    const skillLower = skill.toLowerCase().trim();
    let score = 70; // Base score

    // Check if skill matches repository primary language
    const primaryLangRepos = repoList.filter(r => (r.language || "").toLowerCase().trim() === skillLower);
    const repoCount = primaryLangRepos.length;

    // Check mentions in name, description, or topics
    const mentions = repoList.filter(r => {
      const name = (r.name || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      const topics = Array.isArray(r.topics) ? r.topics.map(t => String(t).toLowerCase()) : [];
      return name.includes(skillLower) || desc.includes(skillLower) || topics.includes(skillLower);
    });
    const mentionCount = mentions.length;

    // Check languageStats bytes
    let langBytes = 0;
    for (const [lang, bytes] of Object.entries(stats)) {
      if (lang.toLowerCase().trim() === skillLower) {
        langBytes = bytes;
        break;
      }
    }

    if (langBytes > 0) {
      score += 10;
      if (langBytes > 100000) score += 10;
      else if (langBytes > 20000) score += 5;
    }

    score += repoCount * 8;
    score += mentionCount * 4;

    // Cap the score realistically
    score = Math.min(Math.max(score, 60), 98);

    return {
      name: skill,
      level: score
    };
  });
}
