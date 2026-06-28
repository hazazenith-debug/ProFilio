export function Skills({selectedSkills, setSelectedSkills}) {
  const skills = [
    "React", "TypeScript", "Node.js", "Python", "AWS",
    "Docker", "PostgreSQL", "GraphQL", "Next.js",
    "Tailwind", "MongoDB", "Redis"
  ];

  
  let toggleSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }
  return (
    <div className="form-box">
      <h3 className="section-title">Select Your Skills</h3>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <button key={index} onClick={() => {toggleSkill(skill)}} type="button" className={`skill-pill ${selectedSkills.includes(skill) ? 'active' : ''}`}>
            {skill}
          </button>
        ))}
      </div>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="custom-skill">Add Custom Skill</label>
          <div className="add-skill-row">
            <input id='custom-skill' type="text" placeholder='e.g., Kubernetes, GraphQL...' />
            <button type='submit' className="btn-add">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
}
