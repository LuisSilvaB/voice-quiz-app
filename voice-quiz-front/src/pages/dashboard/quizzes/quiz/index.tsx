import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../../../app/store";
import { getQuizByID } from "../../../../features/db-features/quizzes.features";
import { getAllQuestionsByQuizIdToApply, reviewQuestions, userSendHisResponse } from '../../../../features/db-features/questions.features';
import { Button, Chip, Typography } from "@material-tailwind/react";
import { Quiz } from "../../../../class/quiz.class";
import { BsDoorClosed } from "react-icons/bs";
import QuizQuiestionCard from "./quiestion-card";
import { QuestionResponse } from "../../../../class/questions.class";
import { Toaster } from "sonner";
import { CiCircleCheck } from "react-icons/ci";
import { supabase } from "../../../../config/config";

export type QuiestionToApply = {
  ID: string;
  QUIZ_QUESTION: {
    QUIZ_ID: string;
  }[];
  question: string;
  type: string;
};


const QuizView = () => {
  const quizId = useParams().quizId as string;
  const dispatch = useDispatch<AppDispatch>()
  const [ responses , setResponses ] = useState<QuestionResponse[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestions, setCurrentQuestions] = useState<QuiestionToApply[] | null>([]) 
  const [ isUserIsAuthorized, setIsUserIsAuthorized ] = useState<boolean>(true)
  console.log(responses)
  const listQuiestions = currentQuestions ?? []

  const onChangeResponse = (questionID: string, alternativeId: string, position: number) => {
    const hasPrevResponse = responses?.some((response:QuestionResponse)=> response.QUESTION_ID === questionID)
    if(hasPrevResponse){
      const responsesChanged = responses?.filter(
        (response: QuestionResponse) => response.QUESTION_ID !== questionID,
      );
      setResponses([
        ...(responsesChanged as QuestionResponse[]),
        { QUESTION_ID: questionID, ALTERNATIVE_ID: alternativeId, position: position},
      ]);
    }else{
      setResponses([
        ...(responses as QuestionResponse[]),
        { QUESTION_ID: questionID, ALTERNATIVE_ID: alternativeId, position: position},
      ]);
    }
  }

  const onSendResponses = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await dispatch(reviewQuestions({
      questionResponse: responses,
      quizId: quizId,
      userID: localStorage.getItem("userId") as string          
    }))

  }

  useEffect(()=>{
    const fn = async() => {
      const userSendResponse = await dispatch(userSendHisResponse({
        quizId: quizId,
        userId: localStorage.getItem("userId") as string
      }))
      if (Array.isArray(userSendResponse.payload) && userSendResponse.payload.length) {
        setIsUserIsAuthorized(false)
      }
      const quizData = await dispatch(getQuizByID(quizId))
      if (quizData && isUserIsAuthorized) {
        setCurrentQuiz(quizData.payload as Quiz)
        const questionsData = await dispatch(getAllQuestionsByQuizIdToApply(quizId))
        setCurrentQuestions(questionsData.payload as QuiestionToApply[])
      }
    } 
    fn()

    const onInsertChannel = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "RESULTS" },
        (payload) => {
          if (
            payload.new &&
            payload.new.USER_ID ===
              (localStorage.getItem("userId") as string) &&
            payload.new.QUIZ_ID === quizId
          ) {
            setIsUserIsAuthorized(false);
          }
        },
      ).subscribe();

    // eslint-disable-next-line
    return () => {
      onInsertChannel.unsubscribe()
    }
  },[])
  
  return (
    <form
      className="flex h-full w-full flex-1 justify-center  rounded-lg bg-blue-gray-50 p-2 lg:p-4"
      onSubmit={onSendResponses}
    >
      <div className="flex w-full max-w-[700px] flex-col justify-start gap-2 rounded-lg bg-white lg:p-2">
        <div className="flex w-full flex-col items-start lg:flex-row max-w-2xl lg:items-center justify-between rounded-l border-b px-2 lg:px-4">
          <div className="flex w-full max-w-[700px] flex-col justify-start gap-2 p-2">
            <Typography
              placeholder={""}
              variant="h1"
              className="text-start font-inter text-lg lg:text-4xl font-bold text-blue-gray-600"
            >
              {currentQuiz ? (
                currentQuiz?.title[0]?.toUpperCase() +
                currentQuiz?.title?.slice(1).toLowerCase()
              ) : (
                <div className="h-12 w-60 animate-pulse rounded-lg bg-blue-gray-100"></div>
              )}
            </Typography>
            <Typography
              placeholder={""}
              variant="h5"
              className="text-start text-sm lg:text-lg font-normal text-blue-gray-400"
            >
              {currentQuiz ? (
                currentQuiz?.description[0].toUpperCase() +
                currentQuiz?.description?.slice(1).toLowerCase()
              ) : (
                <div className="h-6 w-full animate-pulse rounded-lg bg-blue-gray-100"></div>
              )}
            </Typography>
          </div>
          <Chip
            value={currentQuiz?.is_active ? "activo" : "inactivo"}
            color={currentQuiz?.is_active ? "green" : "red"}
            variant="outlined"
            size="sm"
            className="h-fit w-fit mb-2 lg:mb-0" 
          />
        </div>
        {currentQuiz?.is_active && isUserIsAuthorized ? (
          <div className="flex h-full w-full flex-col gap-2">
            {listQuiestions.length
              ? listQuiestions.map((question, index) => (
                  <QuizQuiestionCard
                    key={index}
                    onChangeResponse={onChangeResponse}
                    questionToAppy={question}
                    position={index}
                    responses={responses}
                  />
                ))
              : null}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            {
              currentQuiz?.is_active && !isUserIsAuthorized ? (
                <>
                  <CiCircleCheck className="h-auto w-16 animate-pulse rounded-lg text-gray-500"></CiCircleCheck>
                  <p className="text-sm text-gray-500">
                    Su respuesta ya fue enviada
                  </p>
                </>
              ): null
            }
            {
              !currentQuiz?.is_active ? (
                <>
                  <BsDoorClosed className="h-auto w-16 animate-pulse rounded-lg text-gray-500"></BsDoorClosed>
                  <p className="text-sm text-gray-500">
                    El cuestionario esta inactivo
                  </p>
                </>
              ): null
            }
          </div>
        )}
        {currentQuiz?.is_active && isUserIsAuthorized ? (
          <div className="flex w-full justify-end">
            <Button
              placeholder={""}
              type="submit"
              variant="gradient"
              color="orange"
            >
              Enviar respuestas
            </Button>
          </div>
        ) : null}
      </div>
      <Toaster richColors />
    </form>
  );
}

export default QuizView