import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button, Chip } from "@material-tailwind/react"

import { FaMicrophone } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaArrowAltCircleRight } from "react-icons/fa";

import CourseClass from "../../../../class/course.class"
import coursesMock from "../../mock/class.mock.json"
import CourseSessionsTable from "./curse-sessions-table"
import useToggle from "../../../../hooks/useToggle"
import SessionDetails from "./session-details";
import { Session } from "../../../../interface";
import { useNavigate } from "react-router-dom"; 

import { useDispatch } from "react-redux";
import { setTypeModal, setTargetCourse, setIsOpenModal } from "../../../../features/course.features";

import EditCourseModal from "../courses-list/course-card/edit-course.modal";
import DeleteCourseModal from "../courses-list/course-card/delete-course.modal";
import { ModalActions } from "../../../../interface/types";

const Course = () => {
  const [currentCourse, setCurrentCourse ] = useState<CourseClass>({} as CourseClass)
  const [ filter, setFilter ] = useState<string>("")
  const [ targetSession, setTargetSession ] = useState<Session | null >()
  const navigate = useNavigate(); 
  const tagSession = useToggle(); 
  const params = useParams();

  const dispatch = useDispatch();
  
  

  useEffect(()=>{
    getCurrentCourse(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const getCurrentCourse = () => {
    const data  =  coursesMock.dashboardCourses.find((course) => course.id === params.id )
    setCurrentCourse(data as CourseClass)
  }
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value)
  }; 
 
  const openSessionDetails = (id: string) => {
    setFilter(id)
    const session = currentCourse.sessions.find((session) => session.id === id); 
    setTargetSession(session); 
    tagSession.onOpen()
  }

  const openSessionView = (id: string) => {
    navigate(`/dashboard/courses/course/${currentCourse.id}/session/${id}`)
  }

  const returnToSessions = () => {
    tagSession.onClose(); 
    setFilter("")
  }

  const openModal = (action: ModalActions) => {
    dispatch(setTypeModal(action))
    dispatch(setTargetCourse(currentCourse))
    dispatch(setIsOpenModal(true))
  }
  
  return (
    <div className="flex w-full flex-1 select-none flex-col lg:flex-row items-start justify-start gap-6">
      <div className="flex h-fit lg:h-full w-fit lg:w-auto flex-col items-center justify-center lg:justify-start lg:items-start gap-2 lg:ml-11">
        <div className="top-5 mt-4 rounded-lg w-full max-w-[350px] mx-auto relative border-t bg-white p-6 shadow-lg lg:w-full lg:max-w-[500px]">
          <div className="flex flex-col gap-5">
            <div className=" h-48 w-48 rounded-lg  bg-white">
              <img
                src="https://placehold.co/300x300"
                className="h-full w-full rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-3xl font-bold">{currentCourse.title}</p>
              <p className="flex justify-between font-bold text-gray-500">
                id del curso:
                <span className="ml-4 font-normal">{currentCourse.id}</span>
              </p>
              <p className="flex justify-between font-bold text-gray-500">
                N° de sesiones:{" "}
                <span className="font-normal">
                  {currentCourse?.sessions?.length} sesiones
                </span>
              </p>
              <p className="flex justify-between font-bold text-gray-500 md:items-center">
                Categoría/s:{" "}
                <span className="m-1 flex flex-wrap justify-end gap-2 font-normal">
                  {currentCourse?.sessions?.map((sesion) => (
                    <Chip value={sesion.title} />
                  ))}
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              <Button placeholder={""} className="bg-blue-500" onClick={() => { openModal("edit") }}>
                Editar
              </Button>
              <Button placeholder={""} className="bg-red-500" onClick={() => { openModal("delete") }}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        {/* <div className="flex-1 border lg:w-full lg:max-w-[500px]"></div> */}
      </div>
      <div className="flex max-h-[80vh] flex-1 flex-col overflow-y-auto px-4 pt-5">
        <div className="flex items-center justify-between py-4">
          <div className="relative flex">
            {tagSession.isOpen ? (
              <></>
            ) : (
              <>
                <input
                  type="text"
                  value={filter}
                  placeholder=" Buscar una sesión"
                  className=" h-10 w-full rounded border-2 pl-6 focus:outline-none "
                  onChange={(e) => handleFilter(e)}
                />
                <CiSearch className="absolute left-2 top-3 text-gray-500" />
              </>
            )}
          </div>
          {tagSession.isOpen ? (
            <Button
              placeholder={""}
              className="flex h-10 items-center gap-2"
              onClick={returnToSessions}
            >
              <p>Volver a las sesiones</p>
              <FaArrowAltCircleRight />
            </Button>
          ) : (
            <Button
              placeholder={""}
              className="flex h-10 items-center gap-2 bg-green-500"
            >
              <p>Comenzar una sesión</p>
              <FaMicrophone />
            </Button>
          )}
        </div>
        <CourseSessionsTable
          sessions={currentCourse.sessions}
          filter={filter}
          setFilter={setFilter}
          openSessionDetails={openSessionDetails}
          openSessionView={openSessionView}
          onClose={tagSession.onClose}
          onOpen={tagSession.onOpen}
          isOpen={tagSession.isOpen}
          onToggle={tagSession.onToggle}
        />
         <SessionDetails targetSession={targetSession ?? {} as Session} isOpen = {tagSession.isOpen}/> 
      </div>
      <EditCourseModal />
      <DeleteCourseModal />
    </div>
  );
}

export default Course