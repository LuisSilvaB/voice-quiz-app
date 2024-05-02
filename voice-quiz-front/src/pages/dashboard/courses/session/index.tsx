import { useState } from "react";
import { useParams } from "react-router-dom"; 
import { useNavigate,  } from "react-router-dom";
import { sessionTabs } from "../types";
import SessionMenu from "./session-menu";
import TranscriptionRecord from "./transcription-record";
import TranscriptionAudioFile from "./transcription-audio-file";
import TranscriptionRealTime from "./transcription-real-time";

const Session = () => {
  // const [targetTab, setTargetTab] = useState<sessionTabs>("record"); 
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(<TranscriptionRealTime />);
  const params = useParams()
  const navigate = useNavigate()
  const returnToCourse = () => {
    navigate(`/dashboard/courses/course/${params.courseId}`)
  }
  const handleTabChange = (tab: sessionTabs) => {
    switch(tab){
      case "audio-file":
        // setTargetTab("audio-file")
        setCurrentComponent(<TranscriptionAudioFile />)
        break
      case "real-time":
        // setTargetTab("real-time")
        setCurrentComponent(<TranscriptionRealTime />)
        break
      case "record":
        // setTargetTab("record")
        setCurrentComponent(<TranscriptionRecord />)
        break
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <SessionMenu
        returnToCourse={returnToCourse}
        handleTabChange={handleTabChange}
      />
      <div className="flex h-full w-full flex-col items-start justify-center">
        {currentComponent}
      </div>
    </div>
  );
}

export default Session