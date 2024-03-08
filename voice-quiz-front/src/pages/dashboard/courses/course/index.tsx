import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import CourseClass from "../../../../class/course.class"
import coursesMock from "../../mock/class.mock.json"
import { Button, Chip } from "@material-tailwind/react"
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
    <div className="flex flex-1 w-full select-none flex-col items-start justify-start">
      <div className="flex w-full h-full flex-col gap-2">

        <div className="top-5 mt-4 rounded-lg border-t bg-white p-6 shadow-lg lg:ml-11 lg:w-full lg:max-w-[500px]">
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

        <div className="lg:ml-11 lg:w-full lg:max-w-[500px] flex-1 border"></div>

      </div>
      {/* <div className="mt-8">
        {
          currentCourse?.sessions?.map((session, index) => (
            <div key={index} className="flex w-full items-center gap-2">
              <img src="https://placehold.co/600x400" className="w-[200px] h-auto rounded-lg shadow-lg" />
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-2xl font-bold">
                  {session.title}
                </p>
                <div className="flex w-full justify-between items-center gap-2 border-b">
                  <span className="font-bold">Id:</span>
                  <p>{session.id}</p>
                </div>
                <div className="flex w-full justify-between items-center gap-2 border-b">
                  <span className="font-bold">Fecha de creación:</span>
                  <p>{session.createAt}</p>
                </div>
                <div className="flex w-full justify-between items-center gap-2 border-b">
                  <span className="font-bold">Última actualización:</span>
                  <p>{session.createAt}</p>
                </div>
                <div className="flex w-full justify-between items-center gap-2 border-b">
                  <span className="font-bold">Duración:</span>
                </div>
              </div>
            </div>
          ))
        }
      </div> */}
    </div>
  );
}

export default Course