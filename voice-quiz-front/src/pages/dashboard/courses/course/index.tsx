import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button, Typography } from "@material-tailwind/react"

import { CiSearch } from "react-icons/ci";
import { FaArrowAltCircleRight } from "react-icons/fa";

import { Course } from "../../../../class/course.class"
import CourseSessionsTable from "./curse-sessions-table"
import useToggle from "../../../../hooks/useToggle"
import { useNavigate } from "react-router-dom"; 

import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";


import EditCourseModal from "../courses-list/course-card-modals/edit-course/edit-course.modal";
import DeleteCourseModal from "../courses-list/course-card-modals/delete-course.modal";
import { ModalActions } from "../../../../interface/types";

import {
  // setTypeModal,
  // setTargetCourse,
  // setToggleModal,
  clearCourseData,
} from "../../../../features/db-features/courses.features";
import { setSessionTypeModal, setSessionToggleModal, getAllSessions, clearSessionsData } from "../../../../features/db-features/sessions.features";

import { getCourse } from "../../../../features/db-features/courses.features";
import { AppDispatch, RootState } from "../../../../app/store";
import { supabase } from '../../../../config/config';
import { toast } from "sonner";
import { Session } from "../../../../class/sessions";
// import CourseSkeleton from "./course-skeleton";


const CourseView = () => {
  const currentCourse:Course = useSelector((state: RootState) => state.courses.course)
  // const courseLoading:boolean = useSelector((state: RootState) => state.courses.courseLoading)
  const currentUser = useSelector((state: RootState) => state.users.user)
  const sessions = useSelector((state: RootState) => state.sessions.sessions)
  const sessionsLoading = useSelector((state: RootState) => state.sessions.sessionsLoading)
  const [ filter, setFilter ] = useState<string>("")
  const navigate = useNavigate(); 
  const toggleSession = useToggle(); 
  const params = useParams();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=> {
    if (!currentCourse.ID && params.courseId && currentUser?.ID) {
      dispatch(getCourse({courseId: params.courseId ?? "", userId: currentUser?.ID ?? ""}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.ID, params.courseId])

  useEffect(()=> {
    dispatch(getCourse({courseId: params.courseId ?? "", userId: currentUser?.ID ?? ""}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  useEffect(()=>{
    if (currentCourse.ID && currentUser?.ID) {
      dispatch(getAllSessions({
        userId: currentUser?.ID,
        courseId: currentCourse.ID
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentCourse, currentUser])

  useEffect(()=> {
    const subscribeUpdateChannel = supabase
    .channel("update-courses")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "COURSES" },
      (payload) => {
        if (currentUser && (payload.new.user_id === currentUser?.ID)) {
          dispatch(
            getCourse({
              courseId: params.courseId ?? "",
              userId: currentUser?.ID ?? "",
            }),
          );
        }
      },
    ).subscribe();

    const subscribeDeleteChannel = supabase
    .channel("delete-course")
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "COURSES" },
      () => {
          toast.success("Curso eliminado con éxito")
          navigate('/dashboard/courses')
      },
    ).subscribe();

    const subscribeCreateSesssion = supabase
      .channel("create-session")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "SESSIONS" },
        () => {
          dispatch(
            getAllSessions({
              userId: currentUser?.ID ?? '',
              courseId: currentCourse.ID ?? '', 
            }),
          );
        },
      ).subscribe();

    return () => {
      subscribeUpdateChannel.unsubscribe()
      subscribeDeleteChannel.unsubscribe()
      subscribeCreateSesssion.unsubscribe()
      dispatch(clearSessionsData());
      dispatch(clearCourseData());  
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  
  

  // useEffect(()=>{
  //   getCurrentCourse(); 
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[])
  
  // const getCurrentCourse = () => {
  //   const data  =  coursesMock.dashboardCourses.find((course) => course.id === params.id )
  //   setCurrentCourse(data as Course)
  // }
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }; 
 
  // const openSessionDetails = (id: string) => {
  //   setFilter(id)
  //   const session = currentCourse.sessions.find((session) => session.id === id); 
  //   setTargetSession(session); 
  //   tagSession.onOpen()
  // }

  const openSessionView = (id: string) => {
    navigate(`/dashboard/courses/course/${params.courseId}/session/${id}`)
  }

  const returnToSessions = () => {
    toggleSession.onClose(); 
    setFilter("")
  }

  // const openModal = (action: ModalActions) => {
  //   dispatch(setTypeModal(action))
  //   dispatch(setTargetCourse(currentCourse))
  //   dispatch(setToggleModal())
  // }
  const openCreateSessionModal = (action: ModalActions) => {
    dispatch(setSessionTypeModal(action))
    dispatch(setSessionToggleModal())
  }


  
  return (
    <div className="flex w-full flex-1 select-none flex-col items-center justify-start gap-1 lg:flex-col lg:items-start">
      <div className="h-fit w-full px-4 pt-5">
        <Typography placeholder={""} variant="h2" color="gray">
          {currentCourse.title}
        </Typography>
      </div>
      <div className="flex max-h-[80vh] w-full flex-1 flex-col overflow-y-auto px-4 pt-1">
        <div className="flex items-center  justify-between py-4 ">
          <div className="relative flex w-[60%] ">
            {toggleSession.isOpen ? (
              <></>
            ) : (
              <>
                <input
                  type="text"
                  value={filter}
                  placeholder=" Buscar una sesión"
                  className=" h-10 w-full rounded-3xl border-2 pl-6 focus:outline-none"
                  onChange={(e) => handleFilter(e)}
                />
                <CiSearch className="absolute left-2 top-3 text-gray-500" />
              </>
            )}
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {toggleSession.isOpen ? (
              <Button
                placeholder={""}
                className="flex h-10 w-32 items-center gap-2"
                onClick={returnToSessions}
              >
                <p>Volver a las sesiones</p>
                <FaArrowAltCircleRight />
              </Button>
            ) : (
              <Button
                onClick={() => openCreateSessionModal("create")}
                placeholder={""}
                variant="filled"
                size="md"
                color="green"
                className="flex items-center justify-center gap-2"
              >
                <p>Nueva sesión</p>
                <FiPlus />
              </Button>
            )}
          </div>
        </div>
        <CourseSessionsTable
          sessions={(sessions as Session[]) ?? ([] as Session[])}
          sessionLoading={sessionsLoading}
          filter={filter}
          setFilter={setFilter}
          openSessionDetails={() => {}}
          openSessionView={openSessionView}
          {...toggleSession}
        />
        {sessionsLoading ? (
          <div className="flex w-full flex-col h-20 items-center justify-center gap-2">
            <CgSpinner className="h-16 w-16 animate-spin text-gray-500" />
          </div>
        ) : null}
      </div>
      <EditCourseModal />
      <DeleteCourseModal />
    </div>
  );
}

export default CourseView