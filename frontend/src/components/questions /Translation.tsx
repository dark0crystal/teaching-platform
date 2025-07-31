'use client';

import { useState } from 'react';

type TranslationQuestion = {
  id: string;
  type: "translation";
  sentence: string; // in source language
  correctAnswer: string; // in target language
  sourceLanguage?: string;
  targetLanguage?: string;
};

interface TranslationProps {
  question: TranslationQuestion;
  onAnswer: (isCorrect: boolean, userTranslation: string) => void;
  acceptableVariations?: string[]; // Optional alternative correct answers
}

export default function Translation({ 
  question, 
  onAnswer, 
  acceptableVariations = [] 
}: TranslationProps) {
  const [userTranslation, setUserTranslation] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [matchedAnswer, setMatchedAnswer] = useState<string>('');

  const normalizeText = (text: string) => {
    return text.trim().toLowerCase()
      .replace(/[.,!?;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  };

  const checkTranslation = (translation: string) => {
    const normalizedUserAnswer = normalizeText(translation);
    const normalizedCorrectAnswer = normalizeText(question.correctAnswer);
    
    // Check exact match
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setMatchedAnswer(question.correctAnswer);
      return true;
    }
    
    // Check acceptable variations
    for (const variation of acceptableVariations) {
      if (normalizedUserAnswer === normalizeText(variation)) {
        setMatchedAnswer(variation);
        return true;
      }
    }
    
    return false;
  };

  const handleSubmit = () => {
    const correct = checkTranslation(userTranslation);
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, userTranslation);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userTranslation.trim() && !showFeedback) {
      handleSubmit();
    }
  };

  const resetQuestion = () => {
    setUserTranslation('');
    setShowFeedback(false);
    setIsCorrect(false);
    setMatchedAnswer('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Translate the sentence
      </h2>

      {question.sourceLanguage && question.targetLanguage && (
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {question.sourceLanguage} → {question.targetLanguage}
          </span>
        </div>
      )}

      {/* Source sentence */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-lg text-blue-900 font-medium text-center">
            "{question.sentence}"
          </p>
        </div>
      </div>

      {/* Translation input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your translation:
        </label>
        <textarea
          value={userTranslation}
          onChange={(e) => !showFeedback && setUserTranslation(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={showFeedback}
          placeholder="Type your translation here..."
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-lg resize-none focus:outline-none transition-colors duration-200 ${
            showFeedback
              ? isCorrect
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            Press Enter to submit
          </p>
          <p className="text-xs text-gray-500">
            {userTranslation.length}/500
          </p>
        </div>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">
            {isCorrect 
              ? '✅ Excellent translation!' 
              : '❌ Not quite right.'
            }
          </p>
          
          {isCorrect && matchedAnswer && (
            <p className="text-sm mt-1">
              Accepted answer: "{matchedAnswer}"
            </p>
          )}
          
          {!isCorrect && (
            <div className="mt-2">
              <p className="text-sm">
                <strong>Correct translation:</strong> "{question.correctAnswer}"
              </p>
              {acceptableVariations.length > 0 && (
                <p className="text-sm mt-1">
                  <strong>Also acceptable:</strong> {acceptableVariations.map(v => `"${v}"`).join(', ')}
                </p>
              )}
              {userTranslation && (
                <p className="text-sm mt-1">
                  <strong>Your translation:</strong> "{userTranslation}"
                </p>
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
              disabled={!userTranslation.trim()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Check Translation
            </button>
            <button
              onClick={() => setUserTranslation('')}
              disabled={!userTranslation}
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

      {acceptableVariations.length > 0 && !showFeedback && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Multiple acceptable translations may be accepted
        </p>
      )}
    </div>
  );
}