import { BsRecordCircle } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
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
    <div className="max-h-screen-sm flex h-full w-[300px] select-none flex-col items-center justify-start gap-6 border-r">
      <div className="w-fit">
        <Button
          placeholder={""}
          onClick={returnToCourse}
          className="my-2 ml-2 flex flex-row items-center gap-2"
        >
          <PiKeyReturnFill className="h-auto w-5" />
          <p>Regrasar al curso</p>
        </Button>
      </div>
      <div className="flex h-fit w-full flex-col items-center justify-center gap-6 font-montserrat">

        <div className="group/item flex  h-full min-h-[230px] w-[200px] cursor-pointer flex-col items-center justify-center gap-5 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 pb-4 font-bold text-white shadow-lg" onClick={()=> handleTabChange("record")}>
          <div className="flex flex-1 items-end justify-end">
            <BsRecordCircle className="h-12 w-12 group-hover/item:animate-pulse" />
          </div>
          <p className="w-[80%] flex-1 text-center text-lg">
            Grabación y transcripción de audio
          </p>
        </div>

        <div className="group/item flex h-full min-h-[230px] w-[200px] cursor-pointer flex-col items-center justify-center gap-5 rounded-xl bg-gradient-to-r from-orange-300 to-pink-400 pb-4 font-bold text-white shadow-lg " onClick={()=> handleTabChange("audio-file")}>
          <div className="flex flex-1 items-end justify-end">
            <FaFileUpload className="h-12 w-12  group-hover/item:animate-bounce" />
          </div>
          <p className="w-[80%] flex-1 text-center text-lg">
            Transcripción mediante archivo de audio
          </p>
        </div>

        <div className="group/item flex h-full min-h-[230px] w-[200px] cursor-pointer flex-col items-center justify-center gap-5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-900 font-bold text-white shadow-lg" onClick={()=> handleTabChange("real-time")}>
          <MdRecordVoiceOver className="h-12 w-12 group-hover/item:animate-pulse" />
          <p className="w-[80%] text-center text-lg">
            Transcripción de audio en tiempo real
          </p>
        </div>

      </div>
    </div>
  );
}

export default SessionMenu