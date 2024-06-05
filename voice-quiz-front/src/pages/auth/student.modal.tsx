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

const StudentModal:React.FC<Props> = ({isOpen, onClose}) => {
  const { registerUserRol }  = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
      transition={{ duration: 0.3 }}
      className={cx(
        "fixed left-0 top-0 z-40 h-full w-full",
        isOpen ? "flex" : "hidden",
      )}
    >
      <div
        className="fixed left-0 top-0 h-full w-full bg-[#0000004d]"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 top-0 m-auto flex h-full flex-col rounded-lg bg-white px-6 py-3 lg:h-fit  lg:max-w-[30rem]">
        <div className="flex w-full justify-center py-4">
          <p className="text-xl font-semibold text-tangaroa-500 lg:text-3xl">
            Estudiante
          </p>
        </div>
        <Timeline className="flex flex-col">
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="bg-tangaroa-500 p-2">
                <MicrophoneIcon className="h-4 w-4" />
              </TimelineIcon>
              <Typography placeholder={""} variant="h5" color="blue-gray">
                Acceso a exámenes
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography
                placeholder={""}
                color="amber"
                className="lg:text-md text-xs font-normal text-gray-600"
              >
                Obtén acceso a todos tus exámenes y pruebas desde un solo lugar.
                Nuestra plataforma te permite revisar y completar tus exámenes
                en línea de manera sencilla y organizada.
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
                Registro de progreso.
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography
                placeholder={""}
                color="amber"
                className="lg:text-md text-xs font-normal text-gray-600"
              >
                Sigue tu progreso académico en tiempo real. Nuestra herramienta
                de seguimiento te muestra cómo estás avanzando en tus estudios y
                te ayuda a identificar áreas de mejora.
              </Typography>
            </TimelineBody>
          </TimelineItem>
          <TimelineItem>
            <TimelineHeader>
              <TimelineIcon className="bg-tangaroa-500 p-2">
                <UsersIcon className="h-4 w-4" />
              </TimelineIcon>
              <Typography placeholder={""} variant="h5" color="blue-gray">
                Estadísticas detalladas
              </Typography>
            </TimelineHeader>
            <TimelineBody>
              <Typography
                placeholder={""}
                color="amber"
                className="lg:text-md text-xs font-normal text-gray-600"
              >
                Accede a estadísticas detalladas de tus exámenes y rendimiento
                académico. Obtén una visión clara de tus fortalezas y
                debilidades para mejorar tu aprendizaje.
              </Typography>
            </TimelineBody>
          </TimelineItem>
        </Timeline>
        <div className="mt-3 flex h-full w-full items-end justify-end gap-2">
          <button
            type="button"
            className="rounded bg-tangaroa-950 px-3 py-2 text-white"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded bg-tangaroa-500 px-3 py-2 text-white transition-all ease-in-out hover:bg-tangaroa-800"
            onClick={() => {
              registerUserRol("STUDENT");
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default StudentModal 