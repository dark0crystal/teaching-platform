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
    <div className="p-4 border rounded-md max-w-md mx-auto">
      <form onSubmit={(e) => e.preventDefault()}>
        {steps[step]}

        <div className="flex justify-between mt-4">
          {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
          {step < steps.length - 1 ? (
            <button type="button" onClick={nextStep}>Next</button>
          ) : (
            <button type="submit" onClick={() => alert(JSON.stringify(formData))}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
