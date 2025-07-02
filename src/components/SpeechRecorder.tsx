import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Clock, Type, MessageSquare, AlertCircle } from 'lucide-react';

interface SpeechRecorderProps {
  question: string;
  onAnswerComplete: (answer: string) => void;
}

const SpeechRecorder: React.FC<SpeechRecorderProps> = ({ 
  question, 
  onAnswerComplete 
}) => {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [transcript, setTranscript] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string>('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    // Only initialize SpeechRecognition once
    if (!recognitionRef.current) {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setIsSupported(false);
        setInputMode('text');
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = transcriptRef.current;
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        transcriptRef.current = finalTranscript;
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Provide more specific error messages based on error type
        let errorMessage = '';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network connection issue. Please check your internet connection and try again, or use text input instead.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions and try again, or use text input instead.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again or use text input instead.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not available. Please check your microphone and try again, or use text input instead.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available. Please use text input instead.';
            break;
          default:
            errorMessage = `Speech recognition failed: ${event.error}. Please try typing your answer instead.`;
        }
        
        setSpeechError(errorMessage);
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // Only run on mount/unmount
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current || inputMode !== 'voice') return;

    setSpeechError('');
    setIsRecording(true);
    setTimeLeft(20);
    setTranscript('');
    transcriptRef.current = '';

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setSpeechError('Failed to start speech recognition. Please try typing your answer.');
      setIsRecording(false);
      return;
    }

    // Start countdown timer
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // Wait a moment for final transcription, then submit
    setTimeout(() => {
      // Only submit 'No response recorded' if transcript is truly empty
      const finalTranscript = transcriptRef.current.trim();
      onAnswerComplete(finalTranscript ? finalTranscript : 'No response recorded');
    }, 1000);
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      onAnswerComplete(textAnswer.trim());
    } else {
      onAnswerComplete('No response provided');
    }
  };

  const switchInputMode = (mode: 'voice' | 'text') => {
    // Stop any ongoing recording when switching modes
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
    
    setInputMode(mode);
    setSpeechError('');
    setTranscript('');
    setTextAnswer('');
    setTimeLeft(20);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Question Display */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Question</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-xl text-gray-800 leading-relaxed">{question}</p>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-xl p-1 flex">
          <button
            onClick={() => switchInputMode('voice')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === 'voice'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isSupported}
          >
            <Mic className="h-4 w-4" />
            <span>Voice</span>
          </button>
          <button
            onClick={() => switchInputMode('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === 'text'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Type className="h-4 w-4" />
            <span>Type</span>
          </button>
        </div>
      </div>

      {/* Voice Input Mode */}
      {inputMode === 'voice' && (
        <>
          {speechError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 mb-3">{speechError}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => switchInputMode('text')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Switch to Text Input
                    </button>
                    <button
                      onClick={() => {
                        setSpeechError('');
                        startRecording();
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      Try Voice Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!speechError && (
            <>
              {/* Timer and Recording Status */}
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900">{timeLeft}s</span>
                </div>
                
                <div className={`flex items-center space-x-2 ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
                  {isRecording ? (
                    <Mic className="h-6 w-6 animate-pulse" />
                  ) : (
                    <MicOff className="h-6 w-6" />
                  )}
                  <span className="font-medium">
                    {isRecording ? 'Recording...' : 'Not Recording'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((20 - timeLeft) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Live Transcript */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Response (Live Transcript)</h3>
                <div className="bg-gray-50 rounded-xl p-4 min-h-[120px]">
                  {transcript ? (
                    <p className="text-gray-800">{transcript}</p>
                  ) : (
                    <p className="text-gray-400 italic">Start speaking... your response will appear here</p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="text-center">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Stop Recording
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={startRecording}
                      className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Start Recording
                    </button>
                    <p className="text-gray-600 text-sm">
                      Recording will automatically stop after 20 seconds
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Type Your Answer
            </h3>
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="text-right mt-2">
              <span className="text-sm text-gray-500">{textAnswer.length} characters</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleTextSubmit}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              disabled={!textAnswer.trim()}
            >
              Submit Answer
            </button>
          </div>
        </>
      )}

      {/* Not Supported Message */}
      {!isSupported && inputMode === 'voice' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="text-yellow-600 mb-4">
            <MicOff className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Speech Recognition Not Supported</h3>
          <p className="text-gray-600 mb-4">
            Your browser doesn't support speech recognition. Please use the text input option instead.
          </p>
          <button
            onClick={() => switchInputMode('text')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Switch to Text Input
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;