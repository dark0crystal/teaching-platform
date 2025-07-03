'use client'

import { ChapterCardInterface } from "./ChapterCardInterface"
import ChapterCard from "./ChapterCard"

export default function ChaptersWrapper() {
  const chapters: ChapterCardInterface[] = [
    { chapterNumber: 1, chapterName: "Nationalities" },
    { chapterNumber: 2, chapterName: "Names" },
    { chapterNumber: 3, chapterName: "Animals" }
  ]

  return (
    <div className="min-h-screen bg-sky-50 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Choose a Chapter</h1>
      <div className="flex flex-col justify-center items-center gap-8">
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.chapterNumber}
            chapterNumber={chapter.chapterNumber}
            chapterName={chapter.chapterName}
          />
        ))}
      </div>
    </div>
  )
}
