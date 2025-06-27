import { LessonCardInterface } from "./lissonCardInterface";

export default function LessonCard(lessonCardProps:LessonCardInterface){
    return(
        <div>
            <div className="rounded-full bg-gray-400">
                <div className="rounded-full bg-green-300">
                   {lessonCardProps.lessonType}
                </div> 
            </div>
        </div>
    )
}