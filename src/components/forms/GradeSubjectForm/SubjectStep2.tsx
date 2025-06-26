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
    grade4: ["Geography", "Islamic Studies"]
  }

  return (
    <div>
      <label>Select Subject for {grade}:</label>
      <select
        value={subject}
        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
      >
        <option value="">Select</option>
        {subjectOptions[grade as keyof typeof subjectOptions]?.map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
        ))}
      </select>
    </div>
  )
}
