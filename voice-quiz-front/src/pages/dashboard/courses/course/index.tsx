import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import CourseClass from "../../../../class/course.class"
import coursesMock from "../../mock/class.mock.json"
import { Button, Chip } from "@material-tailwind/react"
import CourseSessionsTable from "./curse-sessions-table"
import { FaMicrophone } from "react-icons/fa";

const Course = () => {
  const [currentCourse, setCurrentCourse ] = useState<CourseClass>({} as CourseClass)
  const params = useParams(); 
  useEffect(()=>{
    getCurrentCourse(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const getCurrentCourse = () => {
    const data  =  coursesMock.dashboardCourses.find((course) => course.id === params.id )
    setCurrentCourse(data as CourseClass)
  }
  return (
    <div className="flex w-full flex-1 select-none flex-row items-start justify-start gap-6">
      <div className="flex h-full w-max flex-col gap-2 lg:ml-11">
        <div className="top-5 mt-4 rounded-lg border-t bg-white p-6 shadow-lg lg:w-full lg:max-w-[500px]">
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
            <div>
              <Button placeholder={""} className="bg-blue-500">
                Editar
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 border lg:w-full lg:max-w-[500px]"></div>
      </div>
      <div className="flex flex-col max-h-[80vh] flex-1 overflow-y-auto px-4 pt-5">
        <div className="flex justify-end py-4">
          <Button placeholder={""} className="bg-green-500 flex gap-2 items-center">
            <p>Comenzar una sesión</p>
            <FaMicrophone />
          </Button>
        </div>
        <CourseSessionsTable sessions={currentCourse.sessions} />
      </div>
    </div>
  );
}

export default Course