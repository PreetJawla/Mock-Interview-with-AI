import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { generateQuestion } from '../services/api';

const QuestionDisplay = ({ 
  codingLanguage, 
  difficulty, 
  onQuestionGenerated 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="card text-center">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', backgroundColor: 'var(--primary)', borderRadius: '50%', marginBottom: '1.5rem', color: 'white' }}>
          <Play size={40} />
        </div>
        <h2 className="card-title" style={{ fontSize: '1.8rem' }}>Ready for Your Technical Interview?</h2>
        
        <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{codingLanguage.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600' }}>{codingLanguage.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Technology</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>📊</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600' }}>{difficulty.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Difficulty</div>
            </div>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Click the button below to generate your interview question. You'll have 20 seconds to answer once the question appears.
        </p>
      </div>

      {error && (
        <div className="alert">
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerateQuestion}
        disabled={loading}
        className="btn btn-primary"
        style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
      >
        {loading ? (
          <>
            <Loader2 className="loading-spinner" style={{ width: '24px', height: '24px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
            <span>Generating Question...</span>
          </>
        ) : (
          <>
            <Play size={24} />
            <span>Generate Question</span>
          </>
        )}
      </button>
    </div>
  );
};

export default QuestionDisplay;