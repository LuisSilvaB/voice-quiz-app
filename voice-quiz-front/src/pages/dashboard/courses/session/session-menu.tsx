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

const SessionMenu: React.FC<Props> = ({ returnToCourse }) => {
  const sessionLoading = useSelector(
    (state: RootState) => state.sessions.sessionLoading,
  );
  const currrentCourse = useSelector(
    (state: RootState) => state.courses.course,
  );
  const currentSession = useSelector(
    (state: RootState) => state.sessions.session,
  );
  return (
    <div className="max-h-screen-sm flex h-fit w-full select-none flex-row items-center justify-between gap-6 px-4 py-2">
      <div className="flex w-auto items-center gap-3">
        <Button
          placeholder={""}
          size="sm"
          onClick={returnToCourse}
          className="my-2 flex flex-row items-center gap-2"
        >
          <PiKeyReturnFill className="h-auto w-5" />
        </Button>

        <Breadcrumbs placeholder={""} className="w-full text-xs">
          <BsGrid1X2 />
          <p>Cursos</p>
          <p onClick={returnToCourse}>Curso</p>
          <Chip size="sm" color="teal" value={currrentCourse.ID} />
          <p>Sesión</p>
          <Chip size="sm" color="deep-purple" value={currentSession.ID} />
        </Breadcrumbs>
      </div>
      <div className="flex h-fit w-fit flex-row items-center justify-end gap-6 font-montserrat">
        <Button
          variant="text"
          size="sm"
          placeholder={""}
          loading={sessionLoading}
          className="border"
        >
          {sessionLoading ? (
            <p>Guardando datos</p>
          ) : (
            <IoSaveOutline className="h-auto w-5 text-gray-500 " />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SessionMenu