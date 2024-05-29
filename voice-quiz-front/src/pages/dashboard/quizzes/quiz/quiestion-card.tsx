import { Typography, Chip, Checkbox } from '@material-tailwind/react';
import { QuiestionToApply } from '.';
import { getAllAlternativesByQuestionId } from '../../../../features/db-features/questions.features';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../app/store';
import { useEffect, useState } from 'react';
import { Alternative, QuestionResponse } from '../../../../class/questions.class';

interface Props {
  questionToAppy: QuiestionToApply
  position: number
  onChangeResponse: (questionID: string, response: string, position: string) => void
  responses: QuestionResponse[]
}

const QuizQuiestionCard:React.FC<Props> = ({position, questionToAppy, onChangeResponse, responses}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currenAlternatives, setCurrentAlternatives] = useState<Alternative[] | null>(null)
  useEffect(()=>{
    const fn = async() => {
      const alternatives = await dispatch(getAllAlternativesByQuestionId(questionToAppy.ID));
      setCurrentAlternatives(alternatives.payload as Alternative[])
    }
    if (questionToAppy) {
      fn()
    }
    // eslint-disable-next-line
  },[questionToAppy])
  return (
    <div className="flex min-h-[200px] w-full flex-col justify-start gap-2 rounded-lg border bg-white p-2">
      <p className="text-sm font-bold text-blue-gray-500 opacity-50">
        <span className="mr-2">Pregunta</span>
        {position + 1}
      </p>
      {questionToAppy.question ? (
        <Typography placeholder={""}  className="text-black font-medium opacity-65 text-md lg:text-lg"> 
          {questionToAppy.question}
        </Typography>
      ) : null}
      {questionToAppy.type === "true_or_false" ? (
        <Chip
          value={questionToAppy.ID ? "Verdadero o Falso" : "Pregunta"}
          variant="ghost"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      {questionToAppy.type === "multiple_answer" ? (
        <Chip
          value={questionToAppy.ID ? "Alternativas" : "Pregunta"}
          variant="ghost"
          color="pink"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}

      {questionToAppy.type === "open_answer" ? (
        <Chip
          value={questionToAppy.ID ? "Pregunta abierta" : "Pregunta"}
          variant="ghost"
          color="green"
          className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
        ></Chip>
      ) : null}
      {currenAlternatives ? (
        currenAlternatives.map((alternative: Alternative, index: number) => (
          <div className='flex items-center gap-2' key={index}>
            <Checkbox
              required={false}
              color='orange'
              crossOrigin={""}
              id={alternative.ID}
              value={alternative.content}
              onClick={() =>
                onChangeResponse(
                  questionToAppy.ID,
                  String(alternative.ID),
                  String(alternative.position),
                )
              }
              checked={responses.some(
                (response) =>
                  response.QUESTION_ID === alternative.QUESTION_ID &&
                  response.ALTERNATIVE_ID === String(alternative.ID),
              )}
            />
            <p className='text-sm lg:text-lg'>{alternative.content}</p>
          </div>
        ))
      ) : (
        <div className="h-5 w-[80%] animate-pulse bg-gray-200" />
      )}
    </div>
  );
}

export default QuizQuiestionCard