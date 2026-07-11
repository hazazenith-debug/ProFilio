import { getThemeConfig } from "../utils/themeHelper.js";

// Professional subtitles for common skill categories to mimic high-end recruiter output
function getSkillSubtitle(skill) {
  const norm = (skill || "").toLowerCase().trim();
  if (norm.includes("react")) return "Interface Engineering";
  if (norm.includes("typescript") || norm.includes("ts")) return "Typed Application Design";
  if (norm.includes("javascript") || norm.includes("js")) return "Application Scripting";
  if (norm.includes("node")) return "Backend Services";
  if (norm.includes("python")) return "Data & Service Design";
  if (norm.includes("postgres") || norm.includes("sql")) return "Relational Data Modeling";
  if (norm.includes("mongo")) return "Document Databases";
  if (norm.includes("css") || norm.includes("style")) return "Layout & Styling";
  if (norm.includes("html") || norm.includes("markup")) return "Semantic Layouts";
  if (norm.includes("go") || norm.includes("golang")) return "Systems & API Design";
  if (norm.includes("docker") || norm.includes("container")) return "Container Orchestration";
  if (norm.includes("java")) return "Enterprise Engineering";
  if (norm.includes("c++") || norm.includes("cpp")) return "System Programming";
  return "Professional Competency";
}

