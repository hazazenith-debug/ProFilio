import { BuildingHeader } from './BuildingHeader'
import { PersonalInfo } from './PersonalInfo'
import { Skills } from './Skills'
import { AboutMe } from './AboutMe'
import { Preview } from './Preview'
import { ThemeSelection } from './ThemeSelection'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export function BuildingPart({ aboutMe, setAboutMe, selectedSkills, setSelectedSkills, name, setName, title, setTitle, email, setEmail, location, setLocation, github, setGithub }) {
  const [step, setStep] = useState(0)
  const [showErrors, setShowErrors] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedHtml, setGeneratedHtml] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [githubData, setGithubData] = useState(null)

  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState("idle"); // 'idle' | 'saving' | 'saved' | 'error'
  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    if (!user) {
      setError("Please sign in or create an account to save your portfolio to your profile.");
      return;
    }
    if (!generatedHtml) return;

    setSaveStatus("saving");
    setSaveError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/portfolio/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          githubUsername: github,
          theme: selectedTheme,
          name,
          title,
          email,
          location,
          aboutMe,
          selectedSkills,
          portfolioHtml: generatedHtml,
          githubData: githubData
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save portfolio.");
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setSaveError(err.message || "Could not save portfolio to database.");
    }
  };


  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isGithubValid = github && /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(github);
  const isNameValid = name && name.trim().length >= 2 && name.trim().length <= 50;
  const isTitleValid = title && title.trim().length >= 2 && title.trim().length <= 50;
  const isPersonalInfoValid = isNameValid && isTitleValid && isEmailValid && isGithubValid;
  const isSkillsValid = selectedSkills && selectedSkills.length >= 2;

  const goToStep = (targetStep) => {
    if (isLoading) return;
    if (targetStep > step) {
      if (step === 0 && !isPersonalInfoValid) {
        setShowErrors(true);
        return;
      }
      if (step === 1 && !isSkillsValid) {
        setShowErrors(true);
        return;
      }
      if (targetStep > 1 && !isPersonalInfoValid) {
        setShowErrors(true);
        return;
      }
      if (targetStep > 2 && (!isPersonalInfoValid || !isSkillsValid)) {
        setShowErrors(true);
        return;
      }
    }
    setError(null);
    setShowErrors(false);
    setStep(targetStep);
  };

  const handleGenerate = async (themeName = selectedTheme) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/portfolio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          githubUsername: github,
          theme: themeName,
          name,
          title,
          email,
          location,
          aboutMe,
          selectedSkills
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate portfolio.");
      }

      setGeneratedHtml(data.portfolioHtml);
      if (data.githubData) {
        setGithubData(data.githubData);
      }
      setStep(5);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during portfolio generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="building-part">
      <BuildingHeader />

      {step < 5 && (
        <div className="steps-container">
          <div className="steps">
            <div className={`step ${step === 0 ? 'active' : step > 0 ? 'completed' : ''}`} onClick={() => goToStep(0)}>
              {step > 0 ? '✓' : '1'}
            </div>
            <div className={`line ${step > 0 ? 'completed' : ''}`}></div>

            <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} onClick={() => goToStep(1)}>
              {step > 1 ? '✓' : '2'}
            </div>
            <div className={`line ${step > 1 ? 'completed' : ''}`}></div>

            <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} onClick={() => goToStep(2)}>
              {step > 2 ? '✓' : '3'}
            </div>
            <div className={`line ${step > 2 ? 'completed' : ''}`}></div>

            <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`} onClick={() => goToStep(3)}>
              {step > 3 ? '✓' : '4'}
            </div>
            <div className={`line ${step > 3 ? 'completed' : ''}`}></div>

            <div className={`step ${step === 4 ? 'active' : ''}`} onClick={() => goToStep(4)}>
              {step > 4 ? '✓' : '5'}
            </div>
          </div>

          <div className="labels">
            <span className={step === 0 ? 'active' : ''}>Personal Info</span>
            <span className={step === 1 ? 'active' : ''}>Skills</span>
            <span className={step === 2 ? 'active' : ''}>About Me</span>
            <span className={step === 3 ? 'active' : ''}>Theme</span>
            <span className={step === 4 ? 'active' : ''}>Review</span>
          </div>
        </div>
      )}

      <div className="form-content">
        {isLoading && step < 5 && (
          <div className="loading-overlay" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '5px solid #e2e8f0',
              borderTop: '5px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h3>Generating Portfolio...</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', maxWidth: '380px' }}>
              We are parsing your GitHub repository, analyzing code structure, and generating a custom professional portfolio page. This might take up to 20-30 seconds.
            </p>
          </div>
        )}

        {error && !isLoading && step < 5 && (
          <div className="error-box" style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '20px', color: '#b91c1c', margin: '20px 0', fontSize: '14px', textAlign: 'center' }}>
            <strong>Error Generating Portfolio:</strong> 
            <p style={{ marginTop: '8px', color: '#7f1d1d' }}>{error}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
              <button 
                onClick={() => handleGenerate(selectedTheme)} 
                className="btn-next" 
                style={{ background: '#dc2626', fontSize: '13px', padding: '10px 20px', boxShadow: 'none' }}
              >
                🔄 Try Again
              </button>
              <button 
                onClick={() => { setError(null); setStep(4); }} 
                className="btn-back" 
                style={{ border: '1px solid #fca5a5', color: '#b91c1c', opacity: 1, padding: '10px 20px' }}
              >
                ✏️ Edit Info
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && step === 0 && <PersonalInfo
          name={name} setName={setName}
          title={title} setTitle={setTitle}
          email={email} setEmail={setEmail}
          location={location} setLocation={setLocation}
          github={github} setGithub={setGithub}
          showErrors={showErrors} />}
        {!isLoading && !error && step === 1 && <Skills selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />}
        {!isLoading && !error && step === 2 && <AboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} />}
        {!isLoading && !error && step === 3 && <ThemeSelection selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />}
        {!isLoading && !error && step === 4 && <Preview
          aboutMe={aboutMe}
          selectedSkills={selectedSkills}
          name={name}
          title={title}
          email={email}
          location={location}
          github={github}
          setStep={goToStep} />}

        {step === 5 && (
          <div className="full-screen-preview">
            <div className="preview-topbar">
              <div className="preview-logo">
                ⚡ ProFilio <span>| Live Preview</span>
              </div>
              
              <div className="preview-controls">
                <div className="theme-selector-wrapper">
                  <label htmlFor="theme-select">Theme:</label>
                  <select 
                    id="theme-select"
                    className="theme-dropdown"
                    value={selectedTheme}
                    onChange={(e) => {
                      const newTheme = e.target.value;
                      setSelectedTheme(newTheme);
                      handleGenerate(newTheme);
                    }}
                    disabled={isLoading}
                  >
                    <option value="dark">Dark Slate & Neon Accent</option>
                    <option value="minimal">Scandinavian Monochromatic</option>
                    <option value="cyberpunk">Neon Cybernetic Tech</option>
                    <option value="glassmorphism">Frosted Glass Fluidity</option>
                  </select>
                </div>
              </div>

              <div className="preview-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {saveError && (
                  <span style={{ color: "#ef4444", fontSize: "12px", background: "#fef2f2", padding: "6px 12px", borderRadius: "8px", border: "1px solid #fee2e2" }}>
                    ⚠️ {saveError}
                  </span>
                )}
                {user ? (
                  <button 
                    onClick={handleSave} 
                    className="btn-preview-save"
                    style={{
                      background: saveStatus === "saved" ? "#10b981" : saveStatus === "saving" ? "#f59e0b" : "linear-gradient(135deg, #4f7cff, #8b3dff)",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.3s ease",
                      boxShadow: saveStatus === "saved" ? "0 4px 12px rgba(16, 185, 129, 0.2)" : "0 4px 12px rgba(139, 61, 255, 0.25)"
                    }}
                    disabled={isLoading || saveStatus === "saving"}
                  >
                    {saveStatus === "saving" ? "⏳ Saving..." : saveStatus === "saved" ? "✅ Saved!" : "☁️ Save to Profile"}
                  </button>
                ) : (
                  <Link 
                    to="/signin" 
                    className="btn-preview-save"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "background 0.3s ease"
                    }}
                  >
                    🔒 Sign In to Save
                  </Link>
                )}
                <button 
                  onClick={handleDownload} 
                  className="btn-preview-download"
                  disabled={isLoading}
                >
                  📥 Download HTML
                </button>
                <button 
                  onClick={() => { setError(null); setStep(4); }} 
                  className="btn-preview-back"
                  disabled={isLoading}
                >
                  ✏️ Back to Editor
                </button>
              </div>
            </div>

            <div className="preview-iframe-wrapper">
              {isLoading && (
                <div className="preview-loading-overlay">
                  <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid rgba(255,255,255,0.1)',
                    borderTop: '4px solid #38bdf8',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                  }}></div>
                  <h4 style={{ fontWeight: 600 }}>Regenerating Theme...</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>Applying theme styling directives to your portfolio</p>
                </div>
              )}
              
              {error ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', background: '#0f172a', color: '#fca5a5' }}>
                  <strong>Error Generating Theme:</strong>
                  <p style={{ marginTop: '8px', color: '#94a3b8', fontSize: '14px', maxWidth: '400px', textAlign: 'center' }}>{error}</p>
                  <button 
                    onClick={() => handleGenerate(selectedTheme)}
                    className="btn-next" 
                    style={{ marginTop: '16px', background: '#dc2626' }}
                  >
                    🔄 Try Again
                  </button>
                </div>
              ) : (
                <iframe
                  srcDoc={generatedHtml}
                  title="Generated Portfolio Preview"
                  className="preview-iframe"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {!isLoading && step < 5 && (
        <div className="builder-nav-buttons">
          <button
            className="btn-back"
            onClick={() => step > 0 && goToStep(step - 1)}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.5 : 1, cursor: step === 0 ? 'default' : 'pointer' }}
          >
            &lt; Back
          </button>
          <button
            className="btn-next"
            onClick={() => {
              if (step === 0 && !isPersonalInfoValid) {
                setShowErrors(true);
                return;
              }
              if (step === 1 && !isSkillsValid) {
                setShowErrors(true);
                return;
              }
              if (step < 4) {
                setShowErrors(false);
                setStep(step + 1);
              } else if (step === 4) {
                handleGenerate();
              }
            }}
            style={{ 
              cursor: 'pointer'
            }}
          >
            {step === 4 ? 'Generate Portfolio' : step === 3 ? 'Review Details >' : 'Next Step >'}
          </button>
        </div>
      )}
    </div>
  )
}
