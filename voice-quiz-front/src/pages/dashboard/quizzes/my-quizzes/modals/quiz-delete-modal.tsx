import { Quiz } from "../../../../../class/quiz.class"
import { ModalProps } from "../../../courses/types"
import { motion } from "framer-motion"
import { variants } from "../../../courses/types"
import { IoMdTrash, IoMdClose } from "react-icons/io"
import { Button } from "@material-tailwind/react"
import { deleteQuiz } from "../../../../../features/db-features/quizzes.features"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../../../app/store"

interface Props extends ModalProps{
  quiz:Quiz
}

const QuizDeleteModal:React.FC<Props> = ({quiz, ...toggle}) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const onDeleteQuiz = () => {
    dispatch(deleteQuiz(quiz))
    toggle.onClose()
  }
  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={toggle.isOpen ? "enter" : "exit"}
      className="fixed left-0  top-0 z-30 h-full w-full bg-[#0000004d]"
    >
      <div className=" flex h-full w-full items-center justify-center">
        <div className=" relative h-fit w-[400px] rounded-lg bg-white px-2 py-2 pb-4">
          <div className="absolute -top-10 left-0 right-0 mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-white text-4xl text-red-600 ">
            <IoMdTrash />
          </div>
          <div className="flex w-full justify-end">
            <div
              onClick={toggle.onClose}
              className="cursor-pointer text-2xl text-gray-400 transition-all hover:text-red-600 focus:text-red-600"
            >
              <IoMdClose />
            </div>
          </div>
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-1">
            <p className="w-full text-center font-inter text-lg font-bold">
              ¿Estás seguro de eliminar el cuestionario {quiz.title}?
            </p>
            <p className="text-sm w-full text-center font-inter font-normal text-gray-600">
              El cuestionario será eliminado de forma permanente
            </p>
          </div>
          <div className="mt-6 flex w-full justify-end gap-2 pr-4">
            <Button placeholder={""} className="" onClick={toggle.onClose}>
              Cancelar
            </Button>
            <Button
              placeholder={""}
              className="bg-red-600"
              onClick={onDeleteQuiz}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default QuizDeleteModal