import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Sparkles, RefreshCw } from "lucide-react";
import { PreviewToolbar } from "./PreviewToolbar";

export function PortfolioViewer() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [currentHtml, setCurrentHtml] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [regenerating, setRegenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // saved, saving, error, local

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch(`/api/portfolio/${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setPortfolio(data.portfolio);
          setCurrentHtml(data.portfolio.portfolioHtml);
          setSelectedTheme(data.portfolio.theme || "dark");
        } else {
          setError(data.message || "Failed to load portfolio.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Failed to load portfolio.");
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [id]);

  const handleThemeChange = async (newTheme) => {
    if (!portfolio) return;
    setSelectedTheme(newTheme);
    setRegenerating(true);
    setSaveStatus("saving");

    try {
      let targetHtml = "";

      // Check if theme already exists in fetched cache
      if (portfolio.generatedThemes && portfolio.generatedThemes[newTheme]) {
        console.log(`[Client Cache Hit] Loading pre-generated theme: ${newTheme}`);
        targetHtml = portfolio.generatedThemes[newTheme];
      } else {
        // Generate new HTML via AI / generator backend
        const genRes = await fetch("/api/portfolio/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            githubUsername: portfolio.githubUsername,
            theme: newTheme,
            name: portfolio.name,
            title: portfolio.title,
            email: portfolio.email,
            location: portfolio.location,
            aboutMe: portfolio.aboutMe,
            selectedSkills: portfolio.selectedSkills,
            aiHeadline: portfolio.aiHeadline,
            aiAboutMe: portfolio.aiAboutMe,
            aiCoreStrengths: portfolio.aiCoreStrengths,
            aiGrowthPaths: portfolio.aiGrowthPaths,
            aiCareerPath: portfolio.aiCareerPath,
            githubData: {
              avatarUrl: portfolio.avatarUrl,
              blog: portfolio.blog,
              followers: portfolio.followers,
              publicRepos: portfolio.publicRepos,
              activityLevel: portfolio.activityLevel,
              topRepositories: portfolio.topRepositories
            }
          })
        });

        const genData = await genRes.json();
        if (!genRes.ok || !genData.success) {
          throw new Error(genData.message || "Generation failed.");
        }
        targetHtml = genData.portfolioHtml;

        // Update local portfolio cache
        if (!portfolio.generatedThemes) {
          portfolio.generatedThemes = {};
        }
        portfolio.generatedThemes[newTheme] = targetHtml;
      }

      // Update iframe source
      setCurrentHtml(targetHtml);

      // 2. Persist updated portfolio to MongoDB if token exists
      const token = localStorage.getItem("token");
      if (token) {
        const saveRes = await fetch("/api/portfolio/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            githubUsername: portfolio.githubUsername,
            theme: newTheme,
            name: portfolio.name,
            title: portfolio.title,
            email: portfolio.email,
            location: portfolio.location,
            aboutMe: portfolio.aboutMe,
            selectedSkills: portfolio.selectedSkills,
            portfolioHtml: targetHtml,
            githubData: {
              avatarUrl: portfolio.avatarUrl,
              blog: portfolio.blog,
              followers: portfolio.followers,
              publicRepos: portfolio.publicRepos,
              activityLevel: portfolio.activityLevel,
              topRepositories: portfolio.topRepositories
            },
            aiData: {
              aiHeadline: portfolio.aiHeadline,
              aiAboutMe: portfolio.aiAboutMe,
              aiCoreStrengths: portfolio.aiCoreStrengths,
              aiGrowthPaths: portfolio.aiGrowthPaths,
              aiCareerPath: portfolio.aiCareerPath
            }
          })
        });

        const saveData = await saveRes.json();
        if (saveRes.ok && saveData.success) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } else {
        setSaveStatus("local"); // Unsaved preview
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentHtml || !portfolio) return;
    const blob = new Blob([currentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${portfolio.githubUsername}_portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, system-ui, sans-serif", background: "#f8fafc" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px"
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: "#64748b", fontWeight: 500 }}>Loading portfolio preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, system-ui, sans-serif", padding: "20px", textAlign: "center", background: "#f8fafc" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ color: "#1e293b", marginBottom: "8px", fontWeight: 700 }}>Could Not Load Portfolio</h2>
        <p style={{ color: "#64748b", maxWidth: "400px", marginBottom: "24px" }}>{error}</p>
        <Link to="/dashboard" style={{ padding: "10px 20px", background: "#3b82f6", color: "white", textDecoration: "none", borderRadius: "10px", fontWeight: "600" }}>
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" }}>
      <PreviewToolbar
        mode="viewer"
        username={portfolio.githubUsername}
        selectedTheme={selectedTheme}
        onThemeChange={(newTheme) => handleThemeChange(newTheme)}
        onDownload={handleDownload}
        isLoading={regenerating}
        viewerSaveStatus={saveStatus}
      />

      {/* Embedded Iframe View */}
      <div style={{ flexGrow: 1, position: "relative", width: "100%", background: "#f8fafc" }}>
        {regenerating && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(2px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "12px"
            }}></div>
            <p style={{ color: "#475569", fontWeight: 600, fontSize: "14px" }}>Regenerating with new theme...</p>
          </div>
        )}
        <iframe
          srcDoc={currentHtml}
          title={`Portfolio for ${portfolio.githubUsername}`}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>
    </div>
  );
}
