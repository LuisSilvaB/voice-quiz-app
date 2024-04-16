import React from 'react'
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  Typography,
  TimelineBody
  
} from "@material-tailwind/react";
import { UsersIcon, MicrophoneIcon, QueueListIcon } from "@heroicons/react/24/solid";

import { useAuth } from '../../hooks/useAuth';

import { motion } from "framer-motion";
import cx from '../../libs/cx';


interface Props {
  isOpen: boolean;
  toggle: () => void;
  onOpen: () => void;
  onClose: () => void;
}

const TeacherModal:React.FC<Props> = ({isOpen, onClose}) => {
  const { registerUserRol }  = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
      transition={{ duration: 0.3 }}
      className={cx(
        "fixed z-40 left-0 top-0 h-full w-full",
        isOpen ? "flex" : "hidden",
      )}
    >
      <div
        className="fixed left-0 top-0 h-full w-full bg-[#0000004d]"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 top-0 m-auto flex h-full lg:h-fit max-w-[30rem] flex-col rounded-lg bg-white px-6  py-3">
        <div className='w-full py-4 flex justify-center'>
          <p className='font-semibold text-3xl text-tangaroa-500'>Profesor</p>
        </div>
        <Timeline className="flex flex-col">
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="bg-tangaroa-500 p-2">
                <MicrophoneIcon className="h-4 w-4" />
              </TimelineIcon>
              <Typography placeholder={""} variant="h5" color="blue-gray">
                Grabación en tiempo real
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography
                placeholder={""}
                color="amber"
                className="text-md font-normal text-gray-600"
              >
                Capta cada momento de tus clases con nuestra función de
                grabación en tiempo real. Los profesores pueden registrar sus
                sesiones, lo que les permite revisar y analizar la interacción
                con los estudiantes en cualquier momento.
              </Typography>
            </TimelineBody>
          </TimelineItem>
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="bg-tangaroa-500 p-2">
                <QueueListIcon className="h-4 w-4" />
              </TimelineIcon>
              <Typography placeholder={""} variant="h5" color="blue-gray">
                Generación de preguntas.
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography
                placeholder={""}
                color="amber"
                className="text-md font-normal text-gray-600"
              >
                Enriquece tu enseñanza con preguntas inteligentes. Nuestra
                herramienta de generación de preguntas automatizadas utiliza la
                inteligencia artificial para crear cuestionarios adaptados al
                contenido de tu clase
              </Typography>
            </TimelineBody>
          </TimelineItem>
          <TimelineItem>
            <TimelineHeader>
              <TimelineIcon className="bg-tangaroa-500 p-2">
                <UsersIcon className="h-4 w-4" />
              </TimelineIcon>
              <Typography placeholder={""} variant="h5" color="blue-gray">
                Retroalimentación activa.
              </Typography>
            </TimelineHeader>
            <TimelineBody>
              <Typography
                placeholder={""}
                color="amber"
                className="text-md font-normal text-gray-600"
              >
                Mejora tu enseñanza con retroalimentación instantánea. Nuestra
                función de retroalimentación activa analiza las preguntas
                adecuadas a los estudiantes en tiempo real.
              </Typography>
            </TimelineBody>
          </TimelineItem>
        </Timeline>
        <div className="flex h-auto w-full mt-3 justify-end gap-2">
          <button type="button" className='py-2 px-3 bg-tangaroa-950 text-white rounded' onClick={onClose}>Cancelar</button>
          <button type="button" className='py-2 px-3 bg-tangaroa-500 text-white rounded hover:bg-tangaroa-800 transition-all ease-in-out'onClick={()=>{
            registerUserRol('TEACHER'); 
          }}>Confirmar</button>
        </div>
      </div>
    </motion.div>
  );
}

export default TeacherModal