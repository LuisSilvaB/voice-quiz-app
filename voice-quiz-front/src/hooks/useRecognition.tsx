import {useCallback, useEffect, useState} from 'react'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

const useRecognition = () => {
  const [loadingListening, setLoadingListening] = useState<boolean>(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [fragments, setFragments] = useState<string[]>([])
  const [processedCharacters, setProcessedCharacters ] = useState<number>(0);
  const { resetTranscript, transcript } = useSpeechRecognition()
  
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
          const fragment: string = transcript.slice(newProcessedCharacters, newProcessedCharacters + fragmentSize);
          setFragments((prevFragments: string[]) => [...prevFragments, fragment]);
          newProcessedCharacters += fragmentSize;
          console.log('Fragmento:', fragment);
        }
        setProcessedCharacters(newProcessedCharacters);
      } catch (error) {
        console.error(error);
      }
    }
  }, [transcript, audioStream, processedCharacters]);
  

 useEffect(()=>{
  onGenerateFragments();
},[onGenerateFragments])

  return { loadingListening, audioStream,  transcript , onListening, onStopListening, onResetTranscription, fragments };
}

export default useRecognition