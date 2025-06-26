'use client'

import { useState } from "react"
import GradeStep1 from "./GradeStep1"
import SubjectStep2 from "./SubjectStep2"

export default function GradeSubjectFormWrapper() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    grade: "",
    subject: ""
  })

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 1))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const steps = [
    <GradeStep1 key="step1" grade={formData.grade} setFormData={setFormData} />,
    <SubjectStep2 key="step2" subject={formData.subject} grade={formData.grade} setFormData={setFormData} />
    ]


  return (
    <div className="p-4 w-screen min-h-screen relative mx-auto flex justify-center items-center">
      <form onSubmit={(e) => e.preventDefault()}>
        {steps[step]}

        <div className="flex justify-between fixed bottom-0 left-0 right-0 h-[10vh] p-4 border-t-2 border-gray-400 w-screen">
          {step > 0 && <button type="button" className="bg-red-200 border rounded-2xl px-4 w-[180px] " onClick={prevStep}>Back</button>}
          {step < steps.length - 1 ? (
            <button type="button" className="bg-green-200 border rounded-2xl px-4 w-[180px] " onClick={nextStep}>Next</button>
          ) : (
            <button type="submit" className="bg-blue-200 border rounded-2xl px-4 w-[180px] " onClick={() => alert(JSON.stringify(formData))}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
