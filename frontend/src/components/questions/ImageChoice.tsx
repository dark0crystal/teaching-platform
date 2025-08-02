'use client';

import { useState } from 'react';

type ImageChoiceQuestion = {
  id: string;
  type: "image_choice";
  word: string;
  imageChoices: {
    imageUrl: string;
    label: string;
  }[];
  correctImageLabel: string;
};

interface ImageChoiceProps {
  question: ImageChoiceQuestion;
  onAnswer: (isCorrect: boolean, selectedLabel: string) => void;
}

export default function ImageChoice({ question, onAnswer }: ImageChoiceProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const handleImageSelect = (label: string) => {
    if (showFeedback) return;
    
    setSelectedImage(label);
    const correct = label === question.correctImageLabel;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, label);
  };

  const handleImageError = (imageUrl: string) => {
    setImageLoadErrors(prev => new Set(prev).add(imageUrl));
  };

  const resetQuestion = () => {
    setSelectedImage('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const getImageStatus = (label: string) => {
    if (!showFeedback) return 'default';
    
    if (label === selectedImage) {
      return isCorrect ? 'correct' : 'incorrect';
    }
    
    if (label === question.correctImageLabel) {
      return 'missed';
    }
    
    return 'default';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Which image represents:
      </h2>

      {/* Word to identify */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-blue-100 border border-blue-300 rounded-lg px-6 py-4">
          <span className="text-2xl font-bold text-blue-900">
            "{question.word}"
          </span>
        </div>
      </div>

      {/* Image choices */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {question.imageChoices.map((choice, index) => {
          const status = getImageStatus(choice.label);
          const hasError = imageLoadErrors.has(choice.imageUrl);
          
          return (
            <button
              key={index}
              onClick={() => handleImageSelect(choice.label)}
              disabled={showFeedback}
              className={`relative aspect-square rounded-lg overflow-hidden border-4 transition-all duration-200 ${
                status === 'correct'
                  ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                  : status === 'incorrect'
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : status === 'missed'
                  ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                  : selectedImage === choice.label
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {hasError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-sm">Image failed to load</div>
                  </div>
                </div>
              ) : (
                <img
                  src={choice.imageUrl}
                  alt={choice.label}
                  onError={() => handleImageError(choice.imageUrl)}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Selection indicator */}
              {selectedImage === choice.label && (
                <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  status === 'correct' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {status === 'correct' ? '✓' : '✗'}
                </div>
              )}
              
              {/* Missed correct answer indicator */}
              {status === 'missed' && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
              )}
              
              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm p-2">
                {choice.label}
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium text-center">
            {isCorrect 
              ? '✅ Excellent! You selected the correct image.' 
              : `❌ Not quite right. The correct answer is "${question.correctImageLabel}".`
            }
          </p>
          {!isCorrect && selectedImage && (
            <p className="text-sm mt-1 text-center">
              You selected: "{selectedImage}"
            </p>
          )}
        </div>
      )}

      {showFeedback ? (
        <button
          onClick={resetQuestion}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Click on the image that best represents "{question.word}"
          </p>
        </div>
      )}
    </div>
  );
}