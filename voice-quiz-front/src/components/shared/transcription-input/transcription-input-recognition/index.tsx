import { useState } from 'react';
import { IconButton, Button } from '@material-tailwind/react'
import { FaExpandAlt } from "react-icons/fa";
import useRecognition from '../../../../hooks/useRecognition'
import { useSpeechRecognition } from 'react-speech-recognition'
import { FaMicrophoneAlt } from 'react-icons/fa';
import RecognitionModal from './recognition-modal';
import useToggle from '../../../../hooks/useToggle';
import FragmentsCard from './fragments-card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import { clearTargetFragment } from '../../../../features/fragments.features';
import { CgClose } from 'react-icons/cg';
import { fragmentShape } from '../../../../interface/types';
import { submitFragment } from '../../../../features/fragments.features';

const InputRecognition = () => {
  const recognitionFns = useRecognition();  
  const transcriptionModal = useToggle(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const  { transcript }  = useSpeechRecognition()
  const dispatch = useDispatch<AppDispatch>()
  
  const targetFrament = useSelector((state:RootState) => state.fragments.targetFragment)
  const fragments = useSelector((state:RootState)=> state.fragments.fragments)
  const loading = useSelector((state:RootState) => state.fragments.loading)

  const handleClearTargetFragment = () => {
    dispatch(clearTargetFragment())
  }

  
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
        {targetFrament.id ? (
          <div className="mt-2 flex h-full w-full flex-col rounded-lg border p-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-lg font-semibold">
                Fragment: {targetFrament.id}
              </p>
              <IconButton
                placeholder={""}
                className="bg-red-500"
                onClick={handleClearTargetFragment}
              >
                <CgClose />
              </IconButton>
            </div>
            {loading ? (
              <div className='animate-pulse w-full h-6 my-2 rounded-2xl bg-gray-300' />
            ) : (
              <div className='w-fit h-fit'>
                {targetFrament.title ? <p className='text-sm'> Title: {targetFrament.title}  </p> : null}
              </div>
            )}
            <p className="mt-1 text-sm font-normal max-h-10 mb-2 text-clip text-wrap truncate overflow-hidden">{targetFrament.content}</p>
            <div className="mt-4 flex w-full gap-4">
              <Button
                placeholder={""}
                onClick={() =>
                  dispatch(
                    submitFragment({
                      fragment: targetFrament,
                      kindquestion: "alternatives",
                    }),
                  )
                }
                loading = {loading}
              >
                Alternativas
              </Button>
              <Button placeholder={""}>Pregunta y respuesta</Button>
              <Button placeholder={""}>Respuesta multiple</Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-auto flex-col">
            <div className="mt-4 flex flex-row items-center justify-between">
              <h3 className="text-lg">Fragmentos</h3>
              <p className="text-xs">
                Cantidad de fragmentos: {recognitionFns.fragments.length}
              </p>
            </div>
            <div className="mb-2 flex h-full max-h-[400px]  w-full flex-row  flex-wrap justify-around gap-4 overflow-y-auto rounded-md  border p-2 pt-10 text-sm">
              {fragments.map((fragment: fragmentShape, index: number) => (
                <FragmentsCard
                  key={index}
                  fragment={fragment}
                  position={index}
                />
              ))}
            </div>
          </div>
        )}
        <div className="mt-2 flex w-full items-center justify-between gap-4">
          <div className="flex w-auto justify-start gap-4">
            {isListening ? (
              <Button
                placeholder={""}
                className="flex items-center gap-3 bg-red-500"
                onClick={() => {
                  recognitionFns.onStopListening();
                  setIsListening(false);
                }}
              >
                <p>Detener grabación</p>
                <FaMicrophoneAlt />
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