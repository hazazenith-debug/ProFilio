import { Mail, MapPin } from "lucide-react";
import { FaGithub } from "react-icons/fa";



export function LivePreview({ aboutMe, selectedSkills, name, title, email, location, github }) {
  const displayName = name || 'Your Name'
  const displayTitle = title || 'Your Title'
  const displayEmail = email || ''
  const displayLocation = location || ''
  const displayGithub = github || ''
  const displayAbout = aboutMe || ''

  const initials = (name || 'Y')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="live-preview">

      <div className="live">
        <span className="dot"></span>
        Live Preview
      </div>

      <div className="profile">
        <div className="avatar"  >{initials}</div>
        <span className="status"></span>
      </div>

      <h1 style={{ color: '#232e40', wordBreak: 'break-word' }} className="displayName">{displayName}</h1>
      <p className="job" style={{ wordBreak: 'break-word' }}>{displayTitle}</p>

      {(displayEmail || displayLocation || displayGithub) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
          {displayEmail && <span style={{ fontSize: '13px', color: '#64748b', wordBreak: 'break-all' }}><Mail size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />{displayEmail}</span>}
          {displayLocation && <span style={{ fontSize: '13px', color: '#64748b', wordBreak: 'break-word' }}><MapPin size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />{displayLocation}</span>}
          {displayGithub && <span style={{ fontSize: '13px', color: '#64748b', wordBreak: 'break-all' }}><FaGithub size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />{displayGithub}</span>}
        </div>
      )}

      {displayAbout && (
        <div className="projects" style={{ marginBottom: '24px', transform: 'translateY(60px)' }}>
          <h3><span></span>About Me</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayAbout}</p>
        </div>
      )}

      {selectedSkills && selectedSkills.length > 0 && (
        <div className="projects" style={{ marginBottom: '24px', transform: 'translateY(70px)' }}>
          <h3><span></span>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {selectedSkills.map((skill, i) => (
              <span key={i} style={{
                fontSize: '12px', padding: '4px 12px',
                background: 'white', border: '1px solid #e2e8f0',
                borderRadius: '20px', color: '#334155', fontWeight: 500
              }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* <div className="projects">
        <h3><span></span>Projects</h3>
        <div className="project-card">
          <h3>Your Project</h3>
          <p>Project description will appear here once you add it in the builder.</p>
          <a href="#">View on GitHub →</a>
        </div>
      </div> */}

    </div>
  )
}
