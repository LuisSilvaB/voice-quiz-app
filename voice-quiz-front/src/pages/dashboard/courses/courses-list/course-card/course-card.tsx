import { Course } from "../../../../../class/course.class";
import OptionsList from "./options-list/options-list";
import { Button } from "@material-tailwind/react";
import { FaRegFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface CourseCardProps extends Course {} 

const CourseCard:React.FC<CourseCardProps> = ({...course}) => {
  const navigate = useNavigate(); 

  const openCourse = () => {
    navigate(`/dashboard/courses/course/${course.ID}`)
  }
  return (
    <div className="flex h-fit w-[300px] cursor-pointer flex-col gap-2 rounded-lg border py-4 pb-4 shadow-md transition-all">
      {/* <div>
        <img src={"https://placehold.co/600x400"} className="h-auto w-fit rounded-t-lg" />
      </div> */}
      <div className="px-4">
        <p className="text-xs text-gray-500">id: {course.ID}</p>
        <p className="font-montserrat text-lg font-bold">{course.title}</p>
        <p>{course.sessions_count ?? ""} sesiones de clase</p>
        <p>{course.created_at.toString()}</p>
      </div>
      <div className="flex w-full items-center justify-between px-4">
        <Button
          className="flex items-center gap-2 bg-blue-gray-400"
          placeholder={"acceder"}
          onClick={openCourse}
        >
          <span>Acceder</span>
          <FaRegFolderOpen />
        </Button>
        <OptionsList {...course} />
      </div>
    </div>
  );
}

export default CourseCard