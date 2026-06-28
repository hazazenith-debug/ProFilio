import './Preview.css'

export function Preview({ aboutMe, selectedSkills, name, title, email, location, github, setStep }) {
  return (
    <div className="preview-page">

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
