import { BuildingHeader } from './BuildingHeader'
import { PersonalInfo } from './PersonalInfo'
import { Skills } from './Skills'
import { AboutMe } from './AboutMe'
import { Preview } from './Preview'
import { useState } from 'react'

export function BuildingPart({ aboutMe, setAboutMe, selectedSkills, setSelectedSkills, name, setName, title, setTitle, email, setEmail, location, setLocation, github, setGithub }) {
  const [step, setStep] = useState(0)

  return (
    <div className="building-part">
      <BuildingHeader />

      <div className="steps-container">
        <div className="steps">
          <div className={`step ${step === 0 ? 'active' : step > 0 ? 'completed' : ''}`} onClick={() => setStep(0)}>
            {step > 0 ? '✓' : '1'}
          </div>
          <div className={`line ${step > 0 ? 'completed' : ''}`}></div>

          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
            {step > 1 ? '✓' : '2'}
          </div>
          <div className={`line ${step > 1 ? 'completed' : ''}`}></div>

          <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} onClick={() => setStep(2)}>
            {step > 2 ? '✓' : '3'}
          </div>
          <div className={`line ${step > 2 ? 'completed' : ''}`}></div>

          <div className={`step ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
            {step > 3 ? '✓' : '4'}
          </div>
        </div>

        <div className="labels">
          <span className={step === 0 ? 'active' : ''}>Personal Info</span>
          <span className={step === 1 ? 'active' : ''}>Skills</span>
          <span className={step === 2 ? 'active' : ''}>About Me</span>
          <span className={step === 3 ? 'active' : ''}>Preview</span>
        </div>
      </div>

      <div className="form-content">
        {step === 0 && <PersonalInfo
          name={name} setName={setName}
          title={title} setTitle={setTitle}
          email={email} setEmail={setEmail}
          location={location} setLocation={setLocation}
          github={github} setGithub={setGithub} />}
        {step === 1 && <Skills selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />}
        {step === 2 && <AboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} />}
        {step === 3 && <Preview
          aboutMe={aboutMe}
          selectedSkills={selectedSkills}
          name={name}
          title={title}
          email={email}
          location={location}
          github={github}
          setStep={setStep} />}
      </div>

      <div className="builder-nav-buttons">
        <button
          className="btn-back"
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.5 : 1, cursor: step === 0 ? 'default' : 'pointer' }}
        >
          &lt; Back
        </button>
        <button
          className="btn-next"
          onClick={() => step < 3 && setStep(step + 1)}
        >
          {step === 3 ? 'Generate Portfolio' : step === 2 ? 'Review & Preview' : 'Next Step >'}
        </button>
      </div>
    </div>
  )
}
