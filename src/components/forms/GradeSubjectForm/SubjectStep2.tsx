"use client"
interface Props {
  grade: string
  subject: string
  setFormData: React.Dispatch<React.SetStateAction<{ grade: string; subject: string }>>
}

export default function SubjectStep2({ grade, subject, setFormData }: Props) {
  const subjectOptions = {
    grade1: ["Math", "English"],
    grade2: ["Science", "Arabic"],
    grade3: ["Math", "Science", "History"],
    grade4: ["Geography", "Islamic Studies"],
  }

  const options = subjectOptions[grade as keyof typeof subjectOptions] || []

  return (
    <div>
      <label className="block mb-4 text-lg font-semibold">Select Subject for {grade}:</label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((subj) => (
          <button
            key={subj}
            type="button"
            className={`h-20 w-32 border-2 rounded-lg text-center font-medium ${
              subject === subj ? "bg-green-500 text-white" : "bg-white text-black"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, subject: subj }))}
          >
            {subj}
          </button>
        ))}
      </div>
    </div>
  )
}
