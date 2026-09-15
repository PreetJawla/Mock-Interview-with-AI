import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import InterviewSession from './components/InterviewSession';
import Header from './components/Header';

function App() {
  const [selectedCodingLanguage, setSelectedCodingLanguage] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const handleLanguageSelect = (codingLanguage, difficulty) => {
    setSelectedCodingLanguage(codingLanguage);
    setSelectedDifficulty(difficulty);
    setSessionStarted(true);
  };

  const handleBackToLanguages = () => {
    setSelectedCodingLanguage(null);
    setSelectedDifficulty(null);
    setSessionStarted(false);
  };

  return (
    <div className="app-container">
      <Header />
      
      <main>
        {!sessionStarted ? (
          <div className="text-center">
            <h1 className="card-title text-center mt-4">
              AI Technical Interview Practice
            </h1>
            <p className="card-subtitle text-center mb-6">
              Master your coding interviews with AI-powered questions tailored to your chosen technology stack. 
              Get instant feedback and improve your technical communication skills.
            </p>
            <LanguageSelector onLanguageSelect={handleLanguageSelect} />
          </div>
        ) : (
          <InterviewSession 
            codingLanguage={selectedCodingLanguage}
            difficulty={selectedDifficulty}
            onBack={handleBackToLanguages}
          />
        )}
      </main>
    </div>
  );
}

export default App;