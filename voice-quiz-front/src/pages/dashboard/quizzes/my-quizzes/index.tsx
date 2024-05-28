import { IconButton, Option, Select } from "@material-tailwind/react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../../app/store"
import { useEffect, useState } from "react"

import { GoInbox } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { clearCourses, getAllCourses } from "../../../../features/db-features/courses.features"
import { clearSessionsData, getAllSessions } from "../../../../features/db-features/sessions.features"
import { getQuizListbySessionID, clearQuizList, getQuizList } from "../../../../features/db-features/quizzes.features"
import { Quiz } from "../../../../class/quiz.class";
import QuizCard from "./quiz-card";
import useToggle from "../../../../hooks/useToggle";
import QuizDeleteModal from "./modals/quiz-delete-modal";
import { TbTrash } from "react-icons/tb";
import cx from "../../../../libs/cx";

const MyQuizzes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const userId = localStorage.getItem('userId');
  const courses = useSelector((state:RootState) => state.courses.courses);
  const sessions = useSelector((state:RootState) => state.sessions.sessions);
  const quizzes = useSelector((state:RootState) => state.quizzes.quizList);
  const [ currentCourseId, setCurrentCourseId ] = useState<string>("") 
  const [ currentSessionId, setCurrentSessionId ] = useState<string>("")  
  const [currentQuizToDelete, setCurrentQuizToDelete] = useState<Quiz | null>(null);
  const toogleDeleteQuiz = useToggle();

  const listCourses = courses || [];
  let listSessions = sessions || [];
  let listQuizzes = quizzes || [];
  
  useEffect(()=>{
    if (userId) {
      dispatch(getAllCourses(userId));
      dispatch(getQuizList())
    }
    return () => {
      setCurrentCourseId("");
      setCurrentSessionId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const onSetCurrentCourse = (courseId:string) => {
    listSessions = [];
    dispatch(clearQuizList());
    dispatch(clearSessionsData());
    setCurrentSessionId("");
    setCurrentCourseId(courseId);
  }
  const onSetCurrentSession = (sessionId:string) => {
    setCurrentSessionId(sessionId);
    listQuizzes = [];
  }
  const onSetCurrentQuizToDelete = (quiz:Quiz) => {
    toogleDeleteQuiz.onToggle();
    setCurrentQuizToDelete(quiz);
  }
  const onClearFilters = () => {
    setCurrentCourseId("");
    setCurrentSessionId("");
    dispatch(clearQuizList());
    dispatch(getQuizList())
    dispatch(clearSessionsData());
    dispatch(clearCourses());
  }

  const onGetAllCourses = () => {
    if (userId && !listCourses.length){
      dispatch(getAllCourses(userId));
    }
  }

  useEffect(()=>{
    if (currentCourseId.length && userId) {
      setCurrentSessionId("");
      dispatch(getAllSessions({ userId: userId, courseId: currentCourseId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentCourseId])

  useEffect(()=>{
    if (currentSessionId.length) {
      dispatch(getQuizListbySessionID(currentSessionId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentSessionId, currentCourseId])

  
  return (
    <div className="max-h m-4 flex w-full flex-1 flex-col rounded-lg border p-2">
      <div className="flex flex-col items-start justify-center gap-2 text-center">
        <h3 className="text-center text-3xl font-bold text-blue-gray-600">
          Mis cuestionarios
        </h3>
        <div className="flex justify-between w-full items-center border-b pb-2">
          <div className="flex w-fit flex-row justify-center gap-2">
            <Select label="Selecciona un curso" placeholder={""} onClick={onGetAllCourses}>
              {listCourses
                ? listCourses.map((course) => (
                    <Option
                      key={course.ID}
                      onClick={() => onSetCurrentCourse(course.ID)}
                    >
                      {course.title}
                    </Option>
                  ))
                : null}
            </Select>
            <Select
              onChange={(e) => { console.log(e) }}
              label={
                listSessions && listSessions.length
                  ? "Selecciona una sesión"
                  : "No hay sesiones"
              }
              disabled={listSessions && !listSessions.length}
              placeholder={""}
            >
              {listSessions
                ? listSessions.map((session) => (
                    <Option
                      key={session.ID}
                      onClick={() => onSetCurrentSession(session.ID)}
                    >
                      {session.title}
                    </Option>
                  ))
                : null}
            </Select>
            {
              currentCourseId || currentSessionId ? (
                <IconButton
                  placeholder={""}
                  onClick={onClearFilters}
                  variant="gradient"
                  size="md"
                  color="teal"
                  className="w-28 h-28"
                >
                  <TbTrash />
                </IconButton>
              ) : null
            }
          </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate(`/dashboard/my-quizzes/create-quiz`)}
            >
              Crear cuestionario
            </button>
        </div>
      </div>

      <div className={cx("w-full flex gap-2 flex-wrap items-start mt-2", listQuizzes.length? "h-fit" : "h-full")}>
        {listQuizzes && !listQuizzes.length ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <GoInbox className="h-20 text-9xl text-blue-gray-300" />
            <h3 className="text-center text-xl font-medium text-blue-gray-600">
              No hay cuestionarios
            </h3>
          </div>
        ) : null}
        {listQuizzes && listQuizzes.length
          ? listQuizzes.map((quiz: Quiz) => (
              <QuizCard
                key={quiz.ID}
                quiz={quiz}
                onSetToDeleteQuiz={onSetCurrentQuizToDelete}
              />
            ))
          : null}
      </div>
      {
        currentQuizToDelete ? (
          <QuizDeleteModal
            id=""
            quiz={currentQuizToDelete}
            {...toogleDeleteQuiz}
          />
        ) : null
      }
    </div>
  );
}

export default MyQuizzes