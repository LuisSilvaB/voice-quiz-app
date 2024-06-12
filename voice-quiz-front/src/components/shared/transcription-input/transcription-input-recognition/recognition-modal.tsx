import React from 'react'
import { variants } from '../../../../pages/dashboard/courses/types'
import { motion } from "framer-motion"
import { IoClose } from "react-icons/io5";
import useRecognition from '../../../../hooks/useRecognition';
import { Button, IconButton } from '@material-tailwind/react';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { VscEmptyWindow } from 'react-icons/vsc';


interface Props {
    onClose: () => void;
    isOpen: boolean;
    isListening: boolean;
    setListening: React.Dispatch<React.SetStateAction<boolean>>; 
    currentTranscript: string;
    isRecording: boolean;
}


const RecognitionModal:React.FC<Props> = ({onClose, isOpen, isListening, setListening, currentTranscript, isRecording}) => {
    const recognitionFns = useRecognition(); 
  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={isOpen ? "enter" : "exit"}
      className="fixed left-0 top-0 z-30 h-full w-full"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="z-20 flex h-full max-h-[70vh] w-[1000px] max-w-[1000px]  flex-col gap-2 overflow-y-auto rounded-xl bg-white p-3">
          <div className="flex h-fit w-full flex-row items-center justify-center gap-2">
            <div className="flex w-full items-center justify-between px-1">
              <p className="text-xl">Transcripción</p>
              <IconButton
                placeholder={""}
                onClick={onClose}
                variant="gradient"
                color="red"
              >
                <IoClose />
              </IconButton>
            </div>
          </div>
          <div className="h-full max-h-[600px] w-full overflow-y-auto rounded-lg border-2 p-4 text-lg font-normal">
            {!currentTranscript.length ? (
              <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 text-gray-600">
                <VscEmptyWindow className="h-auto w-10" />
                <p className="font-medium">No hay transcripción</p>
              </div>
            ) : (
              currentTranscript
            )}
          </div>
          <div className='flex flex-row items-center justify-between'>
            <div className='w-fit flex flex-row items-center gap-2 justify-between'>
            {isListening ? (
                  <div className="relative">
                    <Button
                      placeholder={""}
                      size="sm"
                      className="flex items-center gap-3 bg-red-500"
                      disabled={isRecording ? true : false}
                      onClick={() => {
                        recognitionFns.onStopListening();
                        setListening(false);
                      }}
                    >
                      <p>Detener grabación</p>
                      <FaMicrophoneAlt />
                    </Button>
                    <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center">
                      <div className="realtive flex h-4 w-4 items-center justify-center rounded-full opacity-75">
                        <div className="absolute h-4 w-4 animate-ping rounded-full bg-red-900 opacity-75 duration-200" />
                        <div className="h-full w-full rounded-full bg-red-900 opacity-75" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    placeholder={""}
                    className="bg-green-500"
                    onClick={() => {
                      recognitionFns.onListening();
                      setListening(true);
                    }}
                  >
                    Iniciar grabación
                  </Button>
                )}

              <p className='text-xs font-normal text-gray-600'> 
                {isRecording ? "Grabando..." : "Grabación detenida"}
              </p>
            </div>
            <p className='text-xs font-normal text-gray-600'> Cantidad de carateres: {currentTranscript.length}</p>
          </div>
        </div>
        <div className="fixed z-0 h-full w-full bg-[#00000067]" />
      </div>
    </motion.div>
  );
}

export default RecognitionModal