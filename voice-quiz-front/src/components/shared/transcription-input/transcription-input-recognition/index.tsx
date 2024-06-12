import { useCallback, useEffect, useState } from 'react';
import { IconButton, Button, Chip } from '@material-tailwind/react'
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
import { clearSessionData, getSession, updateSession, setContext } from '../../../../features/db-features/sessions.features';
import { Fragment } from '../../../../class/fragments';
import { CiCreditCardOff } from "react-icons/ci";


const InputRecognition = () => {
  const recognitionFns = useRecognition();  
  const transcriptionModal = useToggle(false);
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams(); 

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
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

  const onSetContext = (context: number) => {
    switch (context) {
      case 100:
        dispatch(setContext(500))
        break;
      case 500:
        dispatch(setContext(2500))
        break;
      case 1000:
        dispatch(setContext(5000))
        break;
      case 2000:
        dispatch(setContext(10000))
        break;
      case 3000:
        dispatch(setContext(15000))
        break;
      case 4000:
        dispatch(setContext(20000))
        break;
      default:
      break;
    }
  }

  const getCurrenTranscript = useCallback(()=>{
    if (currentSession && currentSession.transcription?.length) {
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
        clearTimeout(timeoutId);
        const charactersTranscript = recognitionFns.transcript.length;
  
        if (processedCharacters < charactersTranscript) {
          const newTranscriptEntrie = recognitionFns.transcript.substring(processedCharacters, charactersTranscript);
          setCurrentTranscript(prev => prev + newTranscriptEntrie);
          setProcessedCharacters(charactersTranscript);
        }
    
        timeoutId = setTimeout(() => {
          dispatch(
            updateSession({
              ...currentSession, 
              transcription: currentSession.transcription + recognitionFns.transcript,
            })
          )        
          setIsRecording(false);
          clearTimeout(timeoutId);
        }, 2000);
      }
    
    }
    onChangeTranscript();
  
    return () => clearTimeout(timeoutId);
  }, [recognitionFns.transcript]);

  // useEffect(() => {

  //   if (!isRecording) {
  //     // const transcription = currentTranscript.substring(0, currentCharacteres - 1);
  //     console.log('enviando')
  //     dispatch(
  //       updateSession({
  //         ...currentSession, 
  //         transcription: currentSession.transcription + recognitionFns.transcript,
  //       })
  //     )
  //   }

  // }, [isRecording]);

  useEffect(()=>{
    getCourseQuerie()
    getSessionQuerie()
    return () => {
      dispatch(clearSessionData());
      dispatch(clearTargetFragment());
      dispatch(clearFragments());
      recognitionFns.onStopListening();
      recognitionFns.onResetTranscription();
    }
  }, [])


  return (
    <div className="box-border flex h-full w-full max-w-[60%] flex-col ">
      <div className="flex h-full w-full flex-col rounded-md bg-white p-4 shadow-md">
        {/* <h3 className="text-base font-medium font-inter text-black border-b">TRANSCRIPCIÓN</h3> */}
        <div className="flex h-fit flex-col">
          {/* <div className="w-fill h-full max-h-[150px] overflow-y-auto rounded-lg text-gray-600 bg-white p-2 text-xs font-normal border-b">
            {!currentTranscript.length ? (
              <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 text-gray-600">
                <VscEmptyWindow className="h-auto w-10" />
                <p className="font-medium">No hay transcripción</p>
              </div>
            ) : (
              currentTranscript
            )}
          </div> */}
          <div className=" flex w-full flex-wrap items-center justify-between text-sm font-normal text-gray-600">
            <div className=" flex w-fit flex-wrap items-center justify-between text-sm font-normal text-gray-600">
              <p>Contexto</p>
              <select
                className="outline-none"
                onChange={(e) => onSetContext(Number(e.target.value))}
              >
                <option value={100}>100 palabras</option>
                <option value={500}>500 palabras</option>
                <option value={1000}>1000 palabras</option>
                <option value={2000}>2000 palabras</option>
                <option value={3000}>3000 palabras</option>
                <option value={4000}>4000 palabras</option>
              </select>
            </div>
            <div className="flex w-fit items-center gap-2 ">
              <Button
                placeholder={""}
                onClick={transcriptionModal.onOpen}
                className="flex flex-row items-center gap-2 border text-xs"
                size="sm"
                variant="text"
              >
                {isRecording ? (
                  <p className="animate-pulse">Transcribiendo ...</p>
                ) : (
                  <p>Ver transcripción</p>
                )}
              </Button>
              {isListening ? (
                <div className="relative">
                  <Button
                    placeholder={""}
                    size="sm"
                    className="flex items-center gap-3 bg-red-500"
                    disabled={isRecording ? true : false}
                    onClick={() => {
                      recognitionFns.onStopListening();
                      setIsListening(false);
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
                    setIsListening(true);
                  }}
                >
                  Iniciar grabación
                </Button>
              )}
            </div>
          </div>
        </div>
        {targetFrament.ID ? (
          <div className="border-gray- text0-xs mt-2 flex h-full w-full flex-col rounded-lg border bg-white p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Chip
                  value="Fragmento: "
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
                <IconButton
                  placeholder={""}
                  className="bg-red-500"
                  onClick={handleClearTargetFragment}
                >
                  <CgClose />
                </IconButton>
              </div>
            </div>

            <div className="mt-2 flex h-fit w-fit flex-col gap-2">
              <Chip
                value="Título "
                className="w-fit"
                variant="ghost"
                size="sm"
              />

              <p className="text-xs">{targetFrament.title} </p>
            </div>

            <div className="mt-2 flex h-fit w-fit flex-col gap-2">
              <Chip
                value="Contenido del fragmento "
                className="w-fit"
                variant="ghost"
                size="sm"
              />
              <p className="mb-2 mt-1 max-h-[70%] overflow-hidden truncate text-clip text-wrap text-xs font-normal">
                {targetFrament.content}
              </p>
            </div>
            <div className="mt-4 flex w-full gap-4">
              <Button
                placeholder={""}
                color="pink"
                size="sm"
                variant="text"
                className="border"
                onClick={() =>
                  dispatch(
                    createQuestions({
                      fragment: targetFrament,
                      kindquestion: "multiple_answer",
                    }),
                  )
                }
              >
                Alternativas
              </Button>
              <Button
                placeholder={""}
                variant="text"
                className="border"
                size="sm"
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
                variant="text"
                className="border"
                color="blue-gray"
                size="sm"
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
            <div className="w-full p-3">
              {loading ? (
                <p className="gap-2 text-sm animate-pulse text-gray-600">Generando preguntas ...</p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="box-border flex h-full w-auto flex-col">
            <div className="mt-4 flex flex-row items-center justify-between border-b">
              <h3 className="text-base font-medium text-black">FRAGMENTOS</h3>
              <p className="text-xs font-normal text-gray-600">
                Cantidad de fragmentos: {recognitionFns.fragments.length}
              </p>
            </div>
            <div className="flex max-h-[calc(100%-70px)] flex-1 flex-row flex-wrap justify-around gap-4 overflow-y-auto rounded-md border  border-gray-200  p-2  text-sm text-gray-600">
              {!fragments.length ? (
                <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 text-gray-600">
                  <CiCreditCardOff className="h-auto w-20" />
                  <p className="font-medium">No hay fragmentos</p>
                </div>
              ) : (
                fragments.map((fragment: Fragment, index: number) => (
                  <FragmentsCard
                    key={index}
                    fragment={fragment}
                    position={index}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <RecognitionModal
        isOpen={transcriptionModal.isOpen}
        onClose={transcriptionModal.onClose}
        isListening={isListening}
        setListening={setIsListening}
        isRecording={isRecording}
        currentTranscript={currentTranscript}
      />
    </div>
  );
}

export default InputRecognition