import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Eye, Download, Trash2, ArrowRight } from "lucide-react";
import "./Dashboard.css";

export function Dashboard() {
  const { user, loading } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    async function fetchPortfolios() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("/api/portfolio/my-portfolios", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setPortfolios(data.portfolios);
        } else {
          setError(data.message || "Failed to load portfolios.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Failed to load portfolios.");
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      fetchPortfolios();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this saved portfolio?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPortfolios(portfolios.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Failed to delete portfolio.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the portfolio.");
    }
  };

  const handleDownload = (portfolio) => {
    const blob = new Blob([portfolio.portfolioHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${portfolio.githubUsername}_portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || (user && fetching)) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Manage your saved developer portfolios and preview links.</p>
        </div>
        <Link to="/builder" className="btn-create-new">
          ⚡ Build New Portfolio
        </Link>
      </div>

      {error && <div className="dashboard-error">⚠️ {error}</div>}

      {!fetching && portfolios.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">📂</div>
          <h2>No portfolios saved yet</h2>
          <p>Create a beautiful AI portfolio by importing your GitHub profile now.</p>
          <Link to="/builder" className="btn-empty-action">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="portfolios-grid">
          {portfolios.map((portfolio) => (
            <div key={portfolio._id} className="portfolio-card">
              <div className="card-header">
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "65%" }}>
                  {portfolio.generatedThemes ? (
                    Object.keys(portfolio.generatedThemes).map(themeName => {
                      const isActive = themeName === portfolio.theme;
                      return (
                        <span 
                          key={themeName} 
                          className={`theme-badge ${isActive ? themeName : 'inactive'}`} 
                          title={isActive ? "Active Theme" : "Pre-generated Theme (Loads Instantly!)"}
                        >
                          {themeName.toUpperCase()}{isActive && " •"}
                        </span>
                      );
                    })
                  ) : (
                    <span className={`theme-badge ${portfolio.theme}`}>
                      {portfolio.theme.toUpperCase()} •
                    </span>
                  )}
                </div>
                <span className="card-date">
                  {new Date(portfolio.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
              
              <div className="card-body">
                <h3>@{portfolio.githubUsername}</h3>
                <p className="portfolio-title">{portfolio.title || "Developer Portfolio"}</p>
                <div className="portfolio-details">
                  {portfolio.name && <span>👤 {portfolio.name}</span>}
                  {portfolio.location && <span>📍 {portfolio.location}</span>}
                </div>
              </div>

              <div className="card-actions">
                <a 
                  href={`/preview/${portfolio._id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="preview-btn"
                  title="Live Preview"
                >
                  <Eye size={16} /> Live Preview
                </a>
                <button 
                  onClick={() => handleDownload(portfolio)} 
                  className="icon-action-btn"
                  title="Download HTML"
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(portfolio._id)} 
                  className="icon-action-btn delete"
                  title="Delete Portfolio"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
