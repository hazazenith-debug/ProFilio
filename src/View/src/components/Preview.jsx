import './Preview.css'

export function Preview({ aboutMe, selectedSkills, name, title, email, location, github, setStep, selectedTheme, setSelectedTheme }) {
  return (
    <div className="preview-page">

      <div className="pv-card" style={{ marginBottom: '24px' }}>
        <div className="pv-card-head" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <div className="pv-card-title-row">
            <h2 className="pv-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
              🎨 Select Portfolio Style Theme
            </h2>
          </div>
        </div>
        <div className="pv-card-body" style={{ paddingTop: '16px' }}>
          <div className="pv-theme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div 
              className={`pv-theme-option ${selectedTheme === 'dark' ? 'active' : ''}`}
              style={{
                border: selectedTheme === 'dark' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                background: selectedTheme === 'dark' ? '#f0f7ff' : '#ffffff',
                transition: 'all 0.2s',
                boxShadow: selectedTheme === 'dark' ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
              }}
              onClick={() => setSelectedTheme('dark')}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 600 }}>Dark Slate</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>Modern neon slate colors with futuristic accents.</p>
            </div>
            
            <div 
              className={`pv-theme-option ${selectedTheme === 'minimal' ? 'active' : ''}`}
              style={{
                border: selectedTheme === 'minimal' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                background: selectedTheme === 'minimal' ? '#f0f7ff' : '#ffffff',
                transition: 'all 0.2s',
                boxShadow: selectedTheme === 'minimal' ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
              }}
              onClick={() => setSelectedTheme('minimal')}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 600 }}>Scandinavian Minimal</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>Clean, professional black & white layout.</p>
            </div>
            
            <div 
              className={`pv-theme-option ${selectedTheme === 'cyberpunk' ? 'active' : ''}`}
              style={{
                border: selectedTheme === 'cyberpunk' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                background: selectedTheme === 'cyberpunk' ? '#f0f7ff' : '#ffffff',
                transition: 'all 0.2s',
                boxShadow: selectedTheme === 'cyberpunk' ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
              }}
              onClick={() => setSelectedTheme('cyberpunk')}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 600 }}>Cyberpunk</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>High-tech, neon cybernetic presentation.</p>
            </div>
            
            <div 
              className={`pv-theme-option ${selectedTheme === 'glassmorphism' ? 'active' : ''}`}
              style={{
                border: selectedTheme === 'glassmorphism' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                background: selectedTheme === 'glassmorphism' ? '#f0f7ff' : '#ffffff',
                transition: 'all 0.2s',
                boxShadow: selectedTheme === 'glassmorphism' ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none'
              }}
              onClick={() => setSelectedTheme('glassmorphism')}
            >
              <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 600 }}>Glassmorphism</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>Fluid frosted glass gradients and borders.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pv-card">
        <div className="pv-card-head">
          <div className="pv-card-title-row">
            <h2 className="pv-card-title">Personal Information</h2>
            <span className="pv-check">✔</span>
          </div>
          <button className="pv-edit-btn" onClick={() => setStep(0)}>✏️ Edit</button>
        </div>
        <div className="pv-card-body">
          <div className="pv-fields-grid">
            <div className="pv-field">
              <span className="pv-field-label">FULL NAME</span>
              <span className="pv-field-value">{name || 'Not provided'}</span>
            </div>
            <div className="pv-field">
              <span className="pv-field-label">PROFESSIONAL ROLE</span>
              <span className="pv-field-value">{title || 'Not provided'}</span>
            </div>
            <div className="pv-field">
              <span className="pv-field-label">EMAIL ADDRESS</span>
              <span className="pv-field-value">{email || 'Not provided'}</span>
            </div>
            <div className="pv-field">
              <span className="pv-field-label">LOCATION</span>
              <span className="pv-field-value">{location || 'Not provided'}</span>
            </div>
            <div className="pv-field">
              <span className="pv-field-label">GITHUB</span>
              <span className="pv-field-value">{github || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="pv-card">
        <div className="pv-card-head">
          <div className="pv-card-title-row">
            <h2 className="pv-card-title">Projects</h2>
            <span className="pv-check">✔</span>
          </div>
          <button className="pv-edit-btn" onClick={() => setStep(0)}>✏️ Edit</button>
        </div>
        <div className="pv-card-body">
          <div className="pv-project-item">
            <div className="pv-project-thumb"></div>
            <div className="pv-project-info">
              <p className="pv-project-name">Sample Project</p>
              <p className="pv-project-desc">Your projects will appear here once added.</p>
              <span className="pv-project-tag">EXAMPLE</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="pv-card">
        <div className="pv-card-head">
          <div className="pv-card-title-row">
            <h2 className="pv-card-title">Skills</h2>
            <span className="pv-check">✔</span>
          </div>
          <button className="pv-edit-btn" onClick={() => setStep(1)}>✏️ Edit</button>
        </div>
        <div className="pv-card-body">
          {selectedSkills && selectedSkills.length > 0 ? (
            <div className="pv-skills-list">
              {selectedSkills.map((skill, i) => (
                <span key={i} className="pv-skill-tag">{skill}</span>
              ))}
            </div>
          ) : (
            <p className="pv-empty-text">No skills added yet</p>
          )}
        </div>
      </div>

      <div className="pv-card">
        <div className="pv-card-head">
          <div className="pv-card-title-row">
            <h2 className="pv-card-title">About Me</h2>
            <span className="pv-check">✔</span>
          </div>
          <button className="pv-edit-btn" onClick={() => setStep(2)}>✏️ Edit</button>
        </div>
        <div className="pv-card-body">
          <p className="pv-about-text">{aboutMe || 'No description provided yet'}</p>
        </div>
      </div>

    </div>
  )
}
