import { useState } from 'react';
import useLLM from 'usellm';

const useLLMHook = () => {
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  // const [error, setError] = useState(null);
  const llm = useLLM({ serviceUrl: 'https://usellm.org/api/llm' });

  const record = async () => {
    setLoadingRecord(true);
    try {
      await llm.record();
    } catch (e) {
      console.error(e);
    } 
  };

  const stopRecording = async () => {
    try {
      setLoadingRecord(false);
      const { audioUrl } = await llm.stopRecording();
      setAudioUrl(audioUrl ?? '')
    } catch (error) {
      console.error(error);
      return '';
    }
  };

  const onTranscribe = async () => {
    setLoadingTranscript(true);
    try {
      const { text } = await llm.transcribe({ audioUrl });
      setAudioUrl('');
      setLoadingTranscript(false);
      return setTranscription(text);
    } catch (error) {
      console.error(error);
      return ''; 
    }
  };


  return { loadingTranscript, loadingRecord, record, stopRecording, onTranscribe, transcription, audioUrl };
};

export default useLLMHook;
