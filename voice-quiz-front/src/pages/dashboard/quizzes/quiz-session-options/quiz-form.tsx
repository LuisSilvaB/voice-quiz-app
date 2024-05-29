import { useEffect, useState } from 'react';
import { Quiz, QuizQuestion } from "../../../../class/quiz.class"
import { Card, Input, Typography, Switch, Checkbox, Button, Chip, Select, Option } from "@material-tailwind/react";
import { Question } from '../../../../class/questions.class';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import { v4 } from "uuid";
import { useParams } from "react-router-dom";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { createQuiz, updateQuiz, getQuizQuiestionsByQuizID, clearQuizQuestions } from '../../../../features/db-features/quizzes.features';

interface Props {
  quiz?: Quiz
  questions: Question[]
  setCurrentView: React.Dispatch<React.SetStateAction<"quizList" | "quizFormCreate" | "quizFormEdit">>
}

type Filters = "true_or_false" | "multiple_answer" | undefined;

const QuizForm:React.FC<Props> = ({quiz, questions, setCurrentView}) => {
  const [filter, setFilters] = useState<Filters>(undefined);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(questions.filter((question) => question.type !== "open_answer")); 
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const currentUser = useSelector((state:RootState) => state.users.user)
  const currentQuizQuestions = useSelector((state:RootState) => state.quizzes.quizQuiesions)
  
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams();

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

  const onSelectQuestion = (quiestionId:string) => {
    const isSelected = selectedQuestions.some((quizQuestionID:string) => quizQuestionID === quiestionId)
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter((quizQuestion:string) => quizQuestion !== quiestionId))
    }
    else {
      setSelectedQuestions([
        ...selectedQuestions,
        quiestionId
      ]);
    }
  }

  const onCreateQuiz  = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newQuiz: Omit<Quiz, "questions"> = {
      ID: v4(),
      title: quizForm.title,
      description: quizForm.description,
      USER_ID: currentUser?.ID ?? "",
      SESSION_ID: params.sessionId as string,
      COURSE_ID: params.courseId as string,
      initial_time: quizForm.initial_time,
      final_time: quizForm.final_time,
      is_active: quizForm.is_active,
    }
    dispatch(createQuiz({ 
      quiz: newQuiz,
      questionsID: selectedQuestions,
     }))
     setCurrentView("quizList");
  }

  const onUpdateQuiz = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (quizForm) {
      dispatch(
        updateQuiz({
          quizFormContent: quizForm,
          questionsID: selectedQuestions,
        }),
      );
    }
    setCurrentView("quizList");
  } 

  useEffect(() => {
    if (quiz) {
      setQuizForm({
        ID: quiz.ID,
        title: quiz.title,
        description: quiz.description,
        USER_ID: quiz.USER_ID,
        SESSION_ID: quiz.SESSION_ID,
        COURSE_ID: quiz.COURSE_ID,
        initial_time: quiz.initial_time,
        final_time: quiz.final_time,
        is_active: quiz.is_active,
      });
      dispatch(getQuizQuiestionsByQuizID(quiz.ID));
    }
  }, [quiz])

  useEffect(()=>{
    if (currentQuestions.length) {
      setSelectedQuestions(currentQuizQuestions.map((quizQuestion:QuizQuestion) => quizQuestion.QUESTION_ID))
    }
  },[currentQuizQuestions])

  useEffect(() => {
    if (filter) {
      setCurrentQuestions(
        questions.filter((question) => question.type === filter),
      );
    } 
    return () => {
    }
  }, [filter])

  

  useEffect(() => {
    return () => {
      setQuizForm({
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
      dispatch(clearQuizQuestions());
    }
  },[])

  return (
    <Card
      placeholder={""}
      color="transparent"
      shadow={false}
      className="mt-2 flex w-full flex-col items-center justify-start gap-1"
    >
      <form
        className="mb-2 mt-3 w-80 max-w-screen-lg sm:w-96"
        onSubmit={quiz ? onUpdateQuiz : onCreateQuiz}
      >
        <Typography placeholder={""} variant="h5" color="blue-gray">
          {quiz ? "Editar cuestionario" : "Crear cuestionario"}
        </Typography>
        <div className="mb-1 mt-3 flex flex-col gap-4">
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
            <Select
              placeholder={""}
              label="Selecciona el tipo de pregunta"
              color="orange"
            >
              <Option onClick={() => setFilters("true_or_false")}>
                Verdadero o Falso
              </Option>
              <Option onClick={() => setFilters("multiple_answer")}>
                Alternativas
              </Option>
            </Select>
          </div>
        </div>
        <div className="flex max-h-[450px] w-full flex-1 flex-col gap-3 overflow-y-scroll pt-2">
          {currentQuestions && currentQuestions.length
            ? currentQuestions.map((question: Question, index: number) => (
                <div
                  key={index}
                  className="flex w-full flex-row items-start gap-2 rounded-lg border border-gray-400 p-2"
                >
                  <Checkbox
                    crossOrigin={""}
                    color="orange"
                    onChange={() => onSelectQuestion(question.ID)}
                    checked={selectedQuestions.includes(question.ID)}
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
                        value={question.ID ? "Alternativas" : "Pregunta"}
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
              ))
            : null}
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
            {quiz ? <p>Actualizar cuestionario</p> : <p>Crear cuestionario</p>}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default QuizForm