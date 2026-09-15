import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import SpeechRecorder from './SpeechRecorder';
import FeedbackDisplay from './FeedbackDisplay';
import api from '../services/api';

const NUM_QUESTIONS = 5;

const InterviewSession = ({
  codingLanguage,
  difficulty,
  onBack,
}) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(NUM_QUESTIONS).fill(''));
  const [feedbacks, setFeedbacks] = useState(Array(NUM_QUESTIONS).fill(''));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionNumber, setSessionNumber] = useState(1);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const fetched = await fetchQuestionsFromGemini(NUM_QUESTIONS, codingLanguage.name, difficulty.name);
        setQuestions(fetched);
        setAnswers(Array(NUM_QUESTIONS).fill(''));
        setFeedbacks(Array(NUM_QUESTIONS).fill(''));
        setCurrentIdx(0);
        setShowFeedback(false);
      } catch (err) {
        console.error("Failed to load questions", err);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [sessionNumber, codingLanguage.name, difficulty.name]);

  const handleAnswerComplete = (answer) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIdx] = answer;
      return updated;
    });
    setShowFeedback(true);
  };

  const handleFeedbackReceived = (feedbackText) => {
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

  const allDone = answers.every(a => a) && feedbacks.every(f => f);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.2rem' }}>Loading questions...</div>;
  if (questions.length === 0) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>No questions available.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card mb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} />
          <span>Back to Setup</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{codingLanguage.icon}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{codingLanguage.name}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{difficulty.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Question #{currentIdx + 1} of {NUM_QUESTIONS}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={handlePrev} disabled={currentIdx === 0} className="btn btn-outline">
          Previous
        </button>
        <button onClick={handleNext} disabled={currentIdx === NUM_QUESTIONS - 1} className="btn btn-outline">
          Next
        </button>
      </div>

      {(showFeedback || !allDone) ? (
        <div style={{ marginBottom: '2rem' }}>
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
                if (currentIdx < NUM_QUESTIONS - 1) {
                  setCurrentIdx(idx => idx + 1);
                }
              }}
            />
          )}
        </div>
      ) : (
        <div className="card text-center">
          <h2 className="card-title">Great job! You've completed this set of questions.</h2>
          <button className="btn btn-primary mt-4" onClick={() => setSessionNumber(n => n + 1)}>
            Next Set of Questions
          </button>
        </div>
      )}

      <div className="card mt-8">
        <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your Answers Overview</h3>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          {questions.map((q, idx) => (
            <li key={idx} style={{ fontWeight: idx === currentIdx ? 'bold' : 'normal', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text)' }}>{q}</span>
              <div style={{ color: 'var(--primary)', marginTop: '0.25rem' }}>
                {answers[idx] ? answers[idx] : <span style={{ color: 'var(--text-muted)' }}>No answer yet</span>}
              </div>
              {feedbacks[idx] && (
                <div style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
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

async function fetchQuestionsFromGemini(n, language, difficulty) {
  const response = await api.get('/api/gemini/questions', {
    params: { n, language, difficulty },
  });
  return response.data.questions;
}