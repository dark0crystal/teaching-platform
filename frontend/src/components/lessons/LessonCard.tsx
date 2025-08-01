import MultipleChoiceMultiple from "../questions/MultipleChoiceMultiple";
import { LessonCardInterface } from "./lissonCardInterface";
import { Link } from "@/i18n/navigation";
export default function LessonCard(lessonCardProps:LessonCardInterface){

const sampleQuestion = {
  id: 'q1',
  type: 'multiple_choice_multiple',
  question: 'Which of the following are fruits?',
  choices: ['Carrot', 'Apple', 'Potato', 'Banana', 'Tomato'],
  correctAnswers: ['Apple', 'Banana', 'Tomato']
};
const handleAnswer = (isCorrect: boolean, selected: string[]) => {
    console.log('User answered:', selected, 'Correct:', isCorrect);
  };

    const nav = "part1"
    return(
        <div>
            {/* should navigate to lesson part page */}
            <Link href={`lessons/${nav}`}>
                <div className="rounded-full min-w-[140px] min-h-[140px] bg-gray-400">
                    <div className="rounded-full min-w-[120px] min-h-[120px] bg-green-300">
                    {lessonCardProps.lessonType}

                    </div> 
                </div>
            </Link>
        </div>
    )
}