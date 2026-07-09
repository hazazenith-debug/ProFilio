import React from 'react';

export function ThemeSelection({ selectedTheme, setSelectedTheme }) {
  const themeOptions = [
    {
      id: 'dark',
      name: 'Dark Slate & Neon Accent',
      desc: 'Modern neon slate colors with futuristic accents.',
      bg: '#0f172a',
      accent: '#3b82f6'
    },
    {
      id: 'minimal',
      name: 'Scandinavian Minimal',
      desc: 'Clean, professional black & white layout.',
      bg: '#fafafa',
      accent: '#000000'
    },
    {
      id: 'cyberpunk',
      name: 'Neon Cybernetic Tech',
      desc: 'High-tech, neon cybernetic presentation.',
      bg: '#0a0a0f',
      accent: '#ff007f'
    },
    {
      id: 'glassmorphism',
      name: 'Frosted Glass Fluidity',
      desc: 'Fluid frosted glass gradients and borders.',
      bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      accent: '#ffffff'
    }
  ];

  return (
    <div className="theme-selection-page" style={{ padding: '10px 0' }}>
      <h2 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '8px', fontWeight: 700 }}>🎨 Select Portfolio Style</h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
        Choose a design theme for your generated portfolio page. You can change this later in the live preview.
      </p>
      
      <div className="theme-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {themeOptions.map((opt) => (
          <div
            key={opt.id}
            className={`theme-option-card ${selectedTheme === opt.id ? 'active' : ''}`}
            onClick={() => setSelectedTheme(opt.id)}
            style={{
              border: selectedTheme === opt.id ? '3px solid #2563eb' : '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: '#ffffff',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: selectedTheme === opt.id ? '0 10px 25px -5px rgba(37, 99, 235, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              transform: selectedTheme === opt.id ? 'translateY(-4px)' : 'none'
            }}
          >
            {/* Visual Preview Header */}
            <div style={{
              height: '80px',
              background: opt.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '10px',
                borderRadius: '5px',
                background: opt.accent,
                opacity: 0.8
              }}></div>
            </div>
            
            {/* Text details */}
            <div style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>{opt.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
