import LessonCard from "./LessonCard"
import { LessonCardInterface } from "./lissonCardInterface"

export default function LessonCardsWrapper() {
  const lessons: LessonCardInterface[] = [
    {
      lessonName: "Greetings",
      lessonId: "lsn001",
      lessonSlug: "greetings",
      lessonType: "listening",
    },
    {
      lessonName: "Basic Grammar",
      lessonId: "lsn002",
      lessonSlug: "basic-grammar",
      lessonType: "reading",
    },
    {
      lessonName: "Vocabulary Practice",
      lessonId: "lsn003",
      lessonSlug: "vocabulary-practice",
      lessonType: "quiz",
    },
    {
      lessonName: "Pronunciation",
      lessonId: "lsn004",
      lessonSlug: "pronunciation",
      lessonType: "speaking",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.lessonId} {...lesson} />
      ))}
    </div>
  )
}
