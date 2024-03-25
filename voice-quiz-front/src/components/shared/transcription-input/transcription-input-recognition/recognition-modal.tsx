import React from 'react'
import { variants } from '../../../../pages/dashboard/courses/types'
import { motion } from "framer-motion"
import { IoClose } from "react-icons/io5";
import useRecognition from '../../../../hooks/useRecognition';
import { useSpeechRecognition } from 'react-speech-recognition';
import { Button, IconButton } from '@material-tailwind/react';
import { FaMicrophoneAlt } from 'react-icons/fa';


interface Props {
    onClose: () => void;
    isOpen: boolean;
    isListening: boolean;
    setListening: React.Dispatch<React.SetStateAction<boolean>>; 
}


const RecognitionModal:React.FC<Props> = ({onClose, isOpen, isListening, setListening}) => {
    const recognitionFns = useRecognition(); 
    const { transcript  } = useSpeechRecognition(); 
  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={isOpen ? "enter" : "exit"}
      className="fixed left-0 top-0 h-full w-full"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="z-20 flex h-[700px] max-h-[700px] w-[1000px] overflow-y-auto  max-w-[1000px] flex-col gap-2 rounded-xl bg-white p-3">
          <div className="flex w-full justify-end ">
            <IconButton placeholder={""} onClick={onClose}>
              <IoClose />
            </IconButton>
          </div>
          <p className='text-xl'>Transcripción</p>
          <div className="h-full w-full rounded-lg border p-4 text-lg font-normal max-h-[600px] overflow-y-auto">
            {transcript}
          </div>
          {isListening ? (
              <Button
                placeholder={""}
                className="bg-red-500 flex items-center gap-3"
                onClick={() => {
                    recognitionFns.onStopListening();
                    setListening(false) 
                }}
              >
                <p>Detener grabación</p>
                <FaMicrophoneAlt />
              </Button>
            ) : (
              <Button
                placeholder={""}
                className="bg-green-500"
                onClick={()=>{
                    recognitionFns.onListening();
                    setListening(true)
                }}
              >
                Iniciar grabación
              </Button>
            )}
        </div>
        <div className="fixed z-0 h-full w-full bg-[#00000067]" />
      </div>
    </motion.div>
  );
}

export default RecognitionModal