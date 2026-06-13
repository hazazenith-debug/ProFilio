export const themes = {
  dark: {
    name: "Dark Slate & Neon Accent",
    fontFamily: "'Inter', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap",
    colors: {
      background: "#0f172a",
      text: "#f8fafc",
      secondaryText: "#94a3b8",
      primaryAccent: "#3b82f6",
      secondaryAccent: "#10b981",
      cardBackground: "#1e293b",
      borderColor: "#334155"
    },
    styles: `
      body {
        background-color: #0f172a;
        color: #f8fafc;
      }
      .card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
      }
      .accent-gradient {
        background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .progress-bar-fill {
        background: linear-gradient(90deg, #3b82f6, #10b981);
      }
    `
  },
  minimal: {
    name: "Scandinavian Monochromatic",
    fontFamily: "'Outfit', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap",
    colors: {
      background: "#fafafa",
      text: "#111111",
      secondaryText: "#666666",
      primaryAccent: "#000000",
      secondaryAccent: "#555555",
      cardBackground: "#ffffff",
      borderColor: "#e5e5e5"
    },
    styles: `
      body {
        background-color: #fafafa;
        color: #111111;
      }
      .card {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        box-shadow: none;
        transition: border-color 0.2s, background-color 0.2s;
      }
      .card:hover {
        border-color: #111111;
        background-color: #fcfcfc;
      }
      .accent-gradient {
        color: #111111;
        font-weight: 700;
        border-bottom: 2px solid #111111;
      }
      .progress-bar-fill {
        background: #111111;
      }
    `
  },
  cyberpunk: {
    name: "Neon Cybernetic Tech",
    fontFamily: "'Share Tech Mono', monospace",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap",
    colors: {
      background: "#0a0a0f",
      text: "#00ffcc",
      secondaryText: "#a0a5c0",
      primaryAccent: "#ff007f",
      secondaryAccent: "#ffff00",
      cardBackground: "#12121f",
      borderColor: "#ff007f"
    },
    styles: `
      body {
        background-color: #0a0a0f;
        color: #00ffcc;
        text-shadow: 0 0 5px rgba(0, 255, 204, 0.3);
      }
      .card {
        background: #12121f;
        border: 2px solid #ff007f;
        border-radius: 0px;
        box-shadow: 0 0 10px rgba(255, 0, 127, 0.2);
        clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .card:hover {
        transform: scale(1.02);
        box-shadow: 0 0 20px rgba(255, 0, 127, 0.5), 0 0 10px rgba(0, 255, 204, 0.3);
        border-color: #ffff00;
      }
      .accent-gradient {
        background: linear-gradient(90deg, #ff007f 0%, #ffff00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: none;
      }
      .progress-bar-fill {
        background: linear-gradient(90deg, #ff007f, #ffff00);
        box-shadow: 0 0 8px rgba(255, 0, 127, 0.8);
      }
      button, a.btn {
        clip-path: polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px);
      }
    `
  },
  glassmorphism: {
    name: "Frosted Glass Fluidity",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&display=swap",
    colors: {
      background: "radial-gradient(circle at 10% 20%, rgba(98, 125, 250, 0.8) 0%, rgba(206, 137, 241, 0.8) 90.1%)",
      text: "#ffffff",
      secondaryText: "#e2e8f0",
      primaryAccent: "#ffffff",
      secondaryAccent: "#f472b6",
      cardBackground: "rgba(255, 255, 255, 0.12)",
      borderColor: "rgba(255, 255, 255, 0.25)"
    },
    styles: `
      body {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c084fc 100%);
        background-attachment: fixed;
        color: #ffffff;
        min-height: 100vh;
      }
      .card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 16px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
        transition: transform 0.2s, background 0.2s, border 0.2s;
      }
      .card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .accent-gradient {
        background: linear-gradient(to right, #ffffff, #f472b6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .progress-bar-fill {
        background: linear-gradient(90deg, #f472b6, #38bdf8);
      }
    `
  }
};

// Returns theme config, defaults to 'dark'
export function getThemeConfig(themeName) {
  const normalized = (themeName || "dark").toLowerCase().trim();
  return themes[normalized] || themes.dark;
}
