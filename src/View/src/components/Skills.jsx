import { useState } from "react" 

export function Skills({ selectedSkills, setSelectedSkills }) {
  const [customSkill, setCustomSkill] = useState('');
  const defaultSkills = [
    "React", "TypeScript", "Node.js", "Python", "AWS",
    "Docker", "PostgreSQL", "GraphQL", "Next.js",
    "Tailwind", "MongoDB", "Redis"
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed) {
      setSelectedSkills((prev) => {
        if (prev.includes(trimmed)) return prev;
        return [...prev, trimmed];
      });
    }
    setCustomSkill('');
  };

  const customSkills = selectedSkills.filter(skill => !defaultSkills.includes(skill));

  return (
    <div className="form-box">
      <h3 className="section-title">Select Your Skills</h3>
      <div className="skills-grid">
        {defaultSkills.map((skill, index) => (
          <button 
            key={index} 
            onClick={() => toggleSkill(skill)} 
            type="button" 
            className={`skill-pill ${selectedSkills.includes(skill) ? 'active' : ''}`}
          >
            {skill}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label htmlFor="custom-skill">Add Custom Skill</label>
          <div className="add-skill-row">
            <input
              id='custom-skill'
              type="text"
              placeholder='e.g., Kubernetes, GraphQL...'
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type='button' onClick={addCustomSkill} className="btn-add">Add</button>
          </div>
        </div>
      </div>

      {customSkills.length > 0 && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px' }}>Custom Skills Added:</h4>
          <div className="skills-grid">
            {customSkills.map((skill, index) => (
              <button 
                key={index} 
                onClick={() => toggleSkill(skill)} 
                type="button" 
                className="skill-pill active"
                style={{ 
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {skill} <span style={{ fontSize: '10px', opacity: 0.8 }}>✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSkills.length < 2 && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '15px', display: 'block' }}>
          Please select at least 2 skills to proceed. (Selected: {selectedSkills.length}/2)
        </span>
      )}
    </div>
  );
}
