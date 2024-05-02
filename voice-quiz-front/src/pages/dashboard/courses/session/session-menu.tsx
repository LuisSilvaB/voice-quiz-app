import { MdRecordVoiceOver } from "react-icons/md";
import { Button } from "@material-tailwind/react";
import { PiKeyReturnFill } from "react-icons/pi";
import { sessionTabs } from "../types";

interface Props {
    returnToCourse: () => void
    handleTabChange: (tab: sessionTabs) => void
} 

const SessionMenu:React.FC<Props> = ({returnToCourse, handleTabChange}) => {
//     <p className="text-2xl font-normal p-2">
//     Crea tus pregutas utilizando{" "}
//     <span className="bg-gradient-to-r from-pink-400 via-red-400 to-purple-400 bg-clip-text font-bold text-transparent">
//       inteligencia artificial
//     </span>
//   </p>
  return (
    <div className="max-h-screen-sm flex h-fit py-2 w-full select-none flex-row items-center justify-start gap-6 px-4">
      <div className="w-[300px]">
        <Button
          placeholder={""}
          onClick={returnToCourse}
          className="my-2 flex flex-row items-center gap-2"
        >
          <PiKeyReturnFill className="h-auto w-5" />
          <p>Regresar al curso</p>
        </Button>
      </div>
      <div className="flex h-fit w-full flex-row items-center justify-end gap-6 font-montserrat">
        {/* <div
          className="group/item flex h-full  max-h-[50px] transition-all max-w-[250px] cursor-pointer flex-row items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 p-4 font-bold text-white shadow-lg"
          onClick={() => handleTabChange("record")}
        >
          <div className="flex items-end justify-end">
            <BsRecordCircle className="h-8 w-8 group-hover/item:animate-pulse" />
          </div>
          <p className="text-xs text-center">
            Grabación y transcripción de audio
          </p>
        </div>

        <div
          className="group/item flex h-full  max-h-[50px] transition-all max-w-[250px] cursor-pointer flex-row items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-300 to-pink-400 p-4 font-bold text-white shadow-lg "
          onClick={() => handleTabChange("audio-file")}
        >
          <div className="flex flex-1 items-end justify-end">
            <FaFileUpload className="h-8 w-8  group-hover/item:animate-bounce" />
          </div>
          <p className=" text-center text-xs">
            Transcripción mediante archivo de audio
          </p>
        </div> */}

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