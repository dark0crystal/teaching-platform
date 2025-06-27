'use client'

import { useEffect, useState } from "react"
import GradeSubjectFormWrapper from "@/components/forms/GradeSubjectForm/GradeSubjectWrapper"

export default function Courses() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Only runs on client
    const grade = localStorage.getItem("grade")
    const subject = localStorage.getItem("subject")

    if (!grade || !subject) {
      setIsFormVisible(true)
    }

    // Mark hydration complete
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    // Optional: return a loading spinner here if needed
    return null
  }

  return (
    <div className="h-screen w-screen bg-green-50 flex justify-center items-center">
      {isFormVisible ? (
        <GradeSubjectFormWrapper />
      ) : (
        <div className="text-2xl text-gray-800 text-center space-y-4">
          <p>
            ✅ You already selected <strong>{localStorage.getItem("grade")}</strong> - <strong>{localStorage.getItem("subject")}</strong>
          </p>
          <button
            className="bg-red-100 px-4 py-2 rounded hover:bg-red-200"
            onClick={() => {
              localStorage.removeItem("grade")
              localStorage.removeItem("subject")
              window.location.reload()
            }}
          >
            Change Selection
          </button>
        </div>
      )}
    </div>
  )
}
