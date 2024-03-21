import { IconButton, Button } from '@material-tailwind/react'
import { useEffect } from 'react'
import { IoCopy } from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa'
import TypeWriter from '../type-writer/type-writer'
import { FaExpandAlt } from "react-icons/fa";
import useLLMHook from '../../../hooks/useLLmHook' 

const TranscriptionInput = () => {
  const llmFunctions = useLLMHook()
  useEffect(()=>{

  },[])

  return (
    <div className="flex h-full w-full max-w-[60%] flex-col">
      <div className="flex h-full w-full flex-col rounded-lg border p-4">
        <h3 className="text-lg">Transcripción</h3>
        <div className="min-h-[200px]">
          <div className="mb-2 h-full max-h-[150px] overflow-y-auto rounded-md border p-2 text-sm font-normal">
            <TypeWriter text={llmFunctions.transcription} speed={10} />
          </div>
          <div className="flex w-full items-center justify-between text-sm font-normal">
            <p>Cantidad de caratéres: {llmFunctions.transcription.length}</p>
            <IconButton placeholder={""}>
              <FaExpandAlt />
            </IconButton>
          </div>
        </div>
        <h3 className="text-lg">Fragmentos</h3>
        <div className="h-full text-sm font-normal">
          <div className="mb-2 h-full max-h-full overflow-y-auto rounded-md border p-2">
            <TypeWriter text={llmFunctions.transcription} speed={10} />
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-4">
          <div className="flex w-auto justify-start gap-4">
            {llmFunctions.loadingRecord ? (
              <Button
                placeholder={""}
                className="bg-red-500"
                onClick={llmFunctions.stopRecording}
              >
                Detener grabación
              </Button>
            ) : (
              <Button
                placeholder={""}
                className="bg-green-500"
                onClick={llmFunctions.record}
              >
                Iniciar grabación
              </Button>
            )}
            {llmFunctions.audioUrl ? (
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
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              placeholder={""}
              className="bg-gray-200"
              disabled={llmFunctions.transcription ? false : true}
            >
              <IoCopy className="text-blue-500" />
            </IconButton>
            <IconButton
              placeholder={""}
              className="bg-gray-200"
              disabled={llmFunctions.transcription ? false : true}
            >
              <FaTrash className="text-red-500" />
            </IconButton>
            <Button
              placeholder={""}
              disabled={llmFunctions.transcription ? false : true}
            >
              Generar preguntas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranscriptionInput