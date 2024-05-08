import { Question } from '../../../../../class/questions.class';
import QuestionCard from './question-card';

interface QuestionsListProps {
  questions:Question[]; 
}
const QuestionsList:React.FC<QuestionsListProps> = ({questions}) => {
  return (
    <div className="flex h-full max-h-[550px] w-full flex-col gap-3 overflow-y-auto rounded-lg p-3">
      {
        questions.map((question:Question)  => (
          <QuestionCard question={question}/>
        ))
      }
    </div>
  )
}

export default QuestionsList