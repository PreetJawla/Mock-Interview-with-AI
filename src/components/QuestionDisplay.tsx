import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { generateQuestion } from '../services/api';

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

interface QuestionDisplayProps {
  codingLanguage: CodingLanguage;
  difficulty: DifficultyLevel;
  onQuestionGenerated: (question: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  codingLanguage, 
  difficulty, 
  onQuestionGenerated 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerateQuestion = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await generateQuestion('English', difficulty.id, codingLanguage.id);
      onQuestionGenerated(data.question);
    } catch (err) {
      setError('Failed to generate question. Please try again.');
      console.error('Error generating question:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6">
          <Play className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for Your Technical Interview?</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{codingLanguage.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">{codingLanguage.name}</div>
                <div className="text-gray-600">Technology</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-gray-900">{difficulty.name}</div>
                <div className="text-gray-600">Difficulty</div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Click the button below to generate your interview question. You'll have 20 seconds to answer once the question appears.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerateQuestion}
        disabled={loading}
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating Question...</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            <span>Generate Question</span>
          </>
        )}
      </button>
    </div>
  );
};

export default QuestionDisplay;