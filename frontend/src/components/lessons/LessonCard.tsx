import { LessonCardInterface } from "./lissonCardInterface";
import { Link } from "@/i18n/navigation";
export default function LessonCard(lessonCardProps:LessonCardInterface){
    return(
        <div>
            <Link href="/">
                <div className="rounded-full min-w-[140px] min-h-[140px] bg-gray-400">
                    <div className="rounded-full min-w-[120px] min-h-[120px] bg-green-300">
                    {lessonCardProps.lessonType}
                    </div> 
                </div>
            </Link>
        </div>
    )
}