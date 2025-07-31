'use client';

import { useState } from 'react';

type MultipleChoiceQuestion = {
  id: string;
  type: "multiple_choice_single";
  question: string;
  choices: string[];
  correctAnswer: string;
};

interface MultipleChoiceSingleProps {
  question: MultipleChoiceQuestion;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
}

export default function MultipleChoiceSingle({ question, onAnswer }: MultipleChoiceSingleProps) {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    const correct = choice === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, choice);
  };

  const resetQuestion = () => {
    setSelectedChoice('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {question.question}
      </h2>

      <div className="space-y-3 mb-6">
        {question.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && handleChoiceSelect(choice)}
            disabled={showFeedback}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              selectedChoice === choice
                ? showFeedback
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="flex items-center">
              <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedChoice === choice
                  ? showFeedback
                    ? isCorrect
                      ? 'border-green-500 bg-green-500'
                      : 'border-red-500 bg-red-500'
                    : 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedChoice === choice && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </span>
              {choice}
            </span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">
            {isCorrect ? '✅ Correct!' : `❌ Incorrect. The correct answer is: ${question.correctAnswer}`}
          </p>
        </div>
      )}

      {showFeedback && (
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