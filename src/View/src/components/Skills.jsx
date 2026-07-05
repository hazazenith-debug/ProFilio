import {useState} from "react" 
export function Skills({selectedSkills, setSelectedSkills}) {
  const [customSkill, setCustomSkill] = useState('');
  const defaultSkills = [
    "React", "TypeScript", "Node.js", "Python", "AWS",
    "Docker", "PostgreSQL", "GraphQL", "Next.js",
    "Tailwind", "MongoDB", "Redis"
  ];


  let toggleSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev)=>([...prev, skill]))
    }
    else{
      setSelectedSkills((prev) => prev.filter(s => s !== skill))
    }
  }
  function handleAddCustomSkill (e) {
    e.preventDefault();
    setSelectedSkills(prev=>([...prev, customSkill]))
    setCustomSkill('');
  }
  return (
    <div className="form-box">
      <h3 className="section-title">Select Your Skills</h3>
      <div className="skills-grid">
        {defaultSkills.map((skill, index) => (
          <button key={index} onClick={() => {toggleSkill(skill)}} type="button" className={`skill-pill ${selectedSkills.includes(skill) ? 'active' : ''}`}>
            {skill}
          </button>
        ))}
      </div>

      <form onSubmit={handleAddCustomSkill}>
        <div className="form-group">
          <label htmlFor="custom-skill">Add Custom Skill</label>
          <div className="add-skill-row">
            <input
              id='custom-skill'
              type="text"
              placeholder='e.g., Kubernetes, GraphQL...'
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
            />
            <button type='submit' className="btn-add">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
}
