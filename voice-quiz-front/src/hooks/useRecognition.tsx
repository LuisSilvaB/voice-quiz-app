import {useCallback, useEffect, useState} from 'react'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../app/store';
import { setFragments } from '../features/fragments.features';
import { RootState } from '../app/store';
import { fragmentShape } from '../interface/types';
import { nanoid } from '@reduxjs/toolkit';

const useRecognition = () => {
  const [loadingListening, setLoadingListening] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [processedCharacters, setProcessedCharacters ] = useState<number>(0);
  const { resetTranscript, transcript } = useSpeechRecognition()
  const [requestSent, setRequestSent] = useState<boolean>(false);
  
  const dispatch = useDispatch<AppDispatch>()
  const fragments = useSelector((state:RootState) => state.fragments.fragments)

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
    const fragmentSize: number = 100;
  
    if (transcript && audioStream && !requestSent) {
      try {
        let newProcessedCharacters: number = processedCharacters;
        if (transcript.length - newProcessedCharacters >= fragmentSize) {
          const fragmentContent = transcript.slice(newProcessedCharacters, newProcessedCharacters + fragmentSize);  
          const formData = new FormData();
          formData.append('documents', new Blob([fragmentContent], { type: 'text/plain' }), 'transcript.txt');  
  
          // Marcar la solicitud como enviada para evitar múltiples envíos
          setRequestSent(true);
  
          const response = await fetch("http://127.0.0.1:8000/api/title", {
            method: "POST",
            body: formData,   
          });
  
          if (response.ok) {            
            const fragment: fragmentShape = {
              id: nanoid(),
              title: await response.json().then(data => JSON.parse(data.title)) || "", 
              content: fragmentContent,
            };
            dispatch(setFragments([...fragments, fragment]));
            newProcessedCharacters += fragmentSize;
            setProcessedCharacters(newProcessedCharacters);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Restablecer el estado de la solicitud después de un tiempo para permitir nuevas solicitudes
        setTimeout(() => {
          setRequestSent(false);
        }, 1000); // ajusta este tiempo según sea necesario
      }
    }
  }, [transcript, audioStream, processedCharacters, requestSent, dispatch]);
  
  // Llamar a onGenerateFragments cuando cambie transcript o audioStream
  useEffect(() => {
    onGenerateFragments();
  }, [transcript, audioStream]);
  
  return { loadingListening, audioStream,  transcript , onListening, onStopListening, onResetTranscription, fragments };
}

export default useRecognition