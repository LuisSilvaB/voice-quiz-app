import { useState } from 'react';
import useLLM from 'usellm';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { Button } from '@material-tailwind/react';
import cx from '../../../../libs/cx';
import TranscriptionInput from '../../../../components/shared/transcription-input';

const TranscriptionRecord = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTrasncribe, setIsTranscribe] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');

  const llm = useLLM({ serviceUrl: 'https://usellm.org/api/llm' });

  const startRecording = async () => {
    await llm.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const { audioUrl } = await llm.stopRecording();
    setAudioUrl(audioUrl);
    setIsRecording(false);
  };

  const transcribe = async () => {
    setIsTranscribe(true);
    const { text } = await llm.transcribe({ audioUrl });
    setTranscript(text);
    setIsTranscribe(false);
  };

  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-4 text-black">
      <div className="flex h-full w-[400px]  flex-col items-center justify-center gap-3 rounded-xl border">
        <div
          className={cx(
            "flex h-52 w-52 cursor-pointer items-center justify-center rounded-full border bg-gradient-to-r from-cyan-300 to-blue-500",
            isRecording && "animate-pulse",
          )}
        >
          <FaMicrophoneAlt className="h-20 w-20 text-white" />
        </div>
        {isRecording ? (
          <Button
            placeholder={""}
            className="h-10 w-44 bg-red-500 p-0 text-white"
            onClick={stopRecording}
          >
            <p className="font-inter text-[11px] font-bold">
              Detener grabación
            </p>
          </Button>
        ) : (
          <Button
            placeholder={""}
            className="h-10 w-44 bg-green-500 p-0 text-sm text-white"
            onClick={startRecording}
          >
            <p className="font-inter text-[11px] font-bold">
              Iniciar grabación
            </p>
          </Button>
        )}
        {audioUrl ? (
          <div className="mt-8 flex flex-col items-center justify-center">
            <h2 className="mb-2 text-xl font-bold">Audio Grabado:</h2>
            <audio src={audioUrl} controls className="mb-4" />
            <Button
              placeholder={""}
              className="h-auto w-auto  bg-green-500 text-sm text-white"
              onClick={transcribe}
              loading={isTrasncribe}
            >
              <p className="font-inter text-[11px] font-bold">
                Transcribir Audio
              </p>
            </Button>
          </div>
        ) : null}
      </div>
      <div className="flex h-full w-full flex-col gap-4 rounded-xl border p-4 text-2xl font-semibold">
        <TranscriptionInput transcript={transcript} />
        <h3>Generación de preguntas</h3>
        <div className="h-full min-h-max w-full rounded-lg border"></div>
      </div>
    </div>
  );
}

export default TranscriptionRecord;
