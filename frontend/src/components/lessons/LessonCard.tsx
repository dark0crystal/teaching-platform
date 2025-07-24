import { LessonCardInterface } from "./lissonCardInterface";
import { Link } from "@/i18n/navigation";
export default function LessonCard(lessonCardProps:LessonCardInterface){
    const nav = "part1"
    return(
        <div>
            {/* should navigate to lesson part page */}
            <Link href={`courses//${nav}`}>
                <div className="rounded-full min-w-[140px] min-h-[140px] bg-gray-400">
                    <div className="rounded-full min-w-[120px] min-h-[120px] bg-green-300">
                    {lessonCardProps.lessonType}
                    </div> 
                </div>
            </Link>
        </div>
    )
}