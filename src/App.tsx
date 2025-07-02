import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import InterviewSession from './components/InterviewSession';
import Header from './components/Header';

interface CodingLanguage {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  color: string;
}

function App() {
  const [selectedCodingLanguage, setSelectedCodingLanguage] = useState<CodingLanguage | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const handleLanguageSelect = (codingLanguage: CodingLanguage, difficulty: DifficultyLevel) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!sessionStarted ? (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                AI Technical Interview Practice
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Master your coding interviews with AI-powered questions tailored to your chosen technology stack. 
                Get instant feedback and improve your technical communication skills.
              </p>
            </div>
            <LanguageSelector onLanguageSelect={handleLanguageSelect} />
          </div>
        ) : (
          <InterviewSession 
            codingLanguage={selectedCodingLanguage!}
            difficulty={selectedDifficulty!}
            onBack={handleBackToLanguages}
          />
        )}
      </main>
    </div>
  );
}

export default App;