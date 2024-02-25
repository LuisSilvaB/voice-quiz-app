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

  return (
    <div className='container mx-auto p-4 bg-white shadow-md rounded-md'>
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



/*
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaStop, FaTrash, FaDownload } from 'react-icons/fa';

const AudioRecorderNav = () => {
  const [isListening, setIsListening] = useState(false);
  const {
    transcript,
    //interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
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

  return (
    <div className='container mx-auto p-4 bg-white shadow-md rounded-md'>
      <h2 className='text-2xl font-bold mb-4'>Speech to Text Converter</h2>
      <textarea className='border border-gray-300 p-2 mb-4 w-full h-40' value={transcript} readOnly />
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

*/



/*
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AudioRecorderNav = () => {
  const [isListening, setIsListening] = useState(false);
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
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

  return (
    <div className='text-black'>
      <h2>Speech to Text converter</h2>
      <br />
      <textarea className='border border-gray-300 p-2 mb-4 w-full h-40' value={transcript} readOnly />
      <br />
      <div>Interim Transcript: {interimTranscript}</div>
      <div>Final Transcript: {finalTranscript}</div>
      <br />
      <button onClick={toggleListening}>{listening ? 'Stop' : 'Start'}</button>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={downloadTranscript}>Download Transcript</button>
      <div>Browser supports speech recognition: {browserSupportsSpeechRecognition.toString()}</div>
      <div>Microphone available: {isMicrophoneAvailable.toString()}</div>
    </div>
  );
};

export default AudioRecorderNav;*/




/*
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AudioRecorderNav = () => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    }
    setIsListening(!isListening);
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <h2>Speech to Text converter</h2>
      <br />
      <textarea className='border border-gray-300 p-2 mb-4 w-full h-40 ' value={transcript} readOnly />
      <br />
      <button onClick={toggleListening}>{isListening ? 'Stop' : 'Start'}</button>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={downloadTranscript}>Download Transcript</button>
    </div>
  );
};

export default AudioRecorderNav;
*/





/*
import React from 'react'
import SpeechRecognition, {useSpeechRecognition as speechRecorder} from 'react-speech-recognition'

const audioRecorderNav = () => {
  const startListening = () => {SpeechRecognition.startListening({continuous: true, language: 'es-ES'})}
  const {transcript, browserSupportsSpeechRecognition} = speechRecorder()

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  return (
    <>
      <div className='text-black'>
        <h2>Speech to text converter</h2>
        <br/>
        <div className='text-black'>{transcript}</div>
        <br/>
        <button>copy</button>
        <button onClick={startListening}>Start</button>
       <button onClick={SpeechRecognition.stopListening}>Stop</button> 

        
      </div>

    </>

  )
}

export default audioRecorderNav*/