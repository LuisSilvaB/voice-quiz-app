import { IconButton, Tooltip, Chip } from '@material-tailwind/react';
import { Quiz } from '../../../../class/quiz.class';
import { FaChartArea, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PiQrCodeLight } from "react-icons/pi";
import useToggle from '../../../../hooks/useToggle';
import QuizQrModal from './modals/quiz-qr-modal';

interface Props {
  quiz: Quiz;
  onSetToDeleteQuiz: (quiz:Quiz) => void;
}

const QuizCard:React.FC<Props> = ({ quiz, onSetToDeleteQuiz }) => {
  const navigate = useNavigate();
  const toggleQrModal = useToggle();
  const onNavegateToEdit = () => {
    navigate(`/dashboard/my-quizzes/edit-quiz/${quiz.ID}`)
  }
  const onNavigateToStats = () => {
    navigate(`/dashboard/my-quizzes/stats-quiz/${quiz.ID}`)
  }
  return (
    <div
      key={quiz.ID}
      className="flex w-full max-w-[300px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border pt-0 text-black transition-all hover:shadow-lg"
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
              onClick={toggleQrModal.onOpen}
            >
              <PiQrCodeLight className="h-auto w-4 text-blue-gray-600" />
            </IconButton>
          </Tooltip>
          <Tooltip content={"Ver estadísticas"} placement="left">
            <IconButton
              placeholder={""}
              className="bg-white"
              onClick={onNavigateToStats}
            >
              <FaChartArea className="h-auto w-4 text-green-500" />
            </IconButton>
          </Tooltip>
          <Tooltip content={"Editar cuestionario"} placement="left">
            <IconButton
              placeholder={""}
              className="bg-white"
              onClick={() => onNavegateToEdit()}
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
        {/* <div className="flex w-full flex-row items-center justify-between gap-2">
          <p className="text-sm">Hora de inicio</p>
          <p className="text-sm font-bold text-gray-600">{quiz.initial_time}</p>
        </div>
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <p className="text-sm">Hora de finalización</p>
          <p className="text-sm font-bold text-gray-600">{quiz.final_time}</p>
        </div> */}
      </div>
      {<QuizQrModal id="" {...toggleQrModal} quiz={quiz} />}
    </div>
  );
}

export default QuizCard