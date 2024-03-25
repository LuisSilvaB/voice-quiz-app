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
  const onGenerateFragments = useCallback(() => {
    const fragmentSize: number = 100;
  
    if (transcript && audioStream) {
      try {
        let newProcessedCharacters: number = processedCharacters;
        while (transcript.length - newProcessedCharacters >= fragmentSize) {
          const fragment: fragmentShape = {
            id: nanoid(),
            content: transcript.slice(newProcessedCharacters, newProcessedCharacters + fragmentSize),
          };
          dispatch(setFragments([...fragments, fragment]))
          newProcessedCharacters += fragmentSize;
        }
        setProcessedCharacters(newProcessedCharacters);
      } catch (error) {
        console.error(error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, audioStream, processedCharacters]);
  
 useEffect(()=>{
  onGenerateFragments();
},[onGenerateFragments])

  return { loadingListening, audioStream,  transcript , onListening, onStopListening, onResetTranscription, fragments };
}

export default useRecognition