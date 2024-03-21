import { useState } from 'react';
import { IconButton, Button } from '@material-tailwind/react'
import { IoCopy } from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa'
import { FaExpandAlt } from "react-icons/fa";
import useRecognition from '../../../../hooks/useRecognition'
import { useSpeechRecognition } from 'react-speech-recognition'
import RecognitionModal from './recognition-modal';
import useToggle from '../../../../hooks/useToggle';
const InputRecognition = () => {
  const recognitionFns = useRecognition();  
  const transcriptionModal = useToggle(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const  { transcript }  = useSpeechRecognition()

  return (
    <div className="flex h-full w-full max-w-[60%] flex-col">
      <div className="flex h-full w-full flex-col rounded-lg border p-4">
        <h3 className="text-lg">Transcripción</h3>
        <div className="flex min-h-[200px] flex-col">
          <div className="w-fill h-full max-h-[150px] overflow-y-auto rounded-lg border p-2 text-base font-normal">
            {transcript}
          </div>
          <div className="mt-4 flex w-full items-center justify-between text-sm font-normal">
            <p>Cantidad de caratéres: {recognitionFns.transcript.length}</p>
            <IconButton placeholder={""} onClick={transcriptionModal.onOpen}>
              <FaExpandAlt />
            </IconButton>
          </div>
        </div>
        <div className='flex flex-row justify-between mt-4 items-center'>
          <h3 className="text-lg">Fragmentos</h3>
          <p className='text-xs'>Cantidad de fragmentos: {recognitionFns.fragments.length}</p>
        </div>
        <div className="h-full text-sm font-normal">
          <div className="mb-2 h-full flex flex-col  max-h-[400px] gap-2  overflow-y-auto rounded-md border p-2">
            {recognitionFns.fragments.map((fragment, index) => (
              <div key={index} className='w-full text-balance p-2 border '>{fragment}</div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-4">
          <div className="flex w-auto justify-start gap-4">
            {isListening ? (
              <Button
                placeholder={""}
                className="bg-red-500"
                onClick={() => {
                  recognitionFns.onStopListening();
                  setIsListening(false);
                }}
              >
                Detener grabación
              </Button>
            ) : (
              <Button
                placeholder={""}
                className="bg-green-500"
                onClick={() => {
                  recognitionFns.onListening();
                  setIsListening(true);
                }}
              >
                Iniciar grabación
              </Button>
            )}
            {/* {llmFunctions.audioUrl ? (
              <Button
                placeholder=""
                loading={llmFunctions.loadingTranscript}
                onClick={llmFunctions.onTranscribe}
                className='relative'
              >
                Transcribir
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="bg-blue-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                  <span className="bg-blue-500 relative inline-flex h-3 w-3 rounded-full"></span>
                </span>
              </Button>
            ) : null} */}
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              placeholder={""}
              className="bg-gray-200"
              disabled={recognitionFns.transcript ? false : true}
            >
              <IoCopy className="text-blue-500" />
            </IconButton>
            <IconButton
              placeholder={""}
              className="bg-gray-200"
              disabled={recognitionFns.transcript ? false : true}
            >
              <FaTrash className="text-red-500" />
            </IconButton>
            <Button
              placeholder={""}
              disabled={recognitionFns.transcript ? false : true}
            >
              Generar preguntas
            </Button>
          </div>
        </div>
      </div>
      <RecognitionModal
        isOpen={transcriptionModal.isOpen}
        onClose={transcriptionModal.onClose}
        isListening={isListening}
        setListening={setIsListening}
      />
    </div>
  );
}

export default InputRecognition