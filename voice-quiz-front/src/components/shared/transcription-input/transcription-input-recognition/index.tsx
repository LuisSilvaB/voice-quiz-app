import { useCallback, useEffect, useState } from 'react';
import { IconButton, Button } from '@material-tailwind/react'
import { FaExpandAlt } from "react-icons/fa";
import useRecognition from '../../../../hooks/useRecognition'
import { FaMicrophoneAlt } from 'react-icons/fa';
import RecognitionModal from './recognition-modal';
import useToggle from '../../../../hooks/useToggle';
import FragmentsCard from './fragments-card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../app/store';
import { clearFragments, clearTargetFragment, getFragments } from '../../../../features/fragments.features';
import { CgClose } from 'react-icons/cg';
import { createQuestions } from '../../../../features/fragments.features';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../../../features/db-features/courses.features';
import { clearSessionData, getSession, updateSession } from '../../../../features/db-features/sessions.features';
import { Fragment } from '../../../../class/fragments';

const InputRecognition = () => {
  const recognitionFns = useRecognition();  
  const transcriptionModal = useToggle(false);
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams(); 

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [currentTranscript, setCurrentTranscript] = useState<string>("")
  const [processedCharacters, setProcessedCharacters] = useState<number>(0);
  
  const targetFrament = useSelector((state:RootState) => state.fragments.targetFragment)
  const fragments = useSelector((state:RootState)=> state.fragments.fragments)
  const loading = useSelector((state:RootState) => state.fragments.loading)
  const currentUser = useSelector((state:RootState) => state.users.user)
  const curretCourse = useSelector((state:RootState) => state.courses.course)
  const currentSession = useSelector((state:RootState) => state.sessions.session)


  const handleClearTargetFragment = () => {
    dispatch(clearTargetFragment())
  }

  const getCourseQuerie = useCallback(()=>{
    dispatch(
      getCourse({ userId: currentUser?.ID ?? "", courseId: params.courseId as string ?? '' }),
    );
  },[params.courseId])

  const getSessionQuerie = useCallback(()=>{
    dispatch(getSession({
      sessionId: params.sessionId as string ?? '',
      userId: currentUser?.ID ?? ''
    }))
    dispatch(getFragments(params.sessionId as string ?? ""))
  },[params.sessionId])

  useEffect(()=> {
    getCourseQuerie()
    getSessionQuerie()
  },[params.courseId])

  useEffect(()=>{
    if (currentSession) {
      setCurrentTranscript(currentSession.transcription ?? "");
    }
  },[currentSession])
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    const onChangeTranscript = () => {
      setIsRecording(true);
      const charactersTranscript = recognitionFns.transcript.length;

      if (processedCharacters < charactersTranscript) {
        const newTranscriptEntrie = recognitionFns.transcript.substring(processedCharacters, charactersTranscript);
        setCurrentTranscript(prev => prev + newTranscriptEntrie);
        setProcessedCharacters(charactersTranscript);
      }
  
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsRecording(false);
      }, 5000);
    };
  
    onChangeTranscript();
  
    return () => clearTimeout(timeoutId);
  }, [recognitionFns.transcript, processedCharacters]);

  useEffect(() => {
    if (!isRecording) {
      const currentCharacteres = currentTranscript.length;
      const transcription = currentTranscript.substring(0, currentCharacteres - 1);
      dispatch(
        updateSession({
          ...currentSession, 
          transcription: currentSession.transcription + transcription,
        })
      )
    }
  }, [isRecording]);

  useEffect(()=>{
    return () => {
      dispatch(clearSessionData());
      dispatch(clearTargetFragment());
      dispatch(clearFragments());
    }
  }, [])


  return (
    <div className="flex h-full w-full max-w-[60%] flex-col">
      <div className="flex h-full w-full flex-col rounded-lg border p-4">
        <h3 className="text-lg">Transcripción</h3>
        <div className="flex min-h-[200px] flex-col">
          <div className="w-fill h-full max-h-[150px] overflow-y-auto rounded-lg border p-2 text-base font-normal">
            {currentTranscript}
          </div>
          <div className="mt-4 flex w-full items-center justify-between text-sm font-normal">
            <p>Cantidad de caratéres: {recognitionFns.transcript.length}</p>
            <IconButton
              placeholder={""}
              onClick={transcriptionModal.onOpen}
            >
              <FaExpandAlt />
            </IconButton>
          </div>
        </div>
        {targetFrament.ID ? (
          <div className="mt-2 flex h-full w-full flex-col rounded-lg border p-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-lg font-semibold">
                Fragment: {targetFrament.ID}
              </p>
              <IconButton
                placeholder={""}
                className="bg-red-500"
                onClick={handleClearTargetFragment}
              >
                <CgClose />
              </IconButton>
            </div>
  
              <div className="h-fit w-fit">
                  <p className="text-sm"> Title: {targetFrament.title} </p>
              </div>
        
            <p className="mb-2 mt-1 max-h-10 overflow-hidden truncate text-clip text-wrap text-sm font-normal">
              {targetFrament.content}
            </p>
            <div className="mt-4 flex w-full gap-4">
              <Button
                placeholder={""}
                onClick={() =>
                  dispatch(
                    createQuestions({
                      fragment: targetFrament,
                      kindquestion: "multiple_answer",
                    }),
                  )
                }
                loading={loading}
              >
                Alternativas
              </Button>
              <Button
                placeholder={""}
                onClick={() =>
                  dispatch(
                    createQuestions({
                      fragment: targetFrament,
                      kindquestion: "open_answer",
                    }),
                  )
                }
              >
                Pregunta y respuesta
              </Button>
              <Button
                placeholder={""}
                onClick={() =>
                  dispatch(
                    createQuestions({
                      fragment: targetFrament,
                      kindquestion: "true_or_false",
                    }),
                  )
                }
              >
                Verdadero o falso
              </Button>
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
              {fragments.map((fragment: Fragment, index: number) => (
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
        currentTranscript={currentTranscript}
      />
    </div>
  );
}

export default InputRecognition