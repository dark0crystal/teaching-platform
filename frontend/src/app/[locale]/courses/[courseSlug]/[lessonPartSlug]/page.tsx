'use client';

import React from 'react';
import MultipleChoiceMultiple from '@/components/questions/MultipleChoiceMultiple';
import FillInTheBlank from '@/components/questions/FillInTheBlank';

interface Props {
  params: {
    lessonPartSlug: string;
  };
}

// Sample questions based on the slug
const lessonData: Record<string, Question[]> = {
  'fruits-basics': [
    {
      id: 'q1',
      type: 'multiple_choice_multiple',
      question: 'Which of the following are fruits?',
      choices: ['Carrot', 'Apple', 'Potato', 'Banana', 'Tomato'],
      correctAnswers: ['Apple', 'Banana', 'Tomato'],
    },
    {
      id: 'q2',
      type: 'fill_in_blank',
      question: 'The _____ is yellow and curved.',
      correctAnswer: 'banana',
    },
  ],
  'animals-basics': [
    {
      id: 'q3',
      type: 'multiple_choice_multiple',
      question: 'Which of these can fly?',
      choices: ['Dog', 'Eagle', 'Penguin', 'Butterfly'],
      correctAnswers: ['Eagle', 'Butterfly'],
    },
  ],
};

export default function LessonPart({ params }: Props) {
  const { lessonPartSlug } = params;

  const questions = lessonData[lessonPartSlug] || [];

  const handleAnswer = (id: string, isCorrect: boolean, userAnswer: string | string[]) => {
    console.log(`Question ${id} answered`, { isCorrect, userAnswer });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">{lessonPartSlug.replace(/-/g, ' ')}</h1>
      <div className="space-y-8">
        {questions.map((q) => {
          switch (q.type) {
            case 'multiple_choice_multiple':
              return (
                <MultipleChoiceMultiple
                  key={q.id}
                  question={q}
                  onAnswer={(isCorrect, answer) => handleAnswer(q.id, isCorrect, answer)}
                />
              );
            case 'fill_in_blank':
              return (
                <FillInTheBlank
                  key={q.id}
                  question={q}
                  onAnswer={(isCorrect, answer) => handleAnswer(q.id, isCorrect, answer)}
                />
              );
            default:
              return <div key={q.id}>Unsupported question type</div>;
          }
        })}
      </div>
    </div>
  );
}
