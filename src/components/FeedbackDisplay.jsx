import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ThumbsUp, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { generateFeedback } from '../services/api';

const FeedbackDisplay = ({ 
  question, 
  answer, 
  codingLanguage,
  difficulty,
  onFeedbackReceived,
  onNextQuestion 
}) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lastRequestRef = useRef(null);

  useEffect(() => {
    if (
      lastRequestRef.current &&
      lastRequestRef.current.question === question &&
      lastRequestRef.current.answer === answer
    ) {
      return;
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
      } catch (err) {
        console.error('Error generating feedback:', err);
        
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
          setCooldown(60);
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
      <div className="card text-center">
        <div style={{ marginBottom: '1.5rem' }}>
          <Loader2 size={48} className="loading-spinner" />
        </div>
        <h3 className="card-title">Analyzing Your Response</h3>
        <p className="card-subtitle">Our AI is reviewing your {codingLanguage.name} answer and preparing personalized feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <div style={{ marginBottom: '1rem', color: isQuotaError ? '#eab308' : '#ef4444' }}>
          {isQuotaError ? <AlertTriangle size={48} /> : <MessageCircle size={48} />}
        </div>
        <h3 className="card-title">
          {isQuotaError ? 'Service Temporarily Unavailable' : 'Error Loading Feedback'}
        </h3>
        <p style={{ color: isQuotaError ? '#a16207' : '#b91c1c', marginBottom: '1.5rem' }}>
          {error}
        </p>
        
        {isQuotaError && (
          <div className="alert" style={{ backgroundColor: '#fefce8', borderColor: '#fef08a', color: '#854d0e', textAlign: 'left' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>What happened?</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              The AI feedback service has reached its usage limit. This is a temporary limitation that will reset soon.
            </p>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>What can you do?</h4>
            <ul style={{ fontSize: '0.9rem', paddingLeft: '1rem', marginBottom: '1rem' }}>
              <li>• Continue practicing with more questions</li>
              <li>• Try again later (quota resets every minute)</li>
              <li>• Review your answer manually for now</li>
            </ul>
            <div style={{ fontWeight: 'bold' }}>
              {cooldown > 0 ? `Please wait ${cooldown} seconds before trying again.` : 'You can try again now.'}
            </div>
          </div>
        )}

        <div className="feedback-grid" style={{ marginTop: '2rem' }}>
          <div className="feedback-section">
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Question</h3>
            <p>{question}</p>
          </div>
          <div className="feedback-section answer">
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Your Answer</h3>
            <p>{answer}</p>
          </div>
        </div>

        <button
          onClick={onNextQuestion}
          className="btn btn-primary mt-4"
          disabled={isQuotaError && cooldown > 0}
        >
          Continue to Next Question
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'var(--primary)', borderRadius: '50%', marginBottom: '1rem', color: 'white' }}>
          <ThumbsUp size={32} />
        </div>
        <h2 className="card-title" style={{ fontSize: '2rem' }}>AI Feedback</h2>
        <p className="card-subtitle">Here's your personalized feedback for {codingLanguage.name}</p>
      </div>

      <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{codingLanguage.icon}</span>
          <span style={{ fontWeight: '500' }}>{codingLanguage.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>📊</span>
          <span style={{ fontWeight: '500' }}>{difficulty.name}</span>
        </div>
      </div>

      <div className="feedback-grid">
        <div className="feedback-section">
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Question</h3>
          <p>{question}</p>
        </div>
        <div className="feedback-section answer">
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Your Answer</h3>
          <p>{answer}</p>
        </div>
      </div>

      <div className="ai-feedback">
        <h3 style={{ fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
          <MessageCircle size={20} style={{ color: 'var(--primary)' }} />
          AI Feedback
        </h3>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text)' }}>
          {feedback}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onNextQuestion}
          className="btn btn-primary"
          style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
        >
          <span>Next Question</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;