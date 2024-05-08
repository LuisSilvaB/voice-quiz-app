import { useCallback, useEffect, useState } from 'react';
import { IconButton, Button, Chip } from '@material-tailwind/react'
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
import { FaQuestionCircle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import cx from '../../../../libs/cx';

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



  const getCurrenTranscript = useCallback(()=>{
    if (currentSession) {
      setCurrentTranscript(currentSession.transcription ?? "");
    }    
  },[currentSession])

  useEffect(()=>{
    getCurrenTranscript(); 
  },[getCurrenTranscript])
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    const onChangeTranscript = () => {
      if (recognitionFns.loadingListening) {        
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
      }
    
    }
    onChangeTranscript();
  
    return () => clearTimeout(timeoutId);
  }, [recognitionFns.transcript, isRecording]);


  useEffect(() => {
    
    if (!isRecording) {
      console.log("ejecutandome")
      // const transcription = currentTranscript.substring(0, currentCharacteres - 1);
      dispatch(
        updateSession({
          ...currentSession, 
          transcription: currentSession.transcription + recognitionFns.transcript ,
        })
      )
    }

  }, [isRecording]);

  useEffect(()=>{
    getCourseQuerie()
    getSessionQuerie()
    return () => {
      dispatch(clearSessionData());
      dispatch(clearTargetFragment());
      dispatch(clearFragments());
    }
  }, [])


  return (
    <div className="flex h-full w-full max-w-[60%] flex-col">
      <div className="flex h-full w-full flex-col rounded-lg border border-gray-400 p-4">
        <h3 className="text-lg font-medium text-gray-700">TRANSCRIPCIÓN</h3>
        <div className="flex min-h-[200px] flex-col">
          <div className="w-fill h-full max-h-[150px] overflow-y-auto rounded-lg border border-gray-400 p-2 text-base font-normal">
            {currentTranscript}
          </div>
          <div className="mt-4 flex w-full items-center justify-between text-sm font-normal text-gray-600">
            <p>Cantidad de caratéres: {currentTranscript.length}</p>
            <IconButton placeholder={""} onClick={transcriptionModal.onOpen}>
              <FaExpandAlt />
            </IconButton>
          </div>
        </div>
        {targetFrament.ID ? (
          <div className="border-gray- mt-2 flex h-full w-full flex-col rounded-lg border bg-white p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Chip
                  value="Fragment: "
                  className="w-fit"
                  variant="outlined"
                  size="sm"
                />
                <Chip
                  value={targetFrament.ID}
                  className="w-fit"
                  variant="ghost"
                  size="sm"
                  color="deep-purple"
                />
              </div>
              <div className="flex gap-2">
                <IconButton placeholder={""} className="bg-green-500">
                  {loading ? (
                    <CgSpinner className={cx(loading ? "animate-spin" : "")} />
                  ) : (
                    <FaQuestionCircle />
                  )}
                </IconButton>

                <IconButton
                  placeholder={""}
                  className="bg-red-500"
                  onClick={handleClearTargetFragment}
                >
                  <CgClose />
                </IconButton>
              </div>
            </div>

            <div className="h-fit w-fit mt-2 flex flex-col gap-2">
              <Chip
                value="Título "
                className="w-fit"
                variant="ghost"
                size="sm"
              />

              <p className="text-sm">{targetFrament.title} </p>
            </div>

            <div className="h-fit w-fit mt-2 flex flex-col gap-2">
              <Chip
                value="Contenido del fragmento "
                className="w-fit"
                variant="ghost"
                size="sm"
              />
              <p className="mb-2 mt-1 max-h-10 overflow-hidden truncate text-clip text-wrap text-sm font-normal">
                {targetFrament.content}
              </p>
            </div>
            <div className="mt-4 flex w-full gap-4">
              <Button
                placeholder={""}
                color="pink"
                variant="outlined"
                onClick={() =>
                  dispatch(
                    createQuestions({
                      fragment: targetFrament,
                      kindquestion: "multiple_answer",
                    }),
                  )
                }
              >
                Preguntas múltiples
              </Button>
              <Button
                placeholder={""}
                variant="outlined"
                color="green"
                onClick={() =>
                  dispatch(
                    createQuestions({
                      fragment: targetFrament,
                      kindquestion: "open_answer",
                    }),
                  )
                }
              >
                Pregunta abierta
              </Button>
              <Button
                placeholder={""}
                variant="outlined"
                color="gray"
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

            {targetFrament.content.length}
          </div>
        ) : (
          <div className="flex h-full w-auto flex-col">
            <div className="mt-4 flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">FRAGMENTOS</h3>
              <p className="text-sm font-normal text-gray-600">
                Cantidad de fragmentos: {recognitionFns.fragments.length}
              </p>
            </div>
            <div className="mb-2 flex h-full max-h-[400px]  w-full flex-row  flex-wrap justify-around gap-4 overflow-y-auto rounded-md  border p-2 pt-10 text-sm text-gray-600">
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