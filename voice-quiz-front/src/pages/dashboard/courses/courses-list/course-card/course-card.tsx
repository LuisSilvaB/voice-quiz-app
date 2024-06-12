import { Course } from "../../../../../class/course.class";
import OptionsList from "./options-list/options-list";
import { Button, Chip, Typography } from "@material-tailwind/react";
import { FaRegFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";


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
    <div className="flex h-fit min-w-[340px] w-[32.5%] cursor-pointer flex-col gap-2 rounded-lg border bg-white py-4 pb-4 shadow-md transition-all">
      <div className="px-4">
        <Typography placeholder={""} variant="h3" className="font-montserrat font-semibold text-gray-800">{course.title}</Typography>
        <Typography placeholder={""} variant="small" className="font-inter text-gray-800">{course.description}</Typography> 
        <div className="flex w-full items-center justify-between">
          <Chip
            color="teal"
            size="sm"
            className="mb-2 max-w-40"
            value={<p className="max-w-36 truncate text-ellipsis">{course.ID}</p>}
          />
          <div className="flex flex-row gap-2 items-center text-xs">
            <IoCalendarOutline />
            <p className="text-gray-800">{formatDate(course.created_at.toString())}</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between text-xs">
          <p className="text-gray-800 text-xs">{course.sessions_count ?? ""} sesiones de clase</p>
          <div className="flex flex-row gap-2 items-center">
            <IoTimeOutline />
            <p className="text-gray-800">{course.duration ?? ""} { parseInt(course.duration ?? "0") !== 1 ? "semanas" : "semana"}</p>
          </div>
        </div>
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