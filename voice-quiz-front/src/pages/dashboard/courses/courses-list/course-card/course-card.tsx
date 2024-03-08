import CourseClass from "../../../../../class/course.class";
import { useEffect } from "react";
import useToggle from "../../../../../hooks/useToggle";
import OptionsList from "./options-list/options-list";
import { Button } from "@material-tailwind/react";
import { FaRegFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface CourseCardProps extends CourseClass {
    handleOpenOptions: (id: string) => void
    targetClassRecord: CourseClass | null; 
} 

const CourseCard:React.FC<CourseCardProps> = ({targetClassRecord, handleOpenOptions ,...props}) => {
  const toggleOptions = useToggle(false);
  const navigate = useNavigate();  
  useEffect(()=>{
    if (targetClassRecord?.id === props.id) toggleOptions.onOpen(); 
    else toggleOptions.onClose(); 
  // eslint-disable-next-line 
  },[targetClassRecord, props.id])

  const openCourse = () => {
    navigate(`/dashboard/courses/course/${props.id}`)
  }
  return (
    <div className="flex h-fit w-[300px] cursor-pointer flex-col gap-2 rounded-lg border pb-4 shadow-md transition-all">
      <div>
        <img src={"https://placehold.co/600x400"} className="h-auto w-fit rounded-t-lg" />
      </div>
      <div className="px-4">
        <p className="text-xs text-gray-500">id: {props.id}</p>
        <p className="font-montserrat text-lg font-bold">{props.title}</p>
        <p>{props.sessions.length} sesiones de clase</p>
        <p>{props.createAt}</p>
      </div>
      <div className="flex w-full items-center justify-between px-4">
        <Button className="flex items-center gap-2 bg-blue-gray-400" placeholder={"acceder"} onClick={openCourse}>
          <span>Acceder</span>
          <FaRegFolderOpen/>
        </Button>
        <OptionsList
          cardClassId={props.id}
          isOpen={toggleOptions.isOpen}
          onClose = {toggleOptions.onClose} 
          handleOpenOptions={handleOpenOptions}
        />
      </div>
    </div>
  );
}

export default CourseCard