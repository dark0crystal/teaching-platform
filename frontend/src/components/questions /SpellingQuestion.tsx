'use client';

import { useState, useRef } from 'react';

type SpellingQuestion = {
  id: string;
  type: "spelling";
  audioUrl?: string;
  correctSpelling: string;
  word?: string; // Optional word to display instead of audio
  instruction?: string;
};

interface SpellingQuestionProps {
  question: SpellingQuestion;
  onAnswer: (isCorrect: boolean, userSpelling: string) => void;
}

export default function SpellingQuestion({ question, onAnswer }: SpellingQuestionProps) {
  const [userLetters, setUserLetters] = useState<string[]>(
    new Array(question.correctSpelling.length).fill('')
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLetterChange = (index: number, value: string) => {
    if (showFeedback) return;
    
    // Only allow single characters and letters
    const letter = value.slice(-1).toLowerCase();
    if (letter && !/^[a-zA-Z]$/.test(letter)) return;
    
    const newLetters = [...userLetters];
    newLetters[index] = letter;
    setUserLetters(newLetters);

    // Auto-focus next input
    if (letter && index < userLetters.length - 1) {
      setCurrentIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (showFeedback) return;

    if (e.key === 'Backspace' && !userLetters[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      setCurrentIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setCurrentIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < userLetters.length - 1) {
      setCurrentIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleInputFocus = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePlayAudio = async () => {
    if (audioRef.current && question.audioUrl) {
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
    const userSpelling = userLetters.join('').toLowerCase();
    const correctSpelling = question.correctSpelling.toLowerCase();
    const correct = userSpelling === correctSpelling;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, userLetters.join(''));
  };

  const resetQuestion = () => {
    setUserLetters(new Array(question.correctSpelling.length).fill(''));
    setCurrentIndex(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setPlayCount(0);
    inputRefs.current[0]?.focus();
  };

  const getLetterStatus = (index: number) => {
    if (!showFeedback) return 'default';
    
    const userLetter = userLetters[index].toLowerCase();
    const correctLetter = question.correctSpelling[index].toLowerCase();
    
    if (userLetter === correctLetter) return 'correct';
    if (userLetter && userLetter !== correctLetter) return 'incorrect';
    return 'missing';
  };

  const isComplete = userLetters.every(letter => letter.trim() !== '');

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        {question.instruction || 'Spell the word'}
      </h2>

      {/* Audio section */}
      {question.audioUrl && (
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
              } text-white shadow-lg mb-3`}
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
            
            <p className="text-sm text-blue-700">
              {isPlaying ? 'Playing...' : 'Listen and spell'}
            </p>
            
            {playCount > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Played {playCount} time{playCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Word display (if no audio) */}
      {question.word && !question.audioUrl && (
        <div className="mb-8 text-center">
          <div className="inline-block bg-blue-100 border border-blue-300 rounded-lg px-6 py-4">
            <span className="text-2xl font-bold text-blue-900">
              "{question.word}"
            </span>
          </div>
        </div>
      )}

      {/* Spelling input */}
      <div className="mb-8">
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {userLetters.map((letter, index) => {
            const status = getLetterStatus(index);
            return (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={letter}
                onChange={(e) => handleLetterChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => handleInputFocus(index)}
                disabled={showFeedback}
                maxLength={1}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                  status === 'correct'
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : status === 'incorrect'
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : status === 'missing'
                    ? 'border-yellow-500 bg-yellow-50'
                    : currentIndex === index
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ textTransform: 'uppercase' }}
              />
            );
          })}
        </div>
        
        <p className="text-sm text-gray-600 text-center mt-4">
          {question.correctSpelling.length} letters • Use arrow keys to navigate
        </p>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium text-center">
            {isCorrect 
              ? '✅ Perfect spelling!' 
              : '❌ Not quite right.'
            }
          </p>
          
          {!isCorrect && (
            <div className="mt-2 text-center">
              <p className="text-sm">
                <strong>Correct spelling:</strong> {question.correctSpelling.toUpperCase()}
              </p>
              <p className="text-sm">
                <strong>Your spelling:</strong> {userLetters.join('').toUpperCase() || '(incomplete)'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!showFeedback ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Check Spelling
            </button>
            <button
              onClick={resetQuestion}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
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

      {question.audioUrl && (
        <div className="flex justify-center mt-3">
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors duration-200"
          >
            🔊 Replay audio
          </button>
        </div>
      )}
    </div>
  );
}