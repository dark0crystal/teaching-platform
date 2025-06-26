interface Props {
  grade: string
  setFormData: React.Dispatch<React.SetStateAction<{ grade: string; subject: string }>>
}

export default function GradeStep1({ grade, setFormData }: Props) {
  return (
    <div>
      <label>Select Grade:</label>
      <select
        value={grade}
        onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
      >
        <option value="">Select</option>
        <option value="grade1">Grade 1</option>
        <option value="grade2">Grade 2</option>
        <option value="grade3">Grade 3</option>
        <option value="grade4">Grade 4</option>
      </select>
    </div>
  )
}
