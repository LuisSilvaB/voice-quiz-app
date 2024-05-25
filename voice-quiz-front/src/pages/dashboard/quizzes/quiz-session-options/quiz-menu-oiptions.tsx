import { useState } from 'react';
import useToggle from '../../../../hooks/useToggle';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { Question } from '../../../../class/questions.class';
import { Button, Drawer, Typography} from '@material-tailwind/react'; 
import QuizForm from './quiz-form';
import { Toaster } from 'sonner';
import QuizList from './quiz-list/quiz-list';
import { Quiz } from '../../../../class/quiz.class';

interface Props {
  questions: Question[]
}

const QuizSessionOptions:React.FC<Props> = ({ questions }) => { 
  const toggleMyQuizzes = useToggle(false);
  const [ currentView, setCurrentView ] = useState<'quizList' | 'quizFormCreate' | 'quizFormEdit' >('quizList');
  const [ targetQuiz, setTargetQuiz ] = useState<Quiz | undefined>(undefined);
  const onSetQuiz = (quiz:Quiz) => {
    setTargetQuiz(quiz);
    setCurrentView("quizFormEdit");
  }
  return (
    <div className="flex py-3">
      <Button
        onClick={toggleMyQuizzes.onOpen}
        placeholder={""}
        className="flex w-fit justify-center gap-2"
        size="md"
        color="orange"
        variant="filled"
      >
        <p>Mis cuestionarios</p>
      </Button>
      <Drawer
        transition={{ type: "tween", duration: 0.2 }}
        placeholder={""}
        size={420}
        title="Mis cuestionarios"
        placement="right"
        open={toggleMyQuizzes.isOpen}
        onClose={toggleMyQuizzes.onClose}
        className="flex flex-col gap-2 rounded-l-lg bg-white p-4"
      >
        <div className="flex w-full flex-row items-center justify-between">
          <Typography
            placeholder=""
            variant="h6"
            color="current"
            className="w-full text-2xl font-semibold text-gray-600"
          >
            Mis cuestionarios
          </Typography>
          <div className="flex w-full justify-end">
            {currentView === "quizList" ? (
              <Button
                onClick={() => setCurrentView("quizFormCreate")}
                placeholder={""}
                variant="gradient"
                size="md"
                className="flex items-center justify-center gap-2"
                color="orange"
              >
                <p>Crear cuestionario</p>
              </Button>
            ) : null}
            {currentView === "quizFormCreate" ? (
              <Button
                onClick={() => setCurrentView("quizList")}
                placeholder={""}
                variant="gradient"
                size="md"
                className="flex items-center justify-center gap-2"
                color="orange"
              >
                <IoIosArrowDropleftCircle />
              </Button>
            ) : null}
            {currentView === "quizFormEdit" ? (
              <Button
                onClick={() => setCurrentView("quizList")}
                placeholder={""}
                variant="gradient"
                size="md"
                className="flex items-center justify-center gap-2"
                color="orange"
              >
                <IoIosArrowDropleftCircle width={40} height={40} />
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-3">
          {currentView === "quizList" ? <QuizList onSetQuiz={onSetQuiz} /> : null}
          {currentView === "quizFormCreate" ? (
            <QuizForm questions={questions} setCurrentView={setCurrentView} />
          ) : null}
          {currentView === "quizFormEdit" ? (
            <QuizForm questions={questions} setCurrentView={setCurrentView} quiz={targetQuiz} />
          ) : null}
        </div>
        <Toaster richColors />
      </Drawer>
    </div>
  );
}

export default QuizSessionOptions