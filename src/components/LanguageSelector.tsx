import React, { useState } from 'react';
import { ChevronRight, Code, BarChart3 } from 'lucide-react';

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

interface LanguageSelectorProps {
  onLanguageSelect: (codingLanguage: CodingLanguage, difficulty: DifficultyLevel) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  const [selectedCodingLanguage, setSelectedCodingLanguage] = useState<CodingLanguage | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const codingLanguages: CodingLanguage[] = [
    { id: 'java', name: 'Java', icon: '☕', color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { id: 'cpp', name: 'C++', icon: '⚡', color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { id: 'python', name: 'Python', icon: '🐍', color: 'bg-green-100 border-green-300 text-green-800' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { id: 'mern', name: 'MERN Stack', icon: '🚀', color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { id: 'sql', name: 'SQL', icon: '🗄️', color: 'bg-indigo-100 border-indigo-300 text-indigo-800' },
    { id: 'dbms', name: 'DBMS', icon: '💾', color: 'bg-gray-100 border-gray-300 text-gray-800' },
    { id: 'react', name: 'React', icon: '⚛️', color: 'bg-cyan-100 border-cyan-300 text-cyan-800' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: '🧮', color: 'bg-red-100 border-red-300 text-red-800' }
  ];

  const difficultyLevels: DifficultyLevel[] = [
    { 
      id: 'beginner', 
      name: 'Beginner', 
      description: 'Basic concepts and simple problems',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    { 
      id: 'intermediate', 
      name: 'Intermediate', 
      description: 'Moderate complexity with practical scenarios',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    { 
      id: 'advanced', 
      name: 'Advanced', 
      description: 'Complex problems and system design',
      color: 'bg-red-100 border-red-300 text-red-800'
    }
  ];

  const handleCodingLanguageClick = (codingLanguage: CodingLanguage) => {
    setSelectedCodingLanguage(codingLanguage);
  };

  const handleDifficultyClick = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartInterview = () => {
    if (selectedCodingLanguage && selectedDifficulty) {
      onLanguageSelect(selectedCodingLanguage, selectedDifficulty);
    }
  };

  const canStart = selectedCodingLanguage && selectedDifficulty;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
      {/* Coding Language Selection */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Technical Domain</h2>
          <p className="text-gray-600">Select the programming language or technology you want to practice</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {codingLanguages.map((codingLang) => (
            <button
              key={codingLang.id}
              onClick={() => handleCodingLanguageClick(codingLang)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedCodingLanguage?.id === codingLang.id
                  ? `border-blue-500 bg-blue-50 shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{codingLang.icon}</div>
              <div className="font-medium text-gray-900 text-sm">{codingLang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Level Selection */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Difficulty Level</h2>
          <p className="text-gray-600">Select the complexity level for your interview questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficultyLevels.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => handleDifficultyClick(difficulty)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedDifficulty?.id === difficulty.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 mb-2">{difficulty.name}</div>
                <div className="text-sm text-gray-600">{difficulty.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Summary and Start Button */}
      {(selectedCodingLanguage || selectedDifficulty) && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Selection:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Technology: </span>
              <span className="text-green-600">
                {selectedCodingLanguage ? `${selectedCodingLanguage.icon} ${selectedCodingLanguage.name}` : 'Not selected'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Level: </span>
              <span className="text-orange-600">
                {selectedDifficulty ? selectedDifficulty.name : 'Not selected'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={handleStartInterview}
          disabled={!canStart}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto ${
            canStart
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Start Interview Practice</span>
          <ChevronRight className="h-5 w-5" />
        </button>
        
        {!canStart && (
          <p className="text-sm text-gray-500 mt-2">
            Please select both technology and difficulty level to start your interview practice
          </p>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;