import { useEffect, useState } from "react";
import { Quiz } from "../../../../../class/quiz.class";
import { Card, Input, Typography, Switch, Button } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../app/store";
import { createQuiz, getQuizByID, updateQuiz } from "../../../../../features/db-features/quizzes.features";
import { Question } from "../../../../../class/questions.class";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
interface Props {
  currentQuestions:Question[]
}

const MyQuizzesForm:React.FC<Props> = ({
  currentQuestions
}) => {
  const currentUser = useSelector((state:RootState) => state.users.user)
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const navigate = useNavigate()
  const [quizForm, setQuizForm] = useState<Quiz>({
    ID: "",   
    title: "",
    description: "",
    USER_ID: "",
    SESSION_ID: "",
    COURSE_ID: "",
    initial_time: "",
    final_time: "",
    is_active: false,
  });

  const onUpdateQuiz = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateQuiz({
      quizFormContent: quizForm,
      questionsID: currentQuestions.map((question:Question) => question.ID)
    }))
    navigate("/dashboard/my-quizzes")
  }

  const onCreateQuiz  = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newQuiz: Omit<Quiz, "questions"> = {
      ID: v4(),
      title: quizForm.title,
      description: quizForm.description,
      USER_ID: currentUser?.ID ?? "",
      SESSION_ID: params.sessionId as string ?? null,
      COURSE_ID: params.courseId as string ?? null,
      initial_time: quizForm.initial_time,
      final_time: quizForm.final_time,
      is_active: quizForm.is_active,
    }
    dispatch(createQuiz({ 
      quiz: newQuiz,
      questionsID: currentQuestions.map((question:Question) => question.ID),
     }))
     navigate("/dashboard/my-quizzes")
  }

  useEffect(()=>{
    const getQuizDispatch = async ()=>{
      const quiz = await dispatch(getQuizByID(params.quizId as string))
      setQuizForm(quiz.payload as Quiz)
    }
    if(params.quizId){
      getQuizDispatch()
    }
  },[params])


  return (
    <Card
      placeholder={""}
      color="transparent"
      shadow={false}
      className="my-2 flex h-fit w-fit flex-col items-center justify-start gap-1 px-4 over"
    >
      <form
        className="mb-2 mt-3 w-80 max-w-screen-lg sm:w-96 h-full flex flex-col justify-between"
        onSubmit={params.quizId ? onUpdateQuiz : onCreateQuiz}
      >
        <div className="mb-1 mt-3 flex flex-col gap-4">
        <Typography placeholder={""} variant="h5" color="blue-gray">
          Formulario
        </Typography>
          <Input
            required={true}
            label="Nombre del cuestionario"
            value={quizForm.title}
            onChange={(e) => {
              setQuizForm((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            crossOrigin={""}
            size="md"
            color="blue-gray"
          />
          <Input
            required={true}
            label="Descripción del cuestionario"
            value={quizForm.description}
            onChange={(e) => {
              setQuizForm((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            crossOrigin={""}
            size="lg"
            placeholder="name@mail.com"
          />
          <Input
            required={true}
            label="Inicio del cuestionario"
            value={quizForm.initial_time}
            onChange={(e) => {
              setQuizForm((prev) => ({
                ...prev,
                initial_time: e.target.value,
              }));
            }}
            crossOrigin={""}
            type="time"
            placeholder="HH:MM:SS"
            pattern="\\d{2}:\\d{2}:\\d{2}"
            size="lg"
          />
          <Input
            required={true}
            label="Fin del cuestionario"
            value={quizForm.final_time}
            onChange={(e) => {
              setQuizForm((prev) => ({
                ...prev,
                final_time: e.target.value,
              }));
            }}
            crossOrigin={""}
            type="time"
            placeholder="HH:MM:SS"
            pattern="\\d{2}:\\d{2}:\\d{2}"
            size="lg"
          />
          <div className="mb-2 flex w-full flex-col items-start justify-between gap-3">
            <div className="flex w-full flex-row gap-2">
              <div className="flex w-full flex-row gap-2">
                <Switch
                  crossOrigin={""}
                  color="deep-purple"
                  checked={quizForm.is_active}
                  onChange={(e) => {
                    setQuizForm((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }));
                  }}
                />
                <Typography placeholder={""} variant="small" color="blue-gray">
                  Activar cuestionario
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex w-full justify-end">
          <Button
            type="submit"
            placeholder={""}
            variant="gradient"
            size="md"
            className="flex items-center  gap-2"
            color="orange"
          >
            {params.quizId ? <p>Actualizar cuestionario</p> : <p>Crear cuestionario</p>}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default MyQuizzesForm