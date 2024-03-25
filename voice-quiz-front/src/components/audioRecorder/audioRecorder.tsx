

import { useState } from 'react';
import useLLM from 'usellm';
import { FaMicrophoneAlt } from 'react-icons/fa';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');

  const llm = useLLM({ serviceUrl: 'https://usellm.org/api/llm' });

  const startRecording = async () => {
    await llm.record();
    setStatus('Recording...');
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const { audioUrl } = await llm.stopRecording();
    setAudioUrl(audioUrl);
    setStatus('');
    setIsRecording(false);
  };

  const transcribe = async () => {
    setStatus('Transcribing...');
    const { text } = await llm.transcribe({ audioUrl});
    setTranscript(text);
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center justify-center text-black">
      <h1 className="text-2xl font-bold mb-4">Grabación y Transcripción de Audio</h1>
      {!isRecording ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startRecording}
        >
          Iniciar Grabación
        </button>
      ) : (
        <>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={stopRecording}
          >
            <p>Detener Grabación</p>
            <FaMicrophoneAlt />

          </button>
          <div className="mt-4">
            <FaMicrophoneAlt className="text-6xl animate-pulse" />
          </div>
        </>
      )}
      {audioUrl && !isRecording && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Audio Grabado:</h2>
          <audio src={audioUrl} controls className="mb-4" />
          <button
            className="bg-green-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
            onClick={transcribe}
          >
            Transcribir Audio
          </button>
        </div>
      )}
      {status && <p className="mt-2">{status}</p>}
      {transcript && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Transcripción:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  )
}

export default AudioRecorder;
