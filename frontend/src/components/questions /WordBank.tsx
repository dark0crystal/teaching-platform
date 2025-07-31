'use client';

import { useState, useRef } from 'react';

type WordBankQuestion = {
  id: string;
  type: "word_bank";
  words: string[];
  correctOrder: string[];
};

interface WordBankProps {
  question: WordBankQuestion;
  onAnswer: (isCorrect: boolean, userOrder: string[]) => void;
}

export default function WordBank({ question, onAnswer }: WordBankProps) {
  const [availableWords, setAvailableWords] = useState<string[]>([...question.words]);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, word: string) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
  };

  const handleDropOnSentence = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    
    if (!draggedWord) return;

    // Remove from available words
    setAvailableWords(prev => prev.filter(word => word !== draggedWord));
    
    // Add to sentence at specific position or at the end
    setSentenceWords(prev => {
      const newSentence = [...prev];
      if (index !== undefined && index <= newSentence.length) {
        newSentence.splice(index, 0, draggedWord);
      } else {
        newSentence.push(draggedWord);
      }
      return newSentence;
    });

    setDraggedWord(null);
    dragCounter.current = 0;
  };

  const handleDropOnBank = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedWord) return;

    // Remove from sentence
    setSentenceWords(prev => prev.filter(word => word !== draggedWord));
    
    // Add back to available words
    setAvailableWords(prev => [...prev, draggedWord]);

    setDraggedWord(null);
    dragCounter.current = 0;
  };

  const moveWordToSentence = (word: string, index?: number) => {
    setAvailableWords(prev => prev.filter(w => w !== word));
    setSentenceWords(prev => {
      const newSentence = [...prev];
      if (index !== undefined && index <= newSentence.length) {
        newSentence.splice(index, 0, word);
      } else {
        newSentence.push(word);
      }
      return newSentence;
    });
  };

  const moveWordToBank = (word: string) => {
    setSentenceWords(prev => prev.filter(w => w !== word));
    setAvailableWords(prev => [...prev, word]);
  };

  const handleSubmit = () => {
    const correct = sentenceWords.length === question.correctOrder.length &&
      sentenceWords.every((word, index) => word === question.correctOrder[index]);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, sentenceWords);
  };

  const resetQuestion = () => {
    setAvailableWords([...question.words]);
    setSentenceWords([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Arrange the words to form a correct sentence
      </h2>

      {/* Sentence Area */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Your sentence:</h3>
        <div
          className={`min-h-16 p-4 border-2 border-dashed rounded-lg transition-colors duration-200 ${
            draggedWord && dragCounter.current > 0 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDropOnSentence(e)}
        >
          {sentenceWords.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              Drag words here to build your sentence
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sentenceWords.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <button
                    onClick={() => !showFeedback && moveWordToBank(word)}
                    disabled={showFeedback}
                    draggable={!showFeedback}
                    onDragStart={(e) => handleDragStart(e, word)}
                    onDragEnd={handleDragEnd}
                    className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      showFeedback
                        ? isCorrect || question.correctOrder[index] === word
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {word}
                  </button>
                  {index < sentenceWords.length - 1 && (
                    <span className="mx-1 text-gray-400">•</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Word Bank */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Available words:</h3>
        <div
          className={`min-h-16 p-4 border-2 border-dashed rounded-lg transition-colors duration-200 ${
            draggedWord && dragCounter.current > 0 
              ? 'border-gray-400 bg-gray-100' 
              : 'border-gray-300 bg-white'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDropOnBank}
        >
          {availableWords.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              All words used
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableWords.map((word, index) => (
                <button
                  key={`${word}-available-${index}`}
                  onClick={() => !showFeedback && moveWordToSentence(word)}
                  disabled={showFeedback}
                  draggable={!showFeedback}
                  onDragStart={(e) => handleDragStart(e, word)}
                  onDragEnd={handleDragEnd}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium">
            {isCorrect 
              ? '✅ Correct! Perfect sentence structure.' 
              : `❌ Not quite right. Correct order: "${question.correctOrder.join(' ')}"`
            }
          </p>
          {!isCorrect && sentenceWords.length > 0 && (
            <p className="text-sm mt-1">Your order: "{sentenceWords.join(' ')}"</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!showFeedback ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={sentenceWords.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Check Sentence
            </button>
            <button
              onClick={resetQuestion}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
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
        Click words to move them, or drag and drop between areas
      </p>
    </div>
  );
}