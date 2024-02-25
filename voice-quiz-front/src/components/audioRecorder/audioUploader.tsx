import React, { useState } from 'react';
import useLLM from 'usellm';

const AudioUploader: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');

  const llm = useLLM({ serviceUrl: 'https://usellm.org/api/llm' });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
    }
  };

  const transcribe = async () => {
    if (!audioFile) {
      setStatus('Error: No se ha seleccionado ningún archivo de audio.');
      return;
    }

    setStatus('Transcribiendo...');
    try {
      const { text } = await llm.transcribe({ audioFile });
      setTranscript(text);
      setStatus('');
    } catch (error) {
      setStatus(`Error al transcribir el audio: ${error.message}, El error "audioUrl is required" indica que el campo audioUrl es obligatorio en la solicitud de transcripción, pero en tu componente AudioUploader, estás pasando un objeto audioFile en lugar de una URL de audio. Este es un error común cuando se trabaja con diferentes APIs o servicios.

      Para solucionar este problema, debes asegurarte de que estás pasando el tipo correcto de datos al servicio de transcripción. En lugar de pasar un objeto audioFile, necesitas enviar una URL de audio al servicio. Para hacer esto, primero debes cargar el archivo de audio al servidor y obtener una URL pública accesible para ese archivo. Luego, puedes usar esa URL para iniciar la transcripción.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-black">
      <h1 className="text-2xl font-bold mb-4">Transcripción de Archivo de Audio</h1>
      <input
        type="file"
        accept="audio/*"
        className="mb-4"
        onChange={handleFileChange}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={transcribe}
        disabled={!audioFile}
      >
        Transcribir Audio
      </button>
      {status && <p className="mt-2">{status}</p>}
      {transcript && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Transcripción:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
