import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './context/AuthContext'
import { Home } from './components/Home'
import { NavBar } from './components/NavBar'
import { BuildingPart } from './components/BuildingPart'
import { LivePreview } from './components/livePreview'
import { useState } from 'react'
import { LogInPage } from './components/LogInPage'
import { Dashboard } from './components/Dashboard'
import { PortfolioViewer } from './components/PortfolioViewer'

function Navigation() {
  const location = useLocation();
  if (location.pathname.startsWith('/preview/')) {
    return null;
  }
  return <NavBar />;
}

function BuilderRoute({ aboutMe, setAboutMe, selectedSkills, setSelectedSkills, name, setName, title, setTitle, email, setEmail, location, setLocation, github, setGithub }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="builder-loading" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'white', gap: '16px' }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#94a3b8' }}>Verifying authentication...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
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
  );
}

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
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={
          <BuilderRoute 
            aboutMe={aboutMe} setAboutMe={setAboutMe}
            selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills}
            name={name} setName={setName}
            title={title} setTitle={setTitle}
            email={email} setEmail={setEmail}
            location={location} setLocation={setLocation}
            github={github} setGithub={setGithub} />
        } />
        <Route path="/signin" element={<LogInPage />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preview/:id" element={<PortfolioViewer />} />
      </Routes>
    </Router>
  )
}
