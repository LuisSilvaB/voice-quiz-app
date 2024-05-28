import { Checkbox, Chip, Typography } from "@material-tailwind/react"
import { Question } from "../../../../../class/questions.class";

interface Props {
  currentQuestions: Question[];
  question: Question;
  onSelectQuestion: (question: Question) => void;
}

const QuestionCard:React.FC<Props> = ({ question, onSelectQuestion, currentQuestions }) => {
  return (
    <div
    className="flex w-full flex-row items-start gap-2 rounded-lg border border-gray-400 p-2"
  >
    <Checkbox
      crossOrigin={""}
      color="orange"
      onChange={() => onSelectQuestion(question)}
      checked={currentQuestions.some((q) => q.ID === question.ID)}
    />
    <div className="flex flex-col gap-2">
      <Typography
        placeholder={""}
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        {question.question}
      </Typography>
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
          value={question.ID ? "Preguntas múltiples" : "Pregunta"}
          variant="ghost"
          color="pink"
          size="sm"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      {question.type === "open_answer" ? (
        <Chip
          value={question.ID ? "Pregunta abierta" : "Pregunta"}
          variant="ghost"
          color="green"
          size="sm"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      {question.alternatives?.map(
        (alternative: string, index: number) => (
          <div className="flex flex-col gap-2" key={index}>
            <Typography
              placeholder={""}
              variant="small"
              color="blue-gray"
            >
              {alternative}
            </Typography>
          </div>
        ),
      )}
      {
        <div className="flex flex-col gap-2">
          <Typography
            placeholder={""}
            variant="small"
            color="blue-gray"
            className="font-medium"
          >
            Respuesta
          </Typography>
          <p className="text-xs">{question.answer}</p>
        </div>
      }
    </div>
  </div>
  )
}

export default QuestionCard