import { Select, Typography, Option } from "@material-tailwind/react"
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../../../app/store"
import { getAllCourses } from "../../../../../features/db-features/courses.features"
import { getAllSessions } from "../../../../../features/db-features/sessions.features"
import { getQuizListbySessionID } from "../../../../../features/db-features/quizzes.features"
import { clearFragments, clearQuestions, getFragments, getQuestions } from "../../../../../features/fragments.features"
import { Fragment } from "../../../../../class/fragments"
import { Question } from "../../../../../class/questions.class"
import QuestionCard from "./question-card"

interface Props {
  currentQuestions:Question[]
  onSelectQuestion: (question:Question) => void;
}

const MyQuizzesQuiestionsFilters:React.FC<Props> = ({ currentQuestions, onSelectQuestion }) => { 
  const dispatch = useDispatch<AppDispatch>()
  const [ currentCourseId, setCurrentCourseId ] = useState<string>("") 
  const [ currentSessionId, setCurrentSessionId ] = useState<string>("")  
  const [ currentFragment, setCurrentFragment ] = useState<Fragment | null>(null)
  const courses = useSelector((state:RootState) => state.courses.courses);
  const sessions = useSelector((state:RootState) => state.sessions.sessions);
  const fragments = useSelector((state:RootState) => state.fragments.fragments);
  const questions = useSelector((state:RootState) => state.fragments.questions);
  const user = useSelector((state:RootState) => state.users.user);
  
  const listCourses = courses ?? [];
  let listSessions = sessions ?? [];
  let listFragments = fragments ?? [];
  let listQuestions = questions ?? [];

  const onSetCurrentCourse = (courseId:string) => {
    listSessions = [];
    listFragments = [];
    listQuestions = [];
    dispatch(clearQuestions());
    dispatch(clearFragments())
    setCurrentSessionId("");
    setCurrentFragment(null);
    setCurrentCourseId(courseId);
  }
  const onSetCurrentSession = (sessionId:string) => {
    listFragments = [];
    setCurrentSessionId(sessionId);
  }
  const onSetCurrentFragment = (fragment:Fragment) => {
    listQuestions = [];
    setCurrentFragment(fragment);
  }

  useEffect(()=>{
    if (currentCourseId.length && user?.ID) {
      setCurrentSessionId("");
      dispatch(getAllSessions({ userId: user?.ID, courseId: currentCourseId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentCourseId])

  useEffect(()=>{
    if (currentSessionId.length) {
      dispatch(getQuizListbySessionID(currentSessionId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentSessionId, currentCourseId])

  useEffect(()=>{
    if (currentSessionId.length) {
      dispatch(getFragments(currentSessionId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentSessionId, currentCourseId])

  useEffect(()=>{
    if (currentFragment) {
      dispatch(getQuestions(currentFragment));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentFragment, currentSessionId])
    
  useEffect(()=>{
    const fn = async () => {
      if (user) {
        dispatch(getAllCourses(user.ID));
      }
    }
    fn()
    return () => {
      dispatch(clearQuestions());
      dispatch(clearFragments())
      setCurrentSessionId("");
      setCurrentFragment(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className="flex h-full w-full flex-1 flex-row gap-2">
      <div className="box-boder flex h-full flex-1 flex-col overflow-y-auto rounded-lg border px-4 py-7">
        <div className="flex flex-row gap-2 justify-between">
          <Typography
            placeholder={""}
            variant="h5"
            color="blue-gray"
            className="border-b"
          >
            Preguntas seleccionadas
          </Typography>
          <p>Preguntas {currentQuestions.length}</p>
        </div>
        <div className="mt-2 flex h-full max-h-[65vh] flex-col gap-2 overflow-y-auto">
          {currentQuestions.length ? (
            currentQuestions.map((question) => (
              <QuestionCard
                currentQuestions={currentQuestions}
                key={question.ID}
                question={question}
                onSelectQuestion={onSelectQuestion}
              />
            ))
          ) : (
            <div className="h-full w-full flex-1 flex justify-center items-center">No hay preguntas seleccionadas</div>
          )}
        </div>
      </div>
      <div className="h-full flex-1 box-border overflow-x-visible rounded-lg border px-4 py-7">
        <Typography
          placeholder={""}
          variant="h5"
          color="blue-gray"
          className="border-b"
        >
          Preguntas disponibles
        </Typography>
        <div className="mt-2 flex flex-1 h-full flex-col gap-2">
          <div className="flex w-full flex-row gap-2 ">
            <Select placeholder={""} label="Curso">
              {listCourses.length ? (
                listCourses.map((course) => (
                  <Option
                    key={course.ID}
                    onClick={() => onSetCurrentCourse(course.ID)}
                  >
                    {course.title}
                  </Option>
                ))
              ) : (
                <Option>No hay cursos</Option>
              )}
            </Select>
            <Select
              placeholder={""}
              label="Sessión"
              disabled={!listSessions.length}
            >
              {listSessions.length ? (
                listSessions.map((session) => (
                  <Option
                    key={session.ID}
                    onClick={() => onSetCurrentSession(session.ID)}
                  >
                    {session.title}
                  </Option>
                ))
              ) : (
                <Option>No hay sesiones</Option>
              )}
            </Select>
          </div>
          <Select
            placeholder={""}
            label="Fragmento"
            disabled={!listFragments.length}
          >
            {listFragments.length ? (
              listFragments.map((fragment) => (
                <Option
                  key={fragment.ID}
                  onClick={() => onSetCurrentFragment(fragment)}
                >
                  {fragment.title}
                </Option>
              ))
            ) : (
              <Option>No hay fragmentos</Option>
            )}
          </Select>
          <div className="flex w-full flex-wrap flex-row gap-2 h-full flex-1 max-h-[56vh] rounded-lg overflow-y-auto border">
            {listQuestions.length ? (
              listQuestions.map((question) => (
                <QuestionCard
                  currentQuestions={currentQuestions}
                  key={question.ID}
                  question={question}
                  onSelectQuestion={onSelectQuestion}
                />
              ))
            ) : (
              <div className="h-full w-full flex-1 flex justify-center items-center">No hay preguntas</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyQuizzesQuiestionsFilters