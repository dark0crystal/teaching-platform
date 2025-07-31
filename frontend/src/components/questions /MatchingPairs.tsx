'use client';

import { useState } from 'react';

type MatchingPairsQuestion = {
  id: string;
  type: "matching";
  pairs: {
    left: string;
    right: string;
  }[];
};

interface MatchingPairsProps {
  question: MatchingPairsQuestion;
  onAnswer: (isCorrect: boolean, userMatches: Array<{left: string, right: string}>) => void;
}

export default function MatchingPairs({ question, onAnswer }: MatchingPairsProps) {
  const [selectedLeft, setSelectedLeft] = useState<string>('');
  const [matches, setMatches] = useState<Array<{left: string, right: string}>>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Shuffle the right items for display
  const [shuffledRightItems] = useState(() => {
    const rightItems = question.pairs.map(pair => pair.right);
    return rightItems.sort(() => Math.random() - 0.5);
  });

  const isMatched = (item: string, side: 'left' | 'right') => {
    return matches.some(match => 
      side === 'left' ? match.left === item : match.right === item
    );
  };

  const handleLeftItemClick = (leftItem: string) => {
    if (showFeedback || isMatched(leftItem, 'left')) return;
    
    if (selectedLeft === leftItem) {
      setSelectedLeft(''); // Deselect if clicking the same item
    } else {
      setSelectedLeft(leftItem);
    }
  };

  const handleRightItemClick = (rightItem: string) => {
    if (showFeedback || isMatched(rightItem, 'right') || !selectedLeft) return;
    
    // Create new match
    const newMatch = { left: selectedLeft, right: rightItem };
    setMatches(prev => [...prev, newMatch]);
    setSelectedLeft('');
  };

  const removeMatch = (matchToRemove: {left: string, right: string}) => {
    if (showFeedback) return;
    setMatches(prev => prev.filter(match => 
      !(match.left === matchToRemove.left && match.right === matchToRemove.right)
    ));
  };

  const handleSubmit = () => {
    if (matches.length !== question.pairs.length) return;
    
    const correct = matches.every(userMatch => 
      question.pairs.some(correctPair => 
        correctPair.left === userMatch.left && correctPair.right === userMatch.right
      )
    );
    
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, matches);
  };

  const resetQuestion = () => {
    setMatches([]);
    setSelectedLeft('');
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const getMatchStatus = (match: {left: string, right: string}) => {
    if (!showFeedback) return 'pending';
    
    const isCorrectMatch = question.pairs.some(pair => 
      pair.left === match.left && pair.right === match.right
    );
    
    return isCorrectMatch ? 'correct' : 'incorrect';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Match the pairs
      </h2>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Click a word on the left, then click its match on the right
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">
            Left Items
          </h3>
          {question.pairs.map((pair, index) => (
            <button
              key={`left-${index}`}
              onClick={() => handleLeftItemClick(pair.left)}
              disabled={showFeedback || isMatched(pair.left, 'left')}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                isMatched(pair.left, 'left')
                  ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                  : selectedLeft === pair.left
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              {pair.left}
            </button>
          ))}
        </div>

        {/* Matches column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">
            Your Matches ({matches.length}/{question.pairs.length})
          </h3>
          <div className="space-y-2">
            {matches.map((match, index) => {
              const status = getMatchStatus(match);
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    status === 'correct'
                      ? 'border-green-500 bg-green-50'
                      : status === 'incorrect'
                      ? 'border-red-500 bg-red-50'
                      : 'border-blue-300 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{match.left}</div>
                      <div className="text-gray-600">→ {match.right}</div>
                    </div>
                    {!showFeedback && (
                      <button
                        onClick={() => removeMatch(match)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    )}
                    {showFeedback && (
                      <div className={`text-lg ${
                        status === 'correct' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {status === 'correct' ? '✓' : '✗'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {matches.length === 0 && (
              <div className="text-center text-gray-500 italic py-8">
                No matches yet
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">
            Right Items
          </h3>
          {shuffledRightItems.map((rightItem, index) => (
            <button
              key={`right-${index}`}
              onClick={() => handleRightItemClick(rightItem)}
              disabled={showFeedback || isMatched(rightItem, 'right') || !selectedLeft}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                isMatched(rightItem, 'right')
                  ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                  : !selectedLeft
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
              }`}
            >
              {rightItem}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="font-medium text-center">
            {isCorrect 
              ? '✅ Perfect! All pairs matched correctly.' 
              : '❌ Some pairs are incorrect. Check the highlighted matches above.'
            }
          </p>
          {!isCorrect && (
            <div className="mt-3 text-sm">
              <p className="font-medium">Correct pairs:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {question.pairs.map((pair, index) => (
                  <div key={index} className="bg-white bg-opacity-50 p-2 rounded">
                    {pair.left} → {pair.right}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!showFeedback ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={matches.length !== question.pairs.length}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Check Matches ({matches.length}/{question.pairs.length})
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

      {selectedLeft && !showFeedback && (
        <p className="text-sm text-blue-600 mt-3 text-center">
          "{selectedLeft}" selected. Now click its match on the right.
        </p>
      )}
    </div>
  );
}