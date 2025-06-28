"use client"
import LessonCardsWrapper from "../lessons/LessonCardsWrapper";
import { ChapterCardInterface } from "./ChapterCardInterface";

export default function ChapterCard({ chapterNumber, chapterName }: ChapterCardInterface) {
  return (
    <div className="bg-white shadow-md rounded-3xl px-[10vw] py-[3vw] w-fit h-fit flex flex-col justify-between items-center border-2 border-blue-200 hover:shadow-xl transition-all ">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-700 font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full">
          {chapterNumber}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{chapterName}</h2>
      </div>
      <div>
        <LessonCardsWrapper/>
      </div>
      
    </div>
  )
}
