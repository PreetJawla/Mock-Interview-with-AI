import React, { useEffect, useRef, useState } from 'react';

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechRecorder = ({ question, onAnswerComplete }) => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Reset state when question changes
  useEffect(() => {
    setTranscript('');
    setIsRecording(false);
    setTimeLeft(20);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [question]);

  // Setup recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript((prev) => prev + finalTranscript);
    };

    recognitionRef.current.onend = () => setIsRecording(false);

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setIsRecording(true);
    setTimeLeft(20);
    recognitionRef.current.start();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSubmit = () => {
    onAnswerComplete(transcript.trim() ? transcript.trim() : 'No response provided');
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="card-title">Question</h2>
        <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)' }}>
          {question}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? 'btn btn-secondary' : 'btn btn-primary'}
          style={isRecording ? { backgroundColor: '#ef4444' } : {}}
        >
          {isRecording ? 'Stop Recording' : 'Record (20s)'}
        </button>
        {isRecording && <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{timeLeft}s</span>}
      </div>
      
      <textarea
        className="transcript-box"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Speak or type your answer here..."
        style={{ marginBottom: '1rem' }}
      />
      
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          style={{ backgroundColor: '#10b981' }}
          disabled={!transcript.trim()}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default SpeechRecorder;