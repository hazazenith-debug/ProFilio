import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Sparkles, RefreshCw } from "lucide-react";

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
            selectedSkills: portfolio.selectedSkills
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
            portfolioHtml: targetHtml
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
      {/* Custom Preview Toolbar */}
      <div style={{
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)"
      }}>
        {/* Left Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/dashboard" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#475569",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            padding: "8px 12px",
            borderRadius: "8px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div style={{ height: "20px", width: "1px", background: "#e2e8f0" }}></div>
          <span style={{ fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} style={{ color: "#3b82f6" }} /> 
            Preview: <span style={{ color: "#64748b", fontWeight: 500 }}>@{portfolio.githubUsername}</span>
          </span>
        </div>

        {/* Center - Theme Selection */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label htmlFor="viewer-theme-select" style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>Theme:</label>
          <select
            id="viewer-theme-select"
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            disabled={regenerating}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#0f172a",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="dark">Dark Slate & Neon Accent</option>
            <option value="minimal">Scandinavian Monochromatic</option>
            <option value="cyberpunk">Neon Cybernetic Tech</option>
            <option value="glassmorphism">Frosted Glass Fluidity</option>
          </select>

          {/* Sync Status Badge */}
          <span style={{
            fontSize: "12px",
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: "9999px",
            background: saveStatus === "saving" ? "#fef3c7" : saveStatus === "saved" ? "#dcfce7" : saveStatus === "error" ? "#fee2e2" : "#f1f5f9",
            color: saveStatus === "saving" ? "#d97706" : saveStatus === "saved" ? "#15803d" : saveStatus === "error" ? "#b91c1c" : "#475569",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}>
            {saveStatus === "saving" && (
              <>
                <RefreshCw size={12} className="spin-icon" style={{ animation: "spin 1.5s linear infinite" }} />
                Regenerating & Saving...
              </>
            )}
            {saveStatus === "saved" && "✅ Saved to Cloud"}
            {saveStatus === "local" && "👁️ Temporary View"}
            {saveStatus === "error" && "⚠️ Sync Failed"}
          </span>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Right Side */}
        <div>
          <button
            onClick={handleDownload}
            disabled={regenerating}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1f2937"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#0f172a"}
          >
            <Download size={15} /> Download HTML
          </button>
        </div>
      </div>

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
