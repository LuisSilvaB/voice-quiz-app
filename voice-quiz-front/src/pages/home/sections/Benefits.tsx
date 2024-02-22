import { CiMicrophoneOn } from "react-icons/ci";
import { CiCircleQuestion } from "react-icons/ci";
import { CgTranscript } from "react-icons/cg";
import { MdOutlineTouchApp } from "react-icons/md";

const Benefits = () => {
  return (
    <div className="mt-32 h-[40vh] w-full bg-[#f3f7f8]">
      <div className='flex flex-row gap-10 justify-center items-center w-full h-full'>        
        <div className='bg-white flex h-48 justify-center flex-col p-4 gap-3 rounded-lg w-[20%] shadow-lg hover:scale-105 transition-all'>
          <div className="w-10 h-10 bg-black text-white flex justify-center items-center text-2xl rounded-full">
            <CiMicrophoneOn />
          </div>
          <p className="text-lg font-semibold h-6">Grabación de voz</p>
          <p className="text-sm h-16">Permite a los usuarios capturar audio a través de un micrófono.</p>
        </div>
        <div className="bg-white flex h-48 justify-center flex-col p-4 gap-3 rounded-lg w-[20%] shadow-lg hover:scale-105 transition-all">
          <div className="w-10 h-10 bg-black text-white flex justify-center items-center text-2xl rounded-full">
            <CiCircleQuestion />
          </div>
          <p className="text-lg font-semibold h-6">Generación automática de preguntas</p>
          <p className="text-sm h-16">Utiliza inteligencia artificial para crear preguntas automáticamente basadas en ciertos criterios o contenido.</p>
        </div>
        <div className="bg-white flex h-48 justify-center flex-col p-4 gap-3 rounded-lg w-[20%] shadow-lg hover:scale-105 transition-all">
          <div className="w-10 h-10 bg-black text-white flex justify-center items-center text-2xl rounded-full">
            <CgTranscript />
          </div>
          <p className="text-lg font-semibold h-6">Transcripción de audio</p>
          <p className="text-sm h-16">Convierte el contenido de audio en texto escrito, facilitando su comprensión y accesibilidad.</p>
        </div>
        <div className="bg-white flex h-48 justify-center flex-col p-4 gap-3 rounded-lg w-[20%] shadow-lg hover:scale-105 transition-all">
          <div className="w-10 h-10 bg-black text-white flex justify-center items-center text-2xl rounded-full">
            <MdOutlineTouchApp />
          </div>
          <p className="text-lg font-semibold h-6">Interfaz de usuario</p>
          <p className="text-sm h-16">Es la parte de la aplicación o sistema con la que interactúan los usuarios, incluyendo elementos visuales y de interacción.</p>
        </div>
      </div>
    </div>
  );
}

export default Benefits