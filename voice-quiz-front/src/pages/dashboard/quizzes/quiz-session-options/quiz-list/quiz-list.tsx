import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../app/store";
import { clearQuizList, getQuizListbySessionID } from "../../../../../features/db-features/quizzes.features";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Quiz } from "../../../../../class/quiz.class";
import QuizListEmpty from "./quiz-list-empty";
import { Chip, IconButton, Tooltip } from "@material-tailwind/react";
import { supabase } from "../../../../../config/config";
import { FaChartArea } from "react-icons/fa";

import { FaTrash, FaEdit } from "react-icons/fa";
import QuizDeleteModal from "./quiz-delete-modal";
import useToggle from '../../../../../hooks/useToggle';
import { PiQrCodeLight } from "react-icons/pi";
import QuizQrModal from "../../my-quizzes/modals/quiz-qr-modal";

interface Props {
  onSetQuiz: (quiz:Quiz) => void;
}

const QuizList:React.FC<Props> = ({onSetQuiz}) => {
  const dispatch = useDispatch<AppDispatch>()
  const sessionID = useParams().sessionId as string;
  const quizList = useSelector((state:RootState) => state.quizzes.quizList) 
  const currentUser = useSelector((state:RootState) => state.users.user)
  const [targetQuiz, setTargetQuiz] = useState<Quiz>()
  const toggleQuiz = useToggle(); 
  const toggleQrModal = useToggle();

  const onSetToQuizToQr = (quiz:Quiz) => {
    toggleQrModal.onOpen()
    setTargetQuiz(quiz)
  } 
  
  useEffect(() => {
    const subscribeCreateChannel = supabase
      .channel("insert-quiz")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "QUIZZES" },
        (payload) => {
          if (currentUser && payload.new.USER_ID === currentUser?.ID) {
            dispatch(getQuizListbySessionID(sessionID));
          }
        },
      )
      .subscribe();

      const subscribeUpdateChannel = supabase
      .channel("update-quiz")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "QUIZZES" },
        (payload) => {
          if (currentUser && payload.new.USER_ID === currentUser?.ID) {
            dispatch(getQuizListbySessionID(sessionID));
          }
        },
      )
      .subscribe();
  
      const subscribeDeleteChannel = supabase
        .channel("delete-quiz")
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "QUIZZES" },
          (payload) => {
            if (currentUser && payload.old.ID === targetQuiz?.ID) {
              dispatch(getQuizListbySessionID(sessionID));
            }
          },
        )
        .subscribe();

    return () => {
      subscribeCreateChannel.unsubscribe();
      subscribeUpdateChannel.unsubscribe();
      subscribeDeleteChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionID]);

  const onSetToDeleteQuiz = (quiz: Quiz) => {
    setTargetQuiz(quiz)
    toggleQuiz.onOpen();
  }

  useEffect(() => {
      dispatch(getQuizListbySessionID(sessionID));
      return () => {
        dispatch(clearQuizList());
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!quizList || !quizList.length) return <QuizListEmpty />; 
  return (
    <div className="flex h-max max-h-[90vh] w-full flex-1 flex-col items-start gap-2 overflow-y-auto">
      {quizList.map((quiz: Quiz) => (
        <div
          key={quiz.ID}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border pt-0 text-black transition-all hover:shadow-lg"
        >
          <div className="flex w-full flex-row items-center justify-between gap-2 bg-orange-50 p-2">
            <p className=" max-w-32 overflow-hidden text-ellipsis text-nowrap text-lg font-bold text-orange-900">
              {quiz.title}
            </p>
            <div className="flex w-fit flex-row items-center justify-end gap-2">
              <Tooltip content={"Abrir QR Code"} placement="left">
                <IconButton
                  placeholder={""}
                  className="bg-white"
                  onClick={() => onSetToQuizToQr(quiz)}
                >
                  <PiQrCodeLight className="h-auto w-4 text-blue-gray-600" />
                </IconButton>
              </Tooltip>
              <Tooltip content={"Editar cuestionario"} placement="left">
                <IconButton placeholder={""} className="bg-white">
                  <FaChartArea className="h-auto w-4 text-green-500" />
                </IconButton>
              </Tooltip>
              <Tooltip content={"Editar cuestionario"} placement="left">
                <IconButton
                  placeholder={""}
                  className="bg-white"
                  onClick={() => onSetQuiz(quiz)}
                >
                  <FaEdit className="h-auto w-4 text-light-blue-500" />
                </IconButton>
              </Tooltip>
              <Tooltip content={"Eliminar cuestionario"} placement="left">
                <IconButton
                  placeholder={""}
                  className="bg-white"
                  onClick={() => onSetToDeleteQuiz(quiz)}
                >
                  <FaTrash className="h-auto w-4 text-red-500" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-1 p-4 pb-2 pt-1 text-gray-600">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm">{"Descripción"}</p>
              <Chip
                className="max-w-[60px] overflow-x-hidden text-ellipsis"
                color="orange"
                variant="ghost"
                value={quiz.description}
              />
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm">{"Estado"}</p>
              {quiz.is_active ? (
                <Chip color="green" variant="outlined" value={"Activado"} />
              ) : (
                <Chip color="red" variant="outlined" value={"Desactivado"} />
              )}
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm">Hora de inicio</p>
              <p className="text-sm font-bold text-gray-600">
                {quiz.initial_time}
              </p>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm">Hora de finalización</p>
              <p className="text-sm font-bold text-gray-600">
                {quiz.final_time}
              </p>
            </div>
          </div>
        </div>
      ))}
      <QuizDeleteModal
        quiz={targetQuiz ?? ({} as Quiz)}
        id={targetQuiz?.ID ?? ""}
        {...toggleQuiz}
      />
      {<QuizQrModal id="" {...toggleQrModal} quiz={targetQuiz ?? ({} as Quiz)} />}
    </div>
  );
}

export default QuizList