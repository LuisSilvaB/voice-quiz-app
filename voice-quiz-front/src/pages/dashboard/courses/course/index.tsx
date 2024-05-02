import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@material-tailwind/react"

import { CiSearch } from "react-icons/ci";
import { FaArrowAltCircleRight } from "react-icons/fa";

import { Course } from "../../../../class/course.class"
import CourseSessionsTable from "./curse-sessions-table"
import useToggle from "../../../../hooks/useToggle"
import { useNavigate } from "react-router-dom"; 

import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";


import EditCourseModal from "../courses-list/course-card-modals/edit-course/edit-course.modal";
import DeleteCourseModal from "../courses-list/course-card-modals/delete-course.modal";
import { ModalActions } from "../../../../interface/types";

import { setTypeModal, setTargetCourse, setToggleModal, clearCourseData } from "../../../../features/db-features/courses.features";
import { setSessionTypeModal, setSessionToggleModal, getAllSessions, clearSessionsData } from "../../../../features/db-features/sessions.features";

import { getCourse } from "../../../../features/db-features/courses.features";
import { AppDispatch, RootState } from "../../../../app/store";
import { supabase } from '../../../../config/config';
import { toast } from "sonner";
import { Session } from "../../../../class/sessions";
import CourseSkeleton from "./course-skeleton";


const CourseView = () => {
  const currentCourse:Course = useSelector((state: RootState) => state.courses.course)
  const courseLoading:boolean = useSelector((state: RootState) => state.courses.courseLoading)
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

  const openModal = (action: ModalActions) => {
    dispatch(setTypeModal(action))
    dispatch(setTargetCourse(currentCourse))
    dispatch(setToggleModal())
  }
  const openCreateSessionModal = (action: ModalActions) => {
    dispatch(setSessionTypeModal(action))
    dispatch(setSessionToggleModal())
  }



  // if(courseLoading || !currentCourse ) return (
  //   <div className="flex h-full w-full items-center justify-center">
  //     <CgSpinner className="h-auto w-20 animate-spin text-tangaroa-500" />
  //   </div>
  // );
  
  return (
    <div className="flex w-full flex-1 select-none flex-col items-start justify-start gap-6 lg:flex-row">
      <div className="flex h-fit w-fit flex-col items-center justify-center gap-2 lg:ml-11 lg:h-full lg:w-auto lg:items-start lg:justify-start">
        {!currentCourse ? (
          <CourseSkeleton />
        ) : (
          <div className="relative top-5 mx-auto mt-4 w-full max-w-[350px] rounded-lg border-t bg-white p-6 shadow-lg lg:w-[500px] lg:max-w-[500px]">
            <div className="flex flex-col gap-5">
              <div className=" h-48 w-48 rounded-lg  bg-white">
                <img
                  src="https://placehold.co/300x300"
                  className="h-full w-full rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-3xl font-bold">
                  {courseLoading ? (
                    <div className="h-8 w-40 animate-pulse rounded-md bg-gray-300" />
                  ) : (
                    currentCourse.title
                  )}
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  id del curso:
                  <span className="ml-4 font-normal">
                    {courseLoading ? (
                      <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                    ) : (
                      currentCourse.ID
                    )}
                  </span>
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  N° de sesiones:{" "}
                  {courseLoading ? (
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                  ) : (
                    <span className="font-normal">
                      {currentCourse?.sessions_count} sesiones
                    </span>
                  )}
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  Profesor:{" "}
                  {courseLoading ? (
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                  ) : (
                    <span className="font-normal">
                      {currentCourse?.teacher_name}
                    </span>
                  )}
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  Cantidad de estudiantes:{" "}
                  {courseLoading ? (
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                  ) : (
                    <span className="font-normal">
                      {currentCourse?.students_count} estudiantes
                    </span>
                  )}
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  Duración :{" "}
                  {courseLoading ? (
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                  ) : (
                    <span className="font-normal">
                      {currentCourse?.duration} semanas
                    </span>
                  )}
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  Fecha de inicio:{" "}
                  {courseLoading ? (
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                  ) : (
                    <span className="font-normal">
                      {currentCourse?.initial_date
                        ? new Date(currentCourse.initial_date)
                            .toISOString()
                            .split("T")[0]
                        : ""}
                    </span>
                  )}
                </p>

                <p className="flex justify-between font-bold text-gray-500">
                  Fecha de fin:{" "}
                  {courseLoading ? (
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-gray-300" />
                  ) : (
                    <span className="font-normal">
                      {currentCourse?.final_date
                        ? new Date(currentCourse.final_date)
                            .toISOString()
                            .split("T")[0]
                        : ""}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  placeholder={""}
                  className="bg-blue-500"
                  onClick={() => {
                    openModal("edit");
                  }}
                >
                  Editar
                </Button>
                <Button
                  placeholder={""}
                  className="bg-red-500"
                  onClick={() => {
                    openModal("delete");
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* <div className="flex-1 border lg:w-full lg:max-w-[500px]"></div> */}
      </div>
      <div className="flex max-h-[80vh] flex-1 flex-col overflow-y-auto px-4 pt-5">
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
          <div className="gap-2Z flex items-center">
            <Button loading={sessionsLoading} placeholder={""}>
              SESSIONS
            </Button>
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
                className="flex h-10 items-center gap-2 bg-green-500"
              >
                <p>Nueva sessión</p>
                <FiPlus />
              </Button>
            )}
          </div>
        </div>
        <CourseSessionsTable
          sessions={(sessions as Session[]) ?? ([] as Session[])}
          filter={filter}
          setFilter={setFilter}
          openSessionDetails={() => {}}
          openSessionView={openSessionView}
          {...toggleSession}
        />
        {/* <SessionDetails targetSession={targetSession ?? {} as Session} isOpen = {tagSession.isOpen}/>  */}
      </div>
      <EditCourseModal />
      <DeleteCourseModal />
    </div>
  );
}

export default CourseView