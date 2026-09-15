import React, { useState } from 'react';
import { ChevronRight, Code, BarChart3 } from 'lucide-react';

const LanguageSelector = ({ onLanguageSelect }) => {
  const [selectedCodingLanguage, setSelectedCodingLanguage] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const codingLanguages = [
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'mern', name: 'MERN Stack', icon: '🚀' },
    { id: 'sql', name: 'SQL', icon: '🗄️' },
    { id: 'dbms', name: 'DBMS', icon: '💾' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢' },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: '🧮' },
    { id: 'dotnet', name: '.NET', icon: '💠' },
    { id: 'coding', name: 'Coding Challenge', icon: '🧠' },
    { id: 'cn', name: 'Computer Networks', icon: '🌐' },
    { id: 'os', name: 'Operating System', icon: '🖥️' },
    { id: 'oops', name: 'OOPs Concepts', icon: '📦' },
    { id: 'system-design', name: 'System Design', icon: '🏗️' },
    { id: 'devops', name: 'DevOps', icon: '⚙️' },
    { id: 'ai-ml', name: 'AI/ML Basics', icon: '🧠' },
    { id: 'cloud', name: 'Cloud Computing', icon: '☁️' },
    { id: 'linux', name: 'Linux & Shell', icon: '🐧' }
  ];

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Basic concepts and simple problems' },
    { id: 'intermediate', name: 'Intermediate', description: 'Moderate complexity with practical scenarios' },
    { id: 'advanced', name: 'Advanced', description: 'Complex problems and system design' }
  ];

  const handleStartInterview = () => {
    if (selectedCodingLanguage && selectedDifficulty) {
      onLanguageSelect(selectedCodingLanguage, selectedDifficulty);
    }
  };

  const canStart = selectedCodingLanguage && selectedDifficulty;

  return (
    <div className="card">
      <div className="mb-6 text-center">
        <h2 className="card-title">
          <Code size={24} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
          Choose Technical Domain
        </h2>
        <p className="card-subtitle">Select the programming language or technology you want to practice</p>
        
        <div className="grid">
          {codingLanguages.map((codingLang) => (
            <div
              key={codingLang.id}
              onClick={() => setSelectedCodingLanguage(codingLang)}
              className={`language-card ${selectedCodingLanguage?.id === codingLang.id ? 'selected' : ''}`}
            >
              <div className="language-icon">{codingLang.icon}</div>
              <div className="language-name">{codingLang.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 mt-8 text-center">
        <h2 className="card-title">
          <BarChart3 size={24} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--secondary)' }} />
          Choose Difficulty Level
        </h2>
        <p className="card-subtitle">Select the complexity level for your interview questions</p>

        <div className="difficulty-selector" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          {difficultyLevels.map((difficulty) => (
            <div
              key={difficulty.id}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`language-card ${selectedDifficulty?.id === difficulty.id ? 'selected' : ''}`}
              style={{ minWidth: '200px', flex: '1' }}
            >
              <div className="language-name">{difficulty.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {difficulty.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(selectedCodingLanguage || selectedDifficulty) && (
        <div className="alert mt-4 text-center" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--text)' }}>
          <h3 style={{ marginBottom: '8px' }}>Your Selection</h3>
          <div>
            <strong>Technology:</strong> {selectedCodingLanguage ? `${selectedCodingLanguage.icon} ${selectedCodingLanguage.name}` : 'Not selected'}
            <span style={{ margin: '0 10px' }}>|</span>
            <strong>Level:</strong> {selectedDifficulty ? selectedDifficulty.name : 'Not selected'}
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleStartInterview}
          disabled={!canStart}
          className="btn btn-primary"
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          <span>Start Interview Practice</span>
          <ChevronRight size={20} />
        </button>
        
        {!canStart && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px' }}>
            Please select both technology and difficulty level to start
          </p>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;