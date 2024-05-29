import { IconButton } from "@material-tailwind/react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../../app/store"
import { useEffect, useState } from "react"


import { clearQuizList, getAllQuestionsByQuizID } from "../../../../features/db-features/quizzes.features"
import { useNavigate, useParams } from 'react-router-dom';
import { FaCircleArrowLeft } from "react-icons/fa6";
import MyQuizzesQuiestionsFilters from "./quiz-form/my-quizzes-questions-firters";
import MyQuizzesForm from "./quiz-form/my-quizzes-form";
import { Question } from "../../../../class/questions.class";
import { Toaster } from "sonner"


const EditQuiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>()
  const [ currentQuestions, setCurrentQuestions ] = useState<Question[]>([])

  const onReturnToMyQuizzes = () => {
    navigate(`/dashboard/my-quizzes`)
  }

  const onSelectQuestion = (questionToSelect:Question) => {
    const isSelected = currentQuestions.some((question:Question) => question.ID === questionToSelect.ID) 
    if (isSelected) {
      setCurrentQuestions(currentQuestions.filter((question:Question) => question.ID !== questionToSelect.ID))
    }
    else {
      setCurrentQuestions([...currentQuestions, questionToSelect])
    }
  }

  useEffect(()=>{
    const fn = async () => {
      if (params.quizId) {
        const data = await dispatch(getAllQuestionsByQuizID(params.quizId as string))
        setCurrentQuestions(data.payload as Question[])
      }
    }
    fn()
    return () => {
      dispatch(clearQuizList())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  
  return (
    <div className="max-h m-4 flex w-full flex-1 flex-col rounded-lg border p-2">
      <div className="flex flex-col items-start justify-center gap-2 text-center">
        <div className="flex flex-row items-center gap-2">
          <IconButton
            placeholder={""}
            onClick={onReturnToMyQuizzes}
            variant="gradient"
            size="md"
            color="teal"
          >
            <FaCircleArrowLeft className="h-auto w-4 text-white" />
          </IconButton>
          <h3 className="text-center text-3xl font-bold text-blue-gray-600">
            Editar Cuestionario
          </h3>
        </div>
        <div className="flex w-full items-center justify-between border-b pb-2">
          <div className="flex w-fit flex-row justify-center gap-2"></div>
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => navigate(`/dashboard/my-quizzes/create-quiz`)}
          >
            Crear cuestionario
          </button>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-1 flex-wrap items-start gap-2">
        <MyQuizzesForm currentQuestions={currentQuestions} />
        <MyQuizzesQuiestionsFilters
          currentQuestions={currentQuestions}
          onSelectQuestion={onSelectQuestion}
        />
      </div>
      <Toaster richColors />
    </div>
  );
}

export default EditQuiz