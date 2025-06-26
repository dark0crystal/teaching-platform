interface Props {
  grade: string
  setFormData: React.Dispatch<React.SetStateAction<{ grade: string; subject: string }>>
}

const grades = ["grade1", "grade2", "grade3", "grade4"]

export default function GradeStep1({ grade, setFormData }: Props) {
  return (
    <div>
      <label className="block mb-4 text-lg font-semibold">Select Grade:</label>
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-row ">
        {grades.map((g) => (
          <button
            key={g}
            type="button"
            className={`h-24 w-24 border-2 rounded-lg ${
              grade === g ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
            onClick={() => setFormData((prev) => ({ ...prev, grade: g }))}
          >
            {g.replace("grade", "Grade ")}
          </button>
        ))}
      </div>
    </div>
  )
}
