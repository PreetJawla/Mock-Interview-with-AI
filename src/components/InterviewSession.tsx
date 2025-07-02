import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import QuestionDisplay from './QuestionDisplay';
import SpeechRecorder from './SpeechRecorder';
import FeedbackDisplay from './FeedbackDisplay';

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

interface InterviewSessionProps {
  codingLanguage: CodingLanguage;
  difficulty: DifficultyLevel;
  onBack: () => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ 
  codingLanguage, 
  difficulty, 
  onBack 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [sessionState, setSessionState] = useState<'question' | 'recording' | 'feedback'>('question');
  const [questionCount, setQuestionCount] = useState(0);

  const handleNewQuestion = (question: string) => {
    setCurrentQuestion(question);
    setUserAnswer('');
    setFeedback('');
    setSessionState('recording');
    setQuestionCount(prev => prev + 1);
  };

  const handleAnswerComplete = (answer: string) => {
    setUserAnswer(answer);
    setSessionState('feedback');
  };

  const handleFeedbackReceived = (feedbackText: string) => {
    setFeedback(feedbackText);
  };

  const handleNextQuestion = () => {
    setSessionState('question');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Setup</span>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl mb-1">{codingLanguage.icon}</div>
              <div className="text-xs text-gray-600">{codingLanguage.name}</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{difficulty.name}</div>
              <div className="text-xs text-gray-600">Question #{questionCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Content */}
      <div className="space-y-6">
        {sessionState === 'question' && (
          <QuestionDisplay 
            codingLanguage={codingLanguage}
            difficulty={difficulty}
            onQuestionGenerated={handleNewQuestion}
          />
        )}

        {sessionState === 'recording' && (
          <SpeechRecorder
            question={currentQuestion}
            onAnswerComplete={handleAnswerComplete}
          />
        )}

        {sessionState === 'feedback' && (
          <FeedbackDisplay
            question={currentQuestion}
            answer={userAnswer}
            codingLanguage={codingLanguage}
            difficulty={difficulty}
            onFeedbackReceived={handleFeedbackReceived}
            onNextQuestion={handleNextQuestion}
          />
        )}
      </div>
    </div>
  );
};

export default InterviewSession;