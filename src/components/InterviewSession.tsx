import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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

const NUM_QUESTIONS = 5;

const InterviewSession: React.FC<InterviewSessionProps> = ({
  codingLanguage,
  difficulty,
  onBack,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(NUM_QUESTIONS).fill(''));
  const [feedbacks, setFeedbacks] = useState<string[]>(Array(NUM_QUESTIONS).fill(''));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionNumber, setSessionNumber] = useState(1); // Track which set we're on

  // Fetch questions from Gemini on mount or when sessionNumber changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const fetched = await fetchQuestionsFromGemini(NUM_QUESTIONS, codingLanguage.name, difficulty.name);
      setQuestions(fetched);
      setAnswers(Array(NUM_QUESTIONS).fill(''));
      setFeedbacks(Array(NUM_QUESTIONS).fill(''));
      setCurrentIdx(0);
      setShowFeedback(false);
      setLoading(false);
    };
    fetchQuestions();
  }, [sessionNumber]);

  const handleAnswerComplete = (answer: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIdx] = answer;
      return updated;
    });
    setShowFeedback(true);
  };

  const handleFeedbackReceived = (feedbackText: string) => {
    setFeedbacks((prev) => {
      const updated = [...prev];
      updated[currentIdx] = feedbackText;
      return updated;
    });
  };

  const handleNext = () => {
    setShowFeedback(false);
    setCurrentIdx((idx) => Math.min(idx + 1, NUM_QUESTIONS - 1));
  };

  const handlePrev = () => {
    setShowFeedback(false);
    setCurrentIdx((idx) => Math.max(idx - 1, 0));
  };

  // Check if all questions have answers and feedbacks
  const allDone = answers.every(a => a) && feedbacks.every(f => f);

  if (loading) return <div>Loading questions...</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

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
              <div className="text-xs text-gray-600">
                Question #{currentIdx + 1} of {NUM_QUESTIONS}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIdx === NUM_QUESTIONS - 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Question and Answer */}
      {(showFeedback || !allDone) ? (
        <div className="space-y-6">
          {!showFeedback ? (
            <SpeechRecorder
              question={questions[currentIdx]}
              onAnswerComplete={handleAnswerComplete}
            />
          ) : (
            <FeedbackDisplay
              question={questions[currentIdx]}
              answer={answers[currentIdx]}
              codingLanguage={codingLanguage}
              difficulty={difficulty}
              onFeedbackReceived={handleFeedbackReceived}
              onNextQuestion={() => {
                setShowFeedback(false);
                // If not last question, go to next
                if (currentIdx < NUM_QUESTIONS - 1) {
                  setCurrentIdx(idx => idx + 1);
                }
              }}
            />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Great job! You've completed this set of questions.</h2>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 mt-6"
            onClick={() => setSessionNumber(n => n + 1)}
          >
            Next Set of Questions
          </button>
        </div>
      )}

      {/* Answers Overview */}
      <div className="mt-8">
        <h3 className="font-bold mb-2">Your Answers:</h3>
        <ol className="list-decimal pl-6">
          {questions.map((q, idx) => (
            <li key={idx} className={idx === currentIdx ? 'font-bold' : ''}>
              <span className="text-gray-700">{q}</span>
              <div className="ml-2 text-blue-700">
                {answers[idx] ? answers[idx] : <span className="text-gray-400">No answer yet</span>}
              </div>
              {feedbacks[idx] && (
                <div className="ml-2 text-green-700 text-sm">
                  Feedback: {feedbacks[idx]}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default InterviewSession;

// Helper (replace with your actual Gemini API call)
async function fetchQuestionsFromGemini(n: number, language: string, difficulty: string): Promise<string[]> {
  const response = await fetch(`/api/gemini/questions?n=${n}&language=${encodeURIComponent(language)}&difficulty=${encodeURIComponent(difficulty)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch questions from Gemini');
  }
  const data = await response.json();
  return data.questions;
}