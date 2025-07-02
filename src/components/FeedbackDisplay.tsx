import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ThumbsUp, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { generateFeedback } from '../services/api';

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

interface FeedbackDisplayProps {
  question: string;
  answer: string;
  codingLanguage: CodingLanguage;
  difficulty: DifficultyLevel;
  onFeedbackReceived: (feedback: string) => void;
  onNextQuestion: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ 
  question, 
  answer, 
  codingLanguage,
  difficulty,
  onFeedbackReceived,
  onNextQuestion 
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const lastRequestRef = useRef<{ question: string; answer: string } | null>(null);

  useEffect(() => {
    // Only send feedback request if question or answer has changed
    if (
      lastRequestRef.current &&
      lastRequestRef.current.question === question &&
      lastRequestRef.current.answer === answer
    ) {
      return; // Prevent duplicate API calls
    }
    lastRequestRef.current = { question, answer };

    const fetchFeedback = async () => {
      setLoading(true);
      setError('');
      setIsQuotaError(false);
      setCooldown(0);

      try {
        const data = await generateFeedback(question, answer, 'English', codingLanguage.id, difficulty.id);
        setFeedback(data.feedback);
        onFeedbackReceived(data.feedback);
      } catch (err: any) {
        console.error('Error generating feedback:', err);
        
        // Enhanced quota error detection
        const errorMessage = err.response?.data?.error || err.message || '';
        const isQuotaExceeded = 
          err.response?.status === 500 && 
          (errorMessage.includes('quota') || 
           errorMessage.includes('429') ||
           errorMessage.includes('exceeded') ||
           err.response?.data?.type === 'quota_exceeded');

        if (isQuotaExceeded) {
          setIsQuotaError(true);
          setError('AI service quota exceeded. The feedback service is temporarily unavailable due to usage limits.');
          setCooldown(60); // Start 60s cooldown
        } else {
          setError('Failed to generate feedback. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [question, answer, codingLanguage.id, difficulty.id, onFeedbackReceived]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <Loader2 className="h-16 w-16 mx-auto text-blue-500 animate-spin" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing Your Response</h3>
        <p className="text-gray-600">Our AI is reviewing your {codingLanguage.name} answer and preparing personalized feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className={`mb-4 ${isQuotaError ? 'text-yellow-500' : 'text-red-500'}`}>
          {isQuotaError ? (
            <AlertTriangle className="h-16 w-16 mx-auto" />
          ) : (
            <MessageCircle className="h-16 w-16 mx-auto" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isQuotaError ? 'Service Temporarily Unavailable' : 'Error Loading Feedback'}
        </h3>
        <p className={`mb-6 ${isQuotaError ? 'text-yellow-700' : 'text-red-600'}`}>
          {error}
        </p>
        
        {isQuotaError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">What happened?</h4>
            <p className="text-yellow-700 text-sm mb-3">
              The AI feedback service has reached its usage limit. This is a temporary limitation that will reset soon.
            </p>
            <h4 className="font-semibold text-yellow-800 mb-2">What can you do?</h4>
            <ul className="text-yellow-700 text-sm text-left space-y-1">
              <li>• Continue practicing with more questions</li>
              <li>• Try again later (quota resets every minute)</li>
              <li>• Review your answer manually for now</li>
            </ul>
            <div className="mt-4 text-yellow-800 font-semibold">
              {cooldown > 0
                ? `Please wait ${cooldown} seconds before trying again.`
                : 'You can try again now.'}
            </div>
          </div>
        )}

        {/* Show the question and answer even when feedback fails */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Question</h3>
            <p className="text-gray-700">{question}</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Answer</h3>
            <p className="text-gray-700">{answer}</p>
          </div>
        </div>

        <button
          onClick={onNextQuestion}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={isQuotaError && cooldown > 0}
        >
          Continue to Next Question
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
          <ThumbsUp className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Feedback</h2>
        <p className="text-gray-600">Here's your personalized feedback for {codingLanguage.name}</p>
      </div>

      {/* Context Info */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{codingLanguage.icon}</span>
            <span className="font-medium">{codingLanguage.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">📊</span>
            <span className="font-medium">{difficulty.name}</span>
          </div>
        </div>
      </div>

      {/* Question & Answer Review */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Question</h3>
          <p className="text-gray-700">{question}</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Answer</h3>
          <p className="text-gray-700">{answer}</p>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
          AI Feedback
        </h3>
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {feedback}
          </div>
        </div>
      </div>

      {/* Next Question Button */}
      <div className="text-center">
        <button
          onClick={onNextQuestion}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
        >
          <span>Next Question</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;