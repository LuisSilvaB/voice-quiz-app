import {useCallback, useEffect, useState} from 'react'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../app/store';
import { createFragment } from '../features/fragments.features';
import { RootState } from '../app/store';
import { Fragment } from '../class/fragments';
import { useParams } from 'react-router-dom'; 
import { v4 } from 'uuid';
import { publicConfig } from '../config/config';

const useRecognition = () => {
  const { resetTranscript, transcript, listening } = useSpeechRecognition()
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [loadingListening, setLoadingListening] = useState<boolean>(false);
  const [processedCharacters, setProcessedCharacters ] = useState<number>(0);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams(); 

  const fragments = useSelector((state:RootState) => state.fragments.fragments)
  const fragmentLoading = useSelector((state:RootState) => state.fragments.fragmentLoading)
  const currentUser = useSelector((state:RootState) => state.users.user)
  const currenSession = useSelector((state:RootState) => state.sessions)

  const onListening = () => {
    try {
        setLoadingListening(true);
        SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => setAudioStream(stream))
        .catch((error) => {
            setAudioStream(null);
            console.error(error);
        })
    } catch (error) {
        console.error(error);
    }
  }
  const onStopListening = () => {
    try {
        setLoadingListening(false);
        SpeechRecognition.stopListening();
        setAudioStream(null);
    } catch (error) {
        console.error(error);
    }
  }
  const onResetTranscription = () => {
    try {
        resetTranscript(); 
    } catch (error) {
        console.error(error);
    }
  
  }
  const onGenerateFragments = useCallback(async () => {
  const fragmentSize: number = currenSession.context ?? 1000;
  
    if (transcript && audioStream && !requestSent) {
      try {
        let newProcessedCharacters: number = processedCharacters;
        if (transcript.length - newProcessedCharacters >= fragmentSize) {
          const fragmentContent = transcript.slice(newProcessedCharacters, newProcessedCharacters + fragmentSize);  
          const formData = new FormData();
          formData.append('documents', new Blob([fragmentContent], { type: 'text/plain' }), 'transcript.txt');  
  
          // Marcar la solicitud como enviada para evitar múltiples envíos
          setRequestSent(true);
  
          const response = await fetch(`${publicConfig.back_v1_local}/api/title/v2`, {
            method: "POST",
            body: formData,   
          });
  
          if (response.ok) {            
            const fragment: Fragment = {
              ID: v4(),
              title: await response.json().then(data => JSON.parse(data.title)) || "", 
              content: fragmentContent,
              USER_ID: currentUser?.ID || "",
              count_questions:0, 
              COURSE_ID: params.courseId as string || "",
              SESSION_ID: params.sessionId as string || "", 
            };
            dispatch(createFragment(fragment));
            newProcessedCharacters += fragmentSize;
            setProcessedCharacters(newProcessedCharacters);
            !fragmentLoading && setRequestSent(false);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Restablecer el estado de la solicitud después de un tiempo para permitir nuevas solicitudes
        // setTimeout(() => {
        // }, 4000); // ajusta este tiempo según sea necesario
      }
    }
  }, [transcript, audioStream, processedCharacters, requestSent, dispatch]);
  
  // Llamar a onGenerateFragments cuando cambie transcript o audioStream
  useEffect(() => {
    onGenerateFragments();
  }, [transcript, audioStream]);
  
  return { loadingListening, audioStream,  transcript , onListening, onStopListening, onResetTranscription, fragments, listening };
}

export default useRecognition