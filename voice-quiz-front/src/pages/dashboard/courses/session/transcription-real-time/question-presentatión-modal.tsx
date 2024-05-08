import React, { useEffect } from 'react'
import { Question } from '../../../../../class/questions.class'
import { toggleProps } from '../../../../../interface/types';
import { motion } from "framer-motion"
import { variants } from '../../types';
import { createPortal } from 'react-dom';
import { Button, Chip, IconButton } from '@material-tailwind/react';
import { CgClose } from 'react-icons/cg';
import useToggle from '../../../../../hooks/useToggle';
interface Props extends toggleProps{  
  questionSelected: Question | null; 
  questionClear: () => void; 
}

const QuestionPresentationModal:React.FC<Props> = ({questionSelected, questionClear, ...toggle}) => {
  useEffect(()=>{return () => questionClear()})
  const toggleQuestion = useToggle()
  return createPortal(
    <motion.div
      variants={variants}
      initial="exit"
      animate={toggle.isOpen ? "enter" : "exit"}
      className="z-30"
    >
      <div
        className="fixed left-0 top-0 z-30 h-full w-full bg-[#4444]"
        onClick={toggle.onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 top-0 z-30 m-auto box-border flex max-h-[600px] min-h-[300px] w-[1000px] flex-col gap-2 rounded-lg bg-white p-4 text-black">
        <div className="flex w-full justify-between">
          <Chip
            value="Pregunta"
            variant="outlined"
            className="w-fit"
            color="amber"
          />
          <IconButton placeholder={""} onClick={toggle.onClose} color="pink">
            <CgClose />
          </IconButton>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-600">
          {questionSelected?.question}
        </p>
        
        <div className='mt-3'>
          {questionSelected?.type === "true_or_false" ? (
            <Chip
              value={questionSelected?.ID ? "Verdadero o Falso" : "Pregunta"}
              variant="ghost"
              className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
            ></Chip>
          ) : null}

          {questionSelected?.type === "multiple_answer" ? (
            <Chip
              value={questionSelected?.ID ? "Preguntas múltiples" : "Pregunta"}
              variant="ghost"
              color="pink"
              className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
            ></Chip>
          ) : null}

          {questionSelected?.type === "open_answer" ? (
            <Chip
              value={questionSelected?.ID ? "Pregunta abierta" : "Pregunta"}
              variant="ghost"
              color="green"
              className="w-fit truncate text-ellipsis rounded-md border px-2 text-xs"
            ></Chip>
          ) : null}
        </div>

        <ul className="mt-5 flex flex-col gap-3 text-black">
          {questionSelected?.alternatives.map(
            (alternative: string, index: number) => (
              <li className="flex gap-3 text-2xl font-semibold text-gray-800">
                <IconButton placeholder={""} size="sm" variant="outlined">
                  {index + 1}.
                </IconButton>
                <p>{alternative}</p>
              </li>
            ),
          )}
        </ul>

        <div className="flex h-full w-full items-end justify-between">
          <div className="flex flex-col items-start gap-2">
            <Button placeholder={""} variant="outlined" size="sm">
              Respuesta
            </Button>
            {toggleQuestion.isOpen ? (
              <p className="max-w-[700px] font-semibold text-gray-800 text-xl">
                {questionSelected?.answer}
              </p>
            ) : null}
          </div>
          <Button
            placeholder={""}
            color="amber"
            onClick={toggleQuestion.onToggle}
          >
            {toggleQuestion.isOpen ? "Ocultar Respuesta" : "Revelar Respuesta"}
          </Button>
        </div>
      </div>
    </motion.div>,
    document.getElementById("portal")!,
  );
}

export default QuestionPresentationModal