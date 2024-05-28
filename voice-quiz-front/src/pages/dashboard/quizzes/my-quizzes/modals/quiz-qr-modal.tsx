import { Quiz } from "../../../../../class/quiz.class"
import { ModalProps } from "../../../courses/types"
import { motion } from "framer-motion"
import { variants } from "../../../courses/types"
import { IoMdClose } from "react-icons/io"
import { publicConfig } from "../../../../../config/config"
import QrCode from "react-qr-code"
import { Button, Typography } from "@material-tailwind/react"
import { PiQrCodeLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom"
interface Props extends ModalProps{
  quiz:Quiz
}

const QuizQrModal:React.FC<Props> = ({quiz, ...toggle}) => {
  const navigate = useNavigate()
  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={toggle.isOpen ? "enter" : "exit"}
      className="fixed left-0  top-0 z-30 h-full w-full bg-[#0000004d]"
    >
      <div className=" flex h-full w-full items-center justify-center">
        <div className=" relative h-fit w-[400px] rounded-lg bg-white px-2 py-2 pb-4">
          <div className="absolute -top-10 left-0 right-0 mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-white text-4xl font-bold text-blue-gray-600">
            <PiQrCodeLight />
          </div>
          <div className="flex w-full justify-end">
            <div
              onClick={toggle.onClose}
              className="cursor-pointer text-2xl text-gray-400 transition-all hover:text-red-600 focus:text-red-600"
            >
              <IoMdClose />
            </div>
          </div>
          <div className="mb-3 mt-6 flex w-full flex-col items-center justify-center gap-4">
            <QrCode
              value={`${publicConfig.front_v1}/quiz/${quiz.ID}`}
              size={200}
              fgColor={"#3b3b3b"}
              style={{
                color: "#5e5e5e",
              }}
            />
            <Typography placeholder={""} variant="h5" color="gray">
              {quiz.title}
            </Typography>
            <Button
              placeholder={""}
              variant="gradient"
              color="cyan"
              onClick={() => navigate(`${publicConfig.front_v1_local}/quiz/${quiz.ID}`)}
            >
              Ir al cuestionario
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default QuizQrModal