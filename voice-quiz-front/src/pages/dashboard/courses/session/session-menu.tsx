import { MdRecordVoiceOver } from "react-icons/md";
import { Breadcrumbs, Button, Chip } from "@material-tailwind/react";
import { PiKeyReturnFill } from "react-icons/pi";
import { sessionTabs } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { IoSaveOutline } from "react-icons/io5";
import { BsGrid1X2 } from "react-icons/bs";

interface Props {
    returnToCourse: () => void
    handleTabChange: (tab: sessionTabs) => void
    currentComponent:React.ReactNode
} 

const SessionMenu:React.FC<Props> = ({returnToCourse, handleTabChange}) => {
  const sessionLoading = useSelector((state:RootState)=> state.sessions.sessionLoading)
  const currrentCourse = useSelector((state:RootState)=> state.courses.course)
  const currentSession = useSelector((state:RootState)=> state.sessions.session)
  return (
    <div className="max-h-screen-sm flex h-fit py-2 w-full justify-between select-none flex-row items-center gap-6 px-4">
      <div className="w-auto flex gap-3 items-center">
        <Button
          placeholder={""}
          onClick={returnToCourse}
          className="my-2 flex flex-row items-center gap-2"
        >
          <PiKeyReturnFill className="h-auto w-5" />
        </Button>

        <Breadcrumbs placeholder={""} className="w-full">
          <BsGrid1X2 /> 
            <p>Cursos</p>
            <p onClick={returnToCourse}>Curso</p>
            <Chip 
              color="teal"
              value = {currrentCourse.ID}
            />
            <p>Sesión</p>
            <Chip 
              color="deep-purple"
              value = {currentSession.ID}
            />
        </Breadcrumbs>

      </div>
      <div className="flex h-fit w-fit flex-row items-center justify-end gap-6 font-montserrat">

        <Button placeholder={""} loading={sessionLoading} className="bg-green-500">
          {sessionLoading ? null : <IoSaveOutline className="w-5 h-auto" /> }
        </Button>
        <div
          className="group/item flex h-full  max-h-[50px] transition-all max-w-[250px] cursor-pointer flex-row items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-900 p-4 font-bold text-white shadow-lg"
          onClick={() => handleTabChange("real-time")}
        >
          <MdRecordVoiceOver className="h-8 w-8 group-hover/item:animate-pulse" />
          <p className="w-[80%] text-center text-xs">
            Transcripción de audio en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
}

export default SessionMenu