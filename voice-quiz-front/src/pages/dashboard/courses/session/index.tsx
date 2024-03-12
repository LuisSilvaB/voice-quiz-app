import { useParams } from "react-router-dom"
import { BsRecordCircle } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const Session = () => {
  const { courseid, id } = useParams()
  console.log(courseid, id);
  
  return (
    <div className="w-full h-full max-h-screen-sm flex justify-center items-center flex-col gap-16 select-none">
      <p className="font-normal text-4xl ">Crea tus pregutas utilizando <span className="bg-gradient-to-r from-pink-400 to-purple-400 via-red-400 text-transparent bg-clip-text font-bold">inteligencia artificial</span></p>
      <div className="flex h-fit w-full items-center justify-center gap-10 font-montserrat">
        <div className="flex flex-col gap-5 justify-center items-center w-full h-full max-w-[300px] min-h-[300px] shadow-lg bg-gradient-to-r from-cyan-300 to-blue-500 text-white font-bold rounded-xl cursor-pointer group/item">
          <div className="flex-1 flex justify-end items-end">
            <BsRecordCircle className="w-12 h-12 group-hover/item:animate-pulse"/>
          </div>
          <p className="w-[80%] text-center text-xl flex-1">Grabación y transcripción de audio</p>
        </div>
        <div className="flex flex-col gap-5 justify-center items-center w-full h-full max-w-[300px] min-h-[300px] shadow-lg bg-gradient-to-r from-orange-300 to-pink-400 text-white font-bold rounded-xl cursor-pointer group/item ">
          <div className="flex-1 flex justify-end items-end">
            <FaFileUpload className="w-12 h-12  group-hover/item:animate-bounce" />
          </div>
          <p className="w-[80%] text-center text-xl flex-1">Transcripción mediante archivo de audio</p>
        </div>
        <div className="flex flex-col gap-5 justify-center items-center w-full h-full max-w-[300px] min-h-[300px] shadow-lg bg-gradient-to-r from-purple-500 to-purple-900 text-white font-bold rounded-xl cursor-pointer group/item">
          <MdRecordVoiceOver className="w-12 h-12 group-hover/item:animate-pulse"/>
          <p className="w-[80%] text-center text-xl">Transcripción de audio en tiempo real</p>
        </div>
      </div>
    </div>
  );
}

export default Session