import { Button, Chip, IconButton, Typography } from "@material-tailwind/react";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { getParticipantsByQuizID, getQuizByID } from "../../../../../features/db-features/quizzes.features";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../app/store";
import { Quiz } from "../../../../../class/quiz.class";
import { useEffect, useState } from "react";

export type Participant = {
  ID: string;
  img_url: string;
  name:string;
};

const StastQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [ currentQuiz, setCurrentQuiz ] = useState<Quiz | null>(null)
  const [ listParticipants, setListParticipants ] = useState<Participant[] | null>(null)
  const onReturnToMyQuizzes = () => {
    navigate(`/dashboard/my-quizzes`)
  }
  const onEditQuiz = () => {
    navigate(`/dashboard/my-quizzes/edit-quiz/${params.quizId}`)
  }

  useEffect(()=>{
    const fn = async() => {
      const quiz = await dispatch(getQuizByID(params.quizId as string));
      const listParticipants = await dispatch(getParticipantsByQuizID(params.quizId as string));
      setCurrentQuiz(quiz.payload as Quiz)
      setListParticipants(listParticipants.payload as Participant[])
    }
    if (params.quizId) {
      fn()
    }
    // eslint-disable-next-line
  },[])


  return (
    <div className="max-h m-4 flex w-full flex-1 flex-col rounded-lg border p-2">
      <div className="flex w-full flex-row items-center justify-between gap-2 text-center">
        <div className="flex w-fit flex-row items-center justify-center gap-2">
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
            Estadísticas del quiz
          </h3>
        </div>
        <Button
          placeholder={""}
          size="sm"
          color="blue"
          variant="gradient"
          onClick={onEditQuiz}
        >
          <Typography placeholder={""} variant="small" className="text-white">
            Editar
          </Typography>
        </Button>
      </div>
      <div className="mt-6">
        <div className="relative flex w-full max-w-[400px] flex-col items-start justify-between gap-2 rounded-lg border">
          <div className="relative mx-5 flex h-16 w-full max-w-[350px] -translate-y-4 items-center justify-center rounded-lg border bg-orange-50">
            <h4 className="flex items-center justify-start text-center text-2xl font-bold text-orange-600">
              {currentQuiz?.title}
            </h4>
          </div>
          <div className="mb-2 flex w-full flex-col items-start justify-between gap-2 px-4 font-medium text-gray-600">
            <p className="text-semibold text-xl">
              {currentQuiz
                ? currentQuiz?.description[0]?.toUpperCase() +
                  currentQuiz?.description?.slice(1).toLowerCase()
                : null}
            </p>
            <div className="flex w-full items-center justify-between gap-2">
              <p>Hora de inicio:</p>
              <p>{currentQuiz?.initial_time}</p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <p>Hora de finalización:</p>
              <p>{currentQuiz?.final_time}</p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <p>Estado:</p>
              <Chip
                color={currentQuiz?.is_active ? "green" : "red"}
                variant="outlined"
                value={currentQuiz?.is_active ? "Activado" : "Inactivado"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex h-full max-h-[60vh] w-full max-w-[400px] flex-col items-start justify-between gap-2 overflow-hidden rounded-lg border">
        <div className="flex h-16 w-full items-center justify-center bg-orange-50">
          <Typography
            placeholder={""}
            variant="h5"
            className="text-center text-2xl font-bold text-orange-600"
          >
            Participantes
          </Typography>
        </div>
        <div className="w-full flex-1">
          {listParticipants
            ? listParticipants.map((participant: Participant) => (
                <div
                  className="flex w-full cursor-pointer items-center justify-start gap-2 px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 transition-all"
                  key={participant.ID}
                >
                  <div className="w-filter flex items-center justify-center gap-2">
                    <img
                      src={participant.img_url}
                      alt="participant"
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex w-fit flex-col items-start gap-2">
                      <p>{participant.name}</p>
                      <p className="max-w-40 truncate text-ellipsis">
                        {participant.ID}
                      </p>
                    </div>
                  </div>
                  <Button placeholder={""} size="sm" color="blue" variant="outlined">
                    <Typography placeholder={""} variant="small" className=" font-medium text-xs">
                      Ver estadísticas
                    </Typography>
                  </Button>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default StastQuiz