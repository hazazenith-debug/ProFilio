import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Sparkles, RefreshCw } from 'lucide-react'

export function PreviewToolbar({
  mode = "builder", // "builder" or "viewer"
  username,
  selectedTheme,
  onThemeChange,
  onDownload,
  isLoading,
  // Builder mode props
  user,
  saveStatus,
  saveError,
  onSave,
  onBackToEditor,
  // Viewer mode props
  viewerSaveStatus
}) {
  return (
    <div className="preview-topbar" style={{
      height: "64px",
      background: "#0f172a",
      borderBottom: "1px solid #1e293b",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 100,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      color: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif",
      width: "100%",
      boxSizing: "border-box"
    }}>
      {/* Left Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {mode === "viewer" ? (
          <>
            <Link to="/dashboard" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#334155",
              color: "#f8fafc",
              border: "1px solid #475569",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#475569";
                e.currentTarget.style.borderColor = "#64748b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#334155";
                e.currentTarget.style.borderColor = "#475569";
              }}
            >
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <div style={{ height: "20px", width: "1px", background: "#1e293b" }}></div>
            <span style={{ fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={16} />
              Preview: <span style={{ color: "#f8fafc", fontWeight: 500 }}>@{username}</span>
            </span>
          </>
        ) : (
          <div style={{ fontWeight: 850, fontSize: "18px", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>⚡ PortfolioGenie</span>
            <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "14px", marginLeft: "4px" }}>| Live Preview</span>
          </div>
        )}
      </div>

      {/* Center Section: Theme Selection & Status Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="toolbar-theme-select" style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>Theme:</label>
          <select
            id="toolbar-theme-select"
            value={selectedTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#f8fafc",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#38bdf8"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#334155"}
          >
            <option value="dark">Dark Slate & Neon Accent</option>
            <option value="minimal">Scandinavian Monochromatic</option>
            <option value="cyberpunk">Neon Cybernetic Tech</option>
            <option value="glassmorphism">Frosted Glass Fluidity</option>
          </select>
        </div>

        {/* Sync Status Badge for Viewer Mode */}
        {mode === "viewer" && viewerSaveStatus && (
          <span style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: "9999px",
            background: viewerSaveStatus === "saving" ? "#78350f" : viewerSaveStatus === "saved" ? "#064e3b" : viewerSaveStatus === "error" ? "#7f1d1d" : "#1e293b",
            color: viewerSaveStatus === "saving" ? "#fef3c7" : viewerSaveStatus === "saved" ? "#a7f3d0" : viewerSaveStatus === "error" ? "#fecaca" : "#94a3b8",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}>
            {viewerSaveStatus === "saving" && (
              <>
                <RefreshCw size={12} className="spin-icon" style={{ animation: "spin 1.5s linear infinite" }} />
                Regenerating...
              </>
            )}
            {viewerSaveStatus === "saved" && "✅ Saved to Cloud"}
            {viewerSaveStatus === "local" && "👁️ Temporary View"}
            {viewerSaveStatus === "error" && "⚠️ Sync Failed"}
          </span>
        )}
      </div>

      {/* Right Section: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {mode === "builder" && (
          <>
            {saveError && (
              <span style={{ color: "#ef4444", fontSize: "12px", background: "#7f1d1d", padding: "6px 12px", borderRadius: "8px", border: "1px solid #991b1b" }}>
                ⚠️ {saveError}
              </span>
            )}

            {user ? (
              <button
                onClick={onSave}
                disabled={isLoading || saveStatus === "saving"}
                style={{
                  background: saveStatus === "saved" ? "#064e3b" : saveStatus === "saving" ? "#78350f" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: saveStatus === "saved" ? "#a7f3d0" : saveStatus === "saving" ? "#fef3c7" : "#ffffff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.3s ease",
                  boxShadow: saveStatus === "saved" ? "0 4px 12px rgba(6, 78, 59, 0.2)" : "0 4px 12px rgba(59, 130, 246, 0.25)"
                }}
              >
                {saveStatus === "saving" ? "⏳ Saving..." : saveStatus === "saved" ? "✅ Saved!" : "☁️ Save to Profile"}
              </button>
            ) : (
              <Link
                to="/signin"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#f8fafc",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid #334155",
                  transition: "background 0.3s ease"
                }}
              >
                🔒 Sign In to Save
              </Link>
            )}
          </>
        )}

        <button
          onClick={onDownload}
          disabled={isLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.2)";
          }}
        >
          <Download size={15} /> Download HTML
        </button>

        {mode === "builder" && (
          <button
            onClick={onBackToEditor}
            disabled={isLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#334155",
              color: "#f8fafc",
              border: "1px solid #475569",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#475569";
              e.currentTarget.style.borderColor = "#64748b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#334155";
              e.currentTarget.style.borderColor = "#475569";
            }}
          >
            ✏️ Back to Editor
          </button>
        )}
      </div>
    </div>
  )
}
