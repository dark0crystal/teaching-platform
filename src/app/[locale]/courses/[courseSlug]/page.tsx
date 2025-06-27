interface Props {
  params: {
    courseSlug: string
  }
}

export default function CourseDetails({ params }: Props) {
  const { courseSlug } = params

  return (
    <div className="text-xl p-6 space-y-4">
      <h1>📘 Course: {decodeURIComponent(courseSlug)}</h1>
    </div>
  )
}
