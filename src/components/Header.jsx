import React from 'react';
import { Mic, Brain, Award, Code } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <div className="header-content">
        <Brain />
        <span className="header-title">TechInterviewAI</span>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Code size={16} />
            <span>Technical Questions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Mic size={16} />
            <span>Voice Recognition</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Award size={16} />
            <span>AI Feedback</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;