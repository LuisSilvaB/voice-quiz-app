import { CiMicrophoneOn } from "react-icons/ci";
import { CiCircleQuestion } from "react-icons/ci";
import { CgTranscript } from "react-icons/cg";
import { MdOutlineTouchApp } from "react-icons/md";

//* swiper 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



const BenefitsSwiper = () => {

  return (
    <div className="flex w-[95vw] py-6 flex-row flex-wrap items-center justify-center gap-4 pl-4 ">
        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={-40}
          className="flex w-full flex-row gap-4  rounded-lg"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              width: 768,
              slidesPerView: 2,
              centeredSlides: false,
            },
          }}
        >
          <SwiperSlide>
            <div className="flex w-80 flex-col justify-center gap-3 rounded-lg bg-white p-4 shadow-lg transition-all h-48 pt-4 ">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl text-white">
                <CiMicrophoneOn />
              </div>
              <p className="h-6 text-lg font-semibold">Grabación de voz</p>
              <p className="flex h-auto justify-center text-sm lg:h-16">
                Permite a los usuarios capturar audio a través de un micrófono.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex w-80 flex-col justify-center gap-3 rounded-lg bg-white p-4 shadow-lg transition-all h-48 pt-4 ">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl text-white">
                <CiCircleQuestion />
              </div>
              <p className="h-6 text-lg font-semibold">
                Generación automática{" "}
              </p>
              <p className="flex h-auto justify-center text-sm lg:h-16">
                Utiliza inteligencia artificial para crear preguntas
                automáticamente.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex w-80 flex-col justify-center gap-3 rounded-lg bg-white p-4 shadow-lg transition-all h-48 pt-4 ">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl text-white">
                <CgTranscript />
              </div>
              <p className="h-6 text-lg font-semibold">
                Transcripción de audio
              </p>
              <p className="flex h-auto justify-center text-sm lg:h-16">
                Convierte el contenido de audio en texto escrito, facilitando su
                comprensión y accesibilidad.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex w-80 flex-col justify-center gap-3 rounded-lg bg-white p-4 shadow-lg transition-all h-48 pt-4 ">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl text-white">
                <MdOutlineTouchApp />
              </div>
              <p className="h-6 text-lg font-semibold">Interfaz de usuario</p>
              <p className="flex h-auto justify-center text-sm lg:h-16">
                Es la parte de la aplicación o sistema con la que interactúan
                los usuarios, incluyendo elementos visuales y de interacción.
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
    </div>
  );
}

export default BenefitsSwiper