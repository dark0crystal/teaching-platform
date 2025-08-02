'use client';

import { useState } from 'react';

type MultipleChoiceMultipleAnswersQuestion = {
  id: string;
  type: "multiple_choice_multiple";
  question: string;
  choices: string[];
  correctAnswers: string[];
};

interface MultipleChoiceMultipleProps {
  question: MultipleChoiceMultipleAnswersQuestion;
  onAnswer: (isCorrect: boolean, selectedAnswers: string[]) => void;
}

export default function MultipleChoiceMultiple({ question, onAnswer }: MultipleChoiceMultipleProps) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChoiceToggle = (choice: string) => {
    if (showFeedback) return;
    
    setSelectedChoices(prev => 
      prev.includes(choice)
        ? prev.filter(c => c !== choice)
        : [...prev, choice]
    );
  };

  const handleSubmit = () => {
    const correct = selectedChoices.length === question.correctAnswers.length &&
      selectedChoices.every(choice => question.correctAnswers.includes(choice));
    
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, selectedChoices);
  };

  const resetQuestion = () => {
    setSelectedChoices([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const getChoiceStatus = (choice: string) => {
    if (!showFeedback) return 'default';
    
    const isSelected = selectedChoices.includes(choice);
    const isCorrectAnswer = question.correctAnswers.includes(choice);
    
    if (isSelected && isCorrectAnswer) return 'correct';
    if (isSelected && !isCorrectAnswer) return 'incorrect';
    if (!isSelected && isCorrectAnswer) return 'missed';
    return 'default';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {question.question}
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Select all that apply ({question.correctAnswers.length} correct answers)
      </p>

      <div className="space-y-3 mb-6">
        {question.choices.map((choice, index) => {
          const status = getChoiceStatus(choice);
          const isSelected = selectedChoices.includes(choice);
          
          return (
            <button
              key={index}
              onClick={() => handleChoiceToggle(choice)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                status === 'correct'
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : status === 'incorrect'
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : status === 'missed'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="flex items-center">
                <span className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center ${
                  status === 'correct'
                    ? 'border-green-500 bg-green-500'
                    : status === 'incorrect'
                    ? 'border-red-500 bg-red-500'
                    : status === 'missed'
                    ? 'border-yellow-500 bg-yellow-500'
                    : isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {(isSelected || status === 'missed') && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </span>
                {choice}
                {status === 'missed' && (
                  <span className="ml-2 text-yellow-600 text-sm">(missed)</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">
            {isCorrect 
              ? '✅ Correct! You got all the right answers.' 
              : `❌ Not quite right. Correct answers: ${question.correctAnswers.join(', ')}`
            }
          </p>
        </div>
      )}

      {!showFeedback ? (
        <button
          onClick={handleSubmit}
          disabled={selectedChoices.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Submit ({selectedChoices.length} selected)
        </button>
      ) : (
        <button
          onClick={resetQuestion}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}