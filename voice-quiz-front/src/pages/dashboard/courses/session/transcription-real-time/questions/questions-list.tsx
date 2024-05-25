import { Question } from '../../../../../../class/questions.class';
import QuestionCard from './question-card';

interface QuestionsListProps {
  questions:Question[]; 
}
const QuestionsList:React.FC<QuestionsListProps> = ({questions}) => {
  return (
    <div className="flex border w-full flex-col gap-3 overflow-y-auto rounded-lg p-3 max-h-[850px]">
      {
        questions.map((question:Question)  => (
          <QuestionCard question={question}/>
        ))
      }
    </div>
  )
}

export default QuestionsList