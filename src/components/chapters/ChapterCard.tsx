"use client"
import { ChapterCardInterface } from "./ChapterCardInterface";

export default function ChapterCard({ chapterNumber, chapterName }: ChapterCardInterface) {
  return (
    <div className="bg-white shadow-md rounded-3xl p-6 w-72 h-40 flex flex-col justify-between items-center border-2 border-blue-200 hover:shadow-xl transition-all">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-700 font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full">
          {chapterNumber}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{chapterName}</h2>
      </div>
      <button className="mt-4 px-4 py-2 bg-green-400 text-white rounded-full hover:bg-green-500 transition">
        Start
      </button>
    </div>
  )
}