export function renderPortfolioHtml(data) {
  const theme = getThemeConfig(data.theme);

  // Deterministic skill level bars (88%, 84%, 82%, etc.) to keep layout clean
  const defaultLevels = [88, 84, 82, 78, 76, 74];
  const skillsWithLevels = (data.selectedSkills || []).map((skill, index) => ({
    name: skill,
    level: defaultLevels[index % defaultLevels.length],
    subtitle: getSkillSubtitle(skill)
  }));

  // Ensure arrays exist
  const coreStrengths = data.aiCoreStrengths || [];
  const growthPaths = data.aiGrowthPaths || [];
  const repos = data.topRepositories || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.name} | PortfolioGenie Profile</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.googleFontUrl}" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      font-family:${theme.fontFamily};
      background-color:${theme.colors.background};
      color:${theme.colors.text};
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    a{color:inherit;text-decoration:none}
    img{max-width:100%;display:block}
    .wrap{width:min(1180px,calc(100% - 32px));margin:0 auto}
    .accent-gradient{
      background:linear-gradient(135deg,#3b82f6 0%,#10b981 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
    .muted{color:${theme.colors.secondaryText}}
    .section{padding:32px 0}
    .section-title{
      margin:0 0 18px;
      font-size:.95rem;
      font-weight:700;
      letter-spacing:.08em;
      text-transform:uppercase;
      color:${theme.colors.secondaryText};
    }
    .card{
      background:${theme.colors.cardBackground};
      border:1px solid ${theme.colors.borderColor};
      border-radius:12px;
      box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06);
      transition:transform .2s,box-shadow .2s,border-color .2s;
    }
    .card:hover{
      transform:translateY(-4px);
      box-shadow:0 10px 15px -3px rgba(59,130,246,.2);
      border-color:${theme.colors.primaryAccent};
    }
    .hero{
      min-height:100vh;
      display:flex;
      align-items:center;
      padding:44px 0 24px;
    }
    .hero-grid{
      display:grid;
      grid-template-columns:1.2fr .8fr;
      gap:24px;
      align-items:stretch;
    }
    .hero-copy,.hero-side{padding:28px}
    .hero-copy{
      position:relative;
      overflow:hidden;
      background:
        linear-gradient(180deg,rgba(59,130,246,.08),rgba(30,41,59,.96)),
        ${theme.colors.cardBackground};
    }
    .hero-side{
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      gap:18px;
    }
    .eyebrow{
      display:inline-flex;
      align-items:center;
      gap:10px;
      margin-bottom:16px;
      padding:8px 12px;
      border-radius:999px;
      background:rgba(59,130,246,.12);
      border:1px solid rgba(59,130,246,.22);
      color:#bfdbfe;
      font-size:.9rem;
      font-weight:600;
    }
    h1{
      margin:0 0 14px;
      font-size:clamp(2.4rem,4vw,4.25rem);
      line-height:1.02;
      font-weight:800;
      letter-spacing:0;
    }
    .headline{
      margin:0 0 22px;
      max-width:62ch;
      color:${theme.colors.secondaryText};
      font-size:1.02rem;
      line-height:1.75;
    }
    .meta-chips,.skill-chips,.socials{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
    }
    .chip{
      min-height:42px;
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:10px 14px;
      border-radius:999px;
      border:1px solid ${theme.colors.borderColor};
      background:rgba(15,23,42,.55);
      color:${theme.colors.text};
      font-size:.9rem;
      font-weight:500;
    }
    .socials{margin-top:20px}
    .btn{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:10px;
      min-height:46px;
      padding:0 16px;
      border-radius:10px;
      border:1px solid rgba(59,130,246,.35);
      background:linear-gradient(135deg,rgba(59,130,246,.18),rgba(16,185,129,.14));
      color:${theme.colors.text};
      font-weight:600;
      transition:.2s ease;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.04);
    }
    .btn:hover{
      border-color:${theme.colors.primaryAccent};
      box-shadow:0 10px 20px rgba(59,130,246,.18);
    }
    .avatar-shell{
      padding:16px;
      border-radius:12px;
      border:1px solid ${theme.colors.borderColor};
      background:linear-gradient(180deg,rgba(59,130,246,.12),rgba(16,185,129,.08));
    }
    .avatar{
      width:100%;
      aspect-ratio:1/1;
      object-fit:cover;
      border-radius:10px;
      border:1px solid rgba(148,163,184,.24);
    }
    .scan{
      display:grid;
      gap:10px;
      grid-template-columns:repeat(2,minmax(0,1fr));
    }
    .scan-item{
      padding:14px;
      border-radius:10px;
      border:1px solid ${theme.colors.borderColor};
      background:rgba(15,23,42,.55);
    }
    .scan-item span{
      display:block;
      margin-bottom:6px;
      font-size:.8rem;
      color:${theme.colors.secondaryText};
    }
    .scan-item strong{
      display:block;
      color:${theme.colors.text};
      font-size:.98rem;
      line-height:1.45;
      font-weight:600;
    }
    .about-grid,.insights-grid{
      display:grid;
      grid-template-columns:1.05fr .95fr;
      gap:24px;
    }
    .panel{padding:24px}
    .about-text,.project-desc,.career,.bullet-list{
      color:${theme.colors.text};
      line-height:1.8;
    }
    .about-text,.project-desc,.career{margin:0}
    .skills{
      display:grid;
      gap:14px;
    }
    .skill{
      display:grid;
      gap:8px;
    }
    .skill-top{
      display:flex;
      justify-content:space-between;
      gap:12px;
      font-size:.95rem;
      font-weight:600;
    }
    .bar{
      height:10px;
      overflow:hidden;
      border-radius:999px;
      background:rgba(148,163,184,.16);
      border:1px solid rgba(148,163,184,.12);
    }
    .progress-bar-fill{
      height:100%;
      background:linear-gradient(90deg,#3b82f6,#10b981);
    }
    .projects{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:20px;
    }
    .project-card{
      padding:22px;
      display:flex;
      flex-direction:column;
      gap:16px;
      min-height:260px;
    }
    .project-top{
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:flex-start;
    }
    .repo{
      margin:0;
      color:${theme.colors.text};
      font-size:1.08rem;
      line-height:1.35;
      font-weight:700;
      word-break:break-word;
    }
    .lang{
      padding:7px 10px;
      border-radius:999px;
      border:1px solid rgba(16,185,129,.26);
      background:rgba(16,185,129,.12);
      color:#6ee7b7;
      font-size:.78rem;
      font-weight:700;
      white-space:nowrap;
    }
    .stats{
      display:flex;
      flex-wrap:wrap;
      gap:14px;
      color:${theme.colors.secondaryText};
      font-size:.92rem;
    }
    .stats span{display:inline-flex;align-items:center;gap:8px}
    .bullet-list{
      margin:0;
      padding-left:18px;
    }
    .subhead{
      margin:0 0 10px;
      color:${theme.colors.text};
      font-size:1rem;
      font-weight:700;
    }
    footer{
      padding:18px 0 34px;
      margin-top:10px;
      border-top:1px solid ${theme.colors.borderColor};
    }
    .footer-row{
      display:flex;
      justify-content:space-between;
      align-items:center;
      flex-wrap:wrap;
      gap:16px;
      color:${theme.colors.secondaryText};
      font-size:.92rem;
    }
    .footer-row a{color:#bfdbfe}
    @media (max-width:960px){
      .hero{min-height:auto;padding-top:28px}
      .hero-grid,.about-grid,.insights-grid,.projects{grid-template-columns:1fr}
    }
    @media (max-width:640px){
      .wrap{width:min(100% - 20px,1180px)}
      .hero-copy,.hero-side,.panel,.project-card{padding:18px}
      .scan{grid-template-columns:1fr}
      .project-top,.skill-top,.footer-row{flex-direction:column;align-items:flex-start}
      .btn{width:100%}
      .socials{display:grid;grid-template-columns:1fr}
    }

    /* Custom Theme Overrides */
    ${theme.styles}
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="card hero-copy">
          <div class="eyebrow"><i class="fa-solid fa-bolt"></i><span>PortfolioGenie Profile</span></div>
          <h1><span class="accent-gradient">${data.name}</span></h1>
          <p class="headline">${data.aiHeadline || "Professional software developer."}</p>
          <div class="meta-chips">
            <div class="chip"><i class="fa-solid fa-location-dot"></i>${data.location || "Remote / Global"}</div>
            <div class="chip"><i class="fa-solid fa-user-group"></i>${data.followers || 0} Followers</div>
            <div class="chip"><i class="fa-solid fa-code-branch"></i>${data.publicRepos || 0} Public Repos</div>
            <div class="chip"><i class="fa-solid fa-wave-square"></i>Activity: ${data.activityLevel || "Active"}</div>
          </div>
          <div class="socials">
            <a class="btn" href="https://github.com/${data.githubUsername}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i>GitHub Profile</a>
            ${data.email ? `<a class="btn" href="mailto:${data.email}"><i class="fa-solid fa-envelope"></i>Email Contact</a>` : ""}
          </div>
        </div>
        <aside class="card hero-side">
          <div class="avatar-shell">
            <img class="avatar" src="${data.avatarUrl || "https://avatars.githubusercontent.com/u/9919?v=4"}" alt="${data.name} avatar">
          </div>
          <div class="scan">
            <div class="scan-item"><span>Role</span><strong>${data.title || "Software Engineer"}</strong></div>
            <div class="scan-item"><span>Primary Stack</span><strong>${(data.selectedSkills || []).slice(0, 2).join(" / ") || "Developer"}</strong></div>
            <div class="scan-item"><span>Data Layer</span><strong>${(data.selectedSkills || []).includes("MongoDB") || (data.selectedSkills || []).includes("PostgreSQL") ? "PostgreSQL / MongoDB" : "Cloud / Web"}</strong></div>
            <div class="scan-item"><span>Focus</span><strong>Custom Engineering Solutions</strong></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="wrap about-grid">
        <div class="card panel">
          <h2 class="section-title">About Me</h2>
          <p class="about-text">${data.aiAboutMe || data.aboutMe || "Developer building modern applications."}</p>
        </div>
        <div class="card panel">
          <h2 class="section-title">Technical Expertise</h2>
          <div class="skills">
            ${skillsWithLevels.map(skill => `
            <div class="skill">
              <div class="skill-top"><span>${skill.name}</span><span class="muted">${skill.subtitle}</span></div>
              <div class="bar"><div class="progress-bar-fill" style="width:${skill.level}%"></div></div>
            </div>
            `).join("")}
          </div>
          ${skillsWithLevels.length > 0 ? `
          <div class="skill-chips" style="margin-top:16px">
            ${skillsWithLevels.map(skill => `<div class="chip">${skill.name}</div>`).join("")}
          </div>
          ` : ""}
        </div>
      </div>
    </section>

    ${repos.length > 0 ? `
    <section class="section">
      <div class="wrap">
        <h2 class="section-title">Featured Projects</h2>
        <div class="projects">
          ${repos.map(repo => `
          <article class="card project-card">
            <div class="project-top">
              <h3 class="repo">${repo.name}</h3>
              <span class="lang">${repo.language || "Code"}</span>
            </div>
            <p class="project-desc">${repo.description || "Active repository containing source code and custom developer builds."}</p>
            <div class="stats">
              <span><i class="fa-solid fa-star"></i>${repo.stars || 0} Stars</span>
              <span><i class="fa-solid fa-code-fork"></i>${repo.forks || 0} Forks</span>
            </div>
            <a class="btn" href="${repo.url || `https://github.com/${data.githubUsername}/${repo.name}`}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i>GitHub Source</a>
          </article>
          `).join("")}
        </div>
      </div>
    </section>
    ` : ""}

    <section class="section">
      <div class="wrap insights-grid">
        <div class="card panel">
          <h2 class="section-title">Recruiter Insights</h2>
          <h3 class="subhead">Core Strengths</h3>
          <ul class="bullet-list">
            ${coreStrengths.length > 0 ? coreStrengths.map(s => `<li>${s}</li>`).join("") : "<li>Demonstrates continuous professional learning and code iteration.</li>"}
          </ul>
        </div>
        <div class="card panel">
          <h3 class="subhead">Suggested Growth Paths</h3>
          <ul class="bullet-list" style="margin-bottom:18px">
            ${growthPaths.length > 0 ? growthPaths.map(s => `<li>${s}</li>`).join("") : "<li>Deepen backend API standards and microservices architecture.</li>"}
          </ul>
          <h3 class="subhead">Suggested Career Path</h3>
          <p class="career">${data.aiCareerPath || "Well-suited for modern software development and full-stack product engineering teams."}</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap footer-row">
      <a href="https://github.com/${data.githubUsername}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> github.com/${data.githubUsername}</a>
      <span>Generated with ⚡ PortfolioGenie</span>
    </div>
  </footer>
</body>
</html>`;
}
