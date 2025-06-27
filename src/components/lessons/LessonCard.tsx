import { LessonCardInterface } from "./lissonCardInterface";

export default function LessonCard(lessonCardProps:LessonCardInterface){
    return(
        <div>
            <div className="rounded-full min-w-[140px] min-h-[140px] bg-gray-400">
                <div className="rounded-full min-w-[140px] min-h-[140px] bg-green-300">
                   {lessonCardProps.lessonType}
                </div> 
            </div>
        </div>
    )
}