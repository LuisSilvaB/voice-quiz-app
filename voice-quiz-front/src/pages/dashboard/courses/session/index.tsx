import { useState } from "react";
import SessionMenu from "./session-menu";
import { useParams } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import { sessionTabs } from "../types";
import { FaCheck } from "react-icons/fa";
import TranscriptionRecord from "./transcription-record";
import TranscriptionAudioFile from "./transcription-audio-file";
import TranscriptionRealTime from "./transcription-real-time";
import { Button } from "@material-tailwind/react";

const Session = () => {
  const [targetTab, setTargetTab] = useState<sessionTabs>("record"); 
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(<TranscriptionRecord />);
  const { courseid } = useParams()
  const navigate = useNavigate()
  const returnToCourse = () => {
    navigate(`/dashboard/courses/course/${courseid}`)
  }
  const handleTabChange = (tab: sessionTabs) => {
    switch(tab){
      case "audio-file":
        setTargetTab("audio-file")
        setCurrentComponent(<TranscriptionAudioFile />)
        break
      case "real-time":
        setTargetTab("real-time")
        setCurrentComponent(<TranscriptionRealTime />)
        break
      case "record":
        setTargetTab("record")
        setCurrentComponent(<TranscriptionRecord />)
        break
    }
  }
  return (
    <div className="flex h-full w-full">
      <SessionMenu
        returnToCourse={returnToCourse}
        handleTabChange={handleTabChange}
      />
      <div className="flex h-full w-full flex-col items-start p-3 justify-center">
        <div className="flex w-full items-center justify-between px-4">          
          <p className="text-2xl font-normal">
            Crea tus pregutas utilizando{" "}
            <span className="bg-gradient-to-r from-pink-400 via-red-400 to-purple-400 bg-clip-text font-bold text-transparent">
              inteligencia artificial
            </span>
          </p>
          <Button placeholder={""} className="flex items-center gap-2">
            <FaCheck />
            Guardado
          </Button>
        </div>
        {currentComponent}
      </div>
    </div>
  );
}

export default Session