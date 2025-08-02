'use client';

import { useState } from 'react';

type FillInTheBlankQuestion = {
  id: string;
  type: "fill_in_blank";
  sentence: string; // "The capital of Oman is ____."
  correctAnswer: string;
};

interface FillInTheBlankProps {
  question: FillInTheBlankQuestion;
  onAnswer: (isCorrect: boolean, userAnswer: string) => void;
  caseSensitive?: boolean;
}

export default function FillInTheBlank({ 
  question, 
  onAnswer, 
  caseSensitive = false 
}: FillInTheBlankProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = (answer: string) => {
    const userAnswerProcessed = caseSensitive ? answer.trim() : answer.trim().toLowerCase();
    const correctAnswerProcessed = caseSensitive ? question.correctAnswer : question.correctAnswer.toLowerCase();
    
    return userAnswerProcessed === correctAnswerProcessed;
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
  };

  // Split sentence at the blank (____) to render it properly
  const renderSentence = () => {
    const parts = question.sentence.split('____');
    
    if (parts.length === 2) {
      return (
        <div className="text-lg mb-6 flex flex-wrap items-center gap-2">
          <span>{parts[0]}</span>
          <div className="inline-flex flex-col">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={showFeedback}
              placeholder="type here..."
              className={`px-3 py-2 border-b-2 bg-transparent text-center min-w-32 focus:outline-none transition-colors duration-200 ${
                showFeedback
                  ? isCorrect
                    ? 'border-green-500 text-green-800'
                    : 'border-red-500 text-red-800'
                  : 'border-blue-400 focus:border-blue-600'
              }`}
            />
          </div>
          <span>{parts[1]}</span>
        </div>
      );
    }
    
    // Fallback if no ____ found
    return (
      <div className="mb-6">
        <p className="text-lg mb-4">{question.sentence}</p>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => !showFeedback && setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={showFeedback}
          placeholder="Type your answer..."
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
            showFeedback
              ? isCorrect
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Fill in the blank
      </h2>

      {renderSentence()}

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">
            {isCorrect 
              ? '✅ Correct!' 
              : `❌ Incorrect. The correct answer is: "${question.correctAnswer}"`
            }
          </p>
          {!isCorrect && userAnswer && (
            <p className="text-sm mt-1">Your answer: "{userAnswer}"</p>
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

      <p className="text-xs text-gray-500 mt-3 text-center">
        {caseSensitive ? 'Case sensitive' : 'Case insensitive'}
      </p>
    </div>
  );
}