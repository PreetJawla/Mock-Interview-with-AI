import React, { useEffect, useRef, useState } from 'react';

// @ts-ignore
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
type SpeechRecognition = typeof SpeechRecognition;

interface SpeechRecorderProps {
  question: string;
  onAnswerComplete: (answer: string) => void;
}

const SpeechRecorder: React.FC<SpeechRecorderProps> = ({ question, onAnswerComplete }) => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Question</h2>
        <div className="bg-gray-50 rounded-xl p-4">{question}</div>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white font-semibold`}
        >
          {isRecording ? 'Stop Recording' : 'Record (20s)'}
        </button>
        {isRecording && <span>{timeLeft}s</span>}
      </div>
      <textarea
        className="w-full h-32 p-3 border border-gray-300 rounded-xl mb-4"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Speak or type your answer here..."
      />
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold"
          disabled={!transcript.trim()}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default SpeechRecorder;