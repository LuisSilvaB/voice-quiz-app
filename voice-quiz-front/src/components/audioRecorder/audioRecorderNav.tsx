import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaStop, FaTrash, FaDownload } from 'react-icons/fa';


const AudioRecorderNav = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioStream, setAudioStream] = useState<null | MediaStream>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    transcript,
    //interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    if (listening && audioStream) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
      
        requestAnimationFrame(draw);
      
        analyser.getByteFrequencyData(dataArray);
      
        // Establece el color de fondo del canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
        // Calcula el ancho de las barras según la anchura del canvas
        const barWidth = Math.min(2, WIDTH / bufferLength); // Reducido el ancho de las barras
        let x = 0;
      
        dataArray.forEach((item) => {
          const barHeight = item;
      
          // Establece el color de las barras
          ctx.fillStyle = `rgb(${barHeight+10 },120,420)`;
          // Dibuja las barras
          ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
      
          x += barWidth + 1;
        });
      };

      draw();

      return () => {
        audioContext.close();
      };
    }
  }, [listening, audioStream]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setAudioStream(null);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          setAudioStream(stream);
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
          setAudioStream(null);
        });
    }
    setIsListening(!isListening);
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([finalTranscript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
  };

  //Enviar datos al backend
  const submitTranscription = async () => {
    try {
      const formData = new FormData();
      formData.append('session_name', 'Nombre de la sesión'); // Nombre de la sesión
      formData.append('documents', new Blob([finalTranscript], { type: 'text/plain' }), 'transcript.txt'); // Agrega el archivo de transcripción

          // Verifica que el texto obtenido del componente sea el mismo que el texto agregado al formulario
      const textToSend = await finalTranscript.toString()
      console.log('Texto obtenido del componente:', textToSend)

      const response = await fetch('http://localhost:5000/api/docs', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al enviar la transcripción');
      }

      const data = await response.json();
      console.log('Transcripción enviada correctamente:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className='relative box-border flex h-full w-full flex-col items-center justify-center text-black lg:mt-24 lg:flex-col'>
      <h2 className='text-2xl font-bold mb-4'>Speech to Text Converter</h2>
      <textarea className='border border-gray-300 p-2 mb-4 w-full h-40' value={transcript} readOnly />
      {listening && (
        <canvas className='w-full h-32 mb-4' ref={canvasRef}></canvas>
      )}
      <div className='flex items-center mb-4'>
        {listening ? (
          <FaMicrophone className='mr-2 text-blue-500 animate-pulse' />
        ) : (
          <FaMicrophone className='mr-2 text-gray-500' />
        )}
        {isListening && <div className='text-sm text-gray-500'>Listening...</div>}
      </div>
      <div className='flex space-x-4 mb-4'>
        <button className={`px-4 py-2 text-white rounded-md ${listening ? 'bg-red-500' : 'bg-green-500'}`} onClick={toggleListening}>
          {listening ? <FaStop className='inline-block mr-2' /> : <FaMicrophone className='inline-block mr-2' />}
          {listening ? 'Stop' : 'Start'}
        </button>
        <button className='px-4 py-2 text-white bg-gray-500 rounded-md' onClick={resetTranscript} disabled={!transcript}>
          <FaTrash className='inline-block mr-2' />
          Reset
        </button>
        <button className='px-4 py-2 text-white bg-blue-500 rounded-md' onClick={downloadTranscript} disabled={!finalTranscript}>
          <FaDownload className='inline-block mr-2' />
          Download Transcript
        </button>

        {/* Botón para enviar la transcripción al backend */}
        <button className='px-4 py-2 text-white bg-blue-500 rounded-md' onClick={submitTranscription} disabled={!finalTranscript}>
          <FaDownload className='inline-block mr-2' />
          Send Transcript
        </button>

      </div>
      {!browserSupportsSpeechRecognition && (
        <div className='text-red-500 mb-2'>Browser doesn't support speech recognition.</div>
      )}
      {!isMicrophoneAvailable && (
        <div className='text-red-500'>Microphone not available.</div>
      )}
    </div>
  );
};

export default AudioRecorderNav;

