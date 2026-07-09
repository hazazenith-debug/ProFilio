import { BuildingHeader } from './BuildingHeader'
import { PersonalInfo } from './PersonalInfo'
import { Skills } from './Skills'
import { AboutMe } from './AboutMe'
import { Preview } from './Preview'
import { useState } from 'react'

export function BuildingPart({ aboutMe, setAboutMe, selectedSkills, setSelectedSkills, name, setName, title, setTitle, email, setEmail, location, setLocation, github, setGithub }) {
  const [step, setStep] = useState(0)
  const [showErrors, setShowErrors] = useState(false)

  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isGithubValid = github && /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(github);
  const isNameValid = name && name.trim().length >= 2 && name.trim().length <= 50;
  const isTitleValid = title && title.trim().length >= 2 && title.trim().length <= 50;
  const isPersonalInfoValid = isNameValid && isTitleValid && isEmailValid && isGithubValid;
  const isSkillsValid = selectedSkills && selectedSkills.length >= 2;

  const goToStep = (targetStep) => {
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
    setShowErrors(false);
    setStep(targetStep);
  };

  return (
    <div className="building-part">
      <BuildingHeader />

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

          <div className={`step ${step === 3 ? 'active' : ''}`} onClick={() => goToStep(3)}>
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
          github={github} setGithub={setGithub}
          showErrors={showErrors} />}
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
          setStep={goToStep} />}
      </div>

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
            if (step < 3) {
              setShowErrors(false);
              setStep(step + 1);
            }
          }}
          style={{ 
            cursor: 'pointer'
          }}
        >
          {step === 3 ? 'Generate Portfolio' : step === 2 ? 'Review & Preview' : 'Next Step >'}
        </button>
      </div>
    </div>
  )
}
