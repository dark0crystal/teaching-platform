'use client';

import { useState, useRef } from 'react';

type AudioQuestion = {
  id: string;
  type: "audio";
  audioUrl: string;
  correctAnswer: string;
  instruction?: string; // e.g., "Listen and type what you hear"
};

interface AudioQuestionProps {
  question: AudioQuestion;
  onAnswer: (isCorrect: boolean, userAnswer: string) => void;
  caseSensitive?: boolean;
}

export default function AudioQuestion({ 
  question, 
  onAnswer, 
  caseSensitive = false 
}: AudioQuestionProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const normalizeAnswer = (answer: string) => {
    const normalized = answer.trim();
    return caseSensitive ? normalized : normalized.toLowerCase();
  };

  const checkAnswer = (answer: string) => {
    const userNormalized = normalizeAnswer(answer);
    const correctNormalized = normalizeAnswer(question.correctAnswer);
    return userNormalized === correctNormalized;
  };

  const handlePlayAudio = async () => {
    if (audioRef.current) {
      try {
        setIsPlaying(true);
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setPlayCount(prev => prev + 1);
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    const correct = checkAnswer(userAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, userAnswer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !showFeedback) {
      handleSubmit();
    }
  };

  const resetQuestion = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    setPlayCount(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {question.instruction || 'Listen and type what you hear'}
      </h2>

      {/* Audio Player */}
      <div className="mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <audio
            ref={audioRef}
            src={question.audioUrl}
            onEnded={handleAudioEnded}
            preload="auto"
          />
          
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${
              isPlaying
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            } text-white shadow-lg`}
          >
            {isPlaying ? (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-white rounded animate-pulse"></div>
                <div className="w-1 h-4 bg-white rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-white rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <p className="text-sm text-blue-700 mt-3">
            {isPlaying ? 'Playing...' : 'Click to play audio'}
          </p>
          
          {playCount > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              Played {playCount} time{playCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Answer Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What did you hear?
        </label>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={showFeedback}
          placeholder="Type what you heard..."
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
            showFeedback
              ? isCorrect
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">
            {isCorrect 
              ? '✅ Perfect! You heard it correctly.' 
              : '❌ Not quite right.'
            }
          </p>
          
          {!isCorrect && (
            <div className="mt-2 text-sm">
              <p><strong>Correct answer:</strong> "{question.correctAnswer}"</p>
              {userAnswer && (
                <p><strong>You wrote:</strong> "{userAnswer}"</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!showFeedback ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Check Answer
            </button>
            <button
              onClick={() => setUserAnswer('')}
              disabled={!userAnswer}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Clear
            </button>
          </>
        ) : (
          <button
            onClick={resetQuestion}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-500">
          {caseSensitive ? 'Case sensitive' : 'Case insensitive'}
        </p>
        <button
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors duration-200"
        >
          🔊 Replay audio
        </button>
      </div>
    </div>
  );
}   