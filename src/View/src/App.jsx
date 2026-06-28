import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './components/Home'
import { NavBar } from './components/NavBar'
import { BuildingPart } from './components/BuildingPart'
import { LivePreview } from './components/livePreview'
import { useState } from 'react'

export default function App() {
  const [aboutMe, setAboutMe] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');

  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={
          <div className="container">
            <BuildingPart 
              aboutMe={aboutMe} setAboutMe={setAboutMe}
              selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills}
              name={name} setName={setName}
              title={title} setTitle={setTitle}
              email={email} setEmail={setEmail}
              location={location} setLocation={setLocation}
              github={github} setGithub={setGithub} />
            <LivePreview 
              aboutMe={aboutMe} 
              selectedSkills={selectedSkills}
              name={name} 
              title={title}
              email={email} 
              location={location}
              github={github} />
          </div>
        } />
      </Routes>
    </Router>
  )
}
