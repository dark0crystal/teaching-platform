'use client'

import { useEffect, useState } from "react"
import GradeSubjectFormWrapper from "@/components/forms/GradeSubjectForm/GradeSubjectWrapper"

export default function Courses() {
  const [isFormVisible, setIsFormVisible] = useState(true)

  useEffect(() => {
    const grade = localStorage.getItem("grade")
    const subject = localStorage.getItem("subject")

    if (grade && subject) {
      setIsFormVisible(false)
    }
  }, [])

  return (
    <div className="h-screen w-screen bg-green-50 flex justify-center items-center">
      {isFormVisible ? (
        <GradeSubjectFormWrapper />
      ) : (
        <div className="text-2xl text-gray-800">
          ✅ You already selected <strong>{localStorage.getItem("grade")}</strong> - <strong>{localStorage.getItem("subject")}</strong>
        </div>
      )}
    </div>
  )
}
