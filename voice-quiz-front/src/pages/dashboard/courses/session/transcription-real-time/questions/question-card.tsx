import { Question } from '../../../../../../class/questions.class'
import { motion } from "framer-motion"
import { Chip, Button } from '@material-tailwind/react'
import useToggle from '../../../../../../hooks/useToggle';
import QuestionPresentationModal from './question-presentatión-modal';

interface QuestionCardProps{
  question:Question;
}

const QuestionCard:React.FC<QuestionCardProps> = ({question}) => {
  const toggleQuestionPresentation = useToggle();  

  return (
    <motion.div
      className="h-auto cursor-pointer rounded-lg border-2 bg-white p-2 transition-all"
      // onClick={() => setSelectedQuestion(question)}
    >
      <p className="mb-2 text-sm text-gray-800">
        <span className="mr-2 font-semibold">Pregunta:</span>
        {question.question}
      </p>

      {question.type === "true_or_false" ? (
        <Chip
          value={question.ID ? "Verdadero o Falso" : "Pregunta"}
          variant="ghost"
          size="sm"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      {question.type === "multiple_answer" ? (
        <Chip
          value={question.ID ? "Alternativas" : "Pregunta"}
          variant="ghost"
          size="sm"
          color="pink"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      {question.type === "open_answer" ? (
        <Chip
          value={question.ID ? "Pregunta abierta" : "Pregunta"}
          variant="ghost"
          size="sm"
          color="green"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      <ul className="mt-3 h-fit w-full text-xs text-gray-600">
        {question.alternatives?.map((alternative: string, index: number) => (
          <li className="text-sm" key={index}>
            {index + 1}. {alternative}
          </li>
        ))}
      </ul>

      <div className="flex justify-end" onClick={toggleQuestionPresentation.onToggle}>
        <Button placeholder={""} size='sm'>Presentar Pregunta</Button>
      </div>
      {toggleQuestionPresentation.isOpen ? (
        <QuestionPresentationModal
          questionSelected={question}
          questionClear={()=>{}}
          {...toggleQuestionPresentation}
        />
      ) : null}
    </motion.div>
  );
}

export default QuestionCard