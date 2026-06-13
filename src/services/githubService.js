import dotenv from "dotenv";
dotenv.config();

const GITHUB_API_URL = "https://api.github.com";

function getHeaders() {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "PortfolioGenie-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

// Fetch user profile
export async function getUser(username) {
  const url = `${GITHUB_API_URL}/users/${username}`;
  
  try {
    const response = await fetch(url, { headers: getHeaders() });
    
    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" not found.`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("getUser error:", error.message);
    throw error;
  }
}

// Fetch public repositories (up to 100, sorted by last updated, excludes forks)
export async function getRepositories(username) {
  const url = `${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=updated`;
  
  try {
    const response = await fetch(url, { headers: getHeaders() });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    const repos = await response.json();
    return repos.filter(repo => !repo.fork);
  } catch (error) {
    console.error("getRepositories error:", error.message);
    throw error;
  }
}

// Fetch language breakdown for a repo
export async function getLanguages(username, repoName) {
  const url = `${GITHUB_API_URL}/repos/${username}/${repoName}/languages`;
  
  try {
    const response = await fetch(url, { headers: getHeaders() });
    
    if (!response.ok) {
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`Could not fetch languages for ${repoName}:`, error.message);
    return {};
  }
}

// Aggregate stats: total stars, forks, and language bytes from top 8 repos
export async function getStatistics(username, repositories) {
  let totalStars = 0;
  let totalForks = 0;
  let totalSizeKB = 0;
  
  const languageStats = {};

  repositories.forEach(repo => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    totalSizeKB += repo.size || 0;
  });

  const prominentRepos = [...repositories]
    .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (b.size - a.size))
    .slice(0, 8);

  const languagePromises = prominentRepos.map(repo => getLanguages(username, repo.name));
  const languagesResults = await Promise.all(languagePromises);

  languagesResults.forEach(repoLanguages => {
    for (const [lang, bytes] of Object.entries(repoLanguages)) {
      languageStats[lang] = (languageStats[lang] || 0) + bytes;
    }
  });

  return {
    totalStars,
    totalForks,
    totalSizeKB,
    languageStats,
    analyzedReposCount: prominentRepos.length
  };
}
