import { Course } from "../../../../../class/course.class";
import OptionsList from "./options-list/options-list";
import { Button, Chip } from "@material-tailwind/react";
import { FaRegFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface CourseCardProps extends Course {} 

const CourseCard:React.FC<CourseCardProps> = ({...course}) => {
  const navigate = useNavigate(); 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  const openCourse = () => {
    navigate(`/dashboard/courses/course/${course.ID}`)
  }
  return (
    <div className="flex h-fit w-[300px] cursor-pointer flex-col gap-2 rounded-lg border bg-white py-4 pb-4 shadow-md transition-all">
      {/* <div>
        <img src={"https://placehold.co/600x400"} className="h-auto w-fit rounded-t-lg" />
      </div> */}
      <div className="px-4">
        <Chip
          color="teal"
          size="sm"
          className="mb-2 max-w-40"
          value={<p className="max-w-36 truncate text-ellipsis">{course.ID}</p>}
        />
        <p className="font-montserrat text-lg font-bold text-gray-800">{course.title}</p>
        <p className="font-montserrat text-lg font-bold text-gray-800 max-w-36 truncate text-ellipsis">{course.description}</p>
        <p className="text-gray-800">{course.sessions_count ?? ""} sesiones de clase</p>
        <p className="text-gray-800">{formatDate(course.created_at.toString())}</p>
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