import { useState } from "react";

export function PersonalInfo({ name, setName, title, setTitle, email, setEmail, location, setLocation, github, setGithub, showErrors }) {
  const [touched, setTouched] = useState({
    name: false,
    title: false,
    email: false,
    github: false
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  const nameError = (touched.name || showErrors) && (!name || name.trim().length < 2 || name.trim().length > 50)
    ? "Name is required and must be between 2 and 50 characters."
    : "";

  const titleError = (touched.title || showErrors) && (!title || title.trim().length < 2 || title.trim().length > 50)
    ? "Title is required and must be between 2 and 50 characters."
    : "";

  const emailError = (touched.email || showErrors) && (!email || !emailRegex.test(email))
    ? "Please enter a valid email address."
    : "";

  const githubError = (touched.github || showErrors) && (!github || !githubRegex.test(github))
    ? "Please enter a valid GitHub username."
    : "";

  return (
    <div className='form-box'>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input 
            required 
            id='name' 
            type="text" 
            maxLength={50} 
            placeholder='John Doe' 
            value={name} 
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
          />
          {nameError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{nameError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Title *</label>
          <input 
            required
            id='role' 
            type="text" 
            maxLength={50}
            placeholder='Full Stack Developer' 
            value={title} 
            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
          />
          {titleError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{titleError}</span>}
        </div>

        <div className="row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              required
              id='email' 
              type="email" 
              placeholder='john@example.com' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            />
            {emailError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{emailError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id='location' type="text" placeholder='San Francisco, CA' value={location} onChange={(e) => setLocation(e.target.value)}/>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="github">GitHub Username *</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
            </span>
            <input 
              required
              id='github' 
              type="text" 
              placeholder='johndoe' 
              value={github} 
              onChange={(e) => setGithub(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, github: true }))}
            />
          </div>
          {githubError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{githubError}</span>}
        </div>
      </form>
    </div>
  );
}
