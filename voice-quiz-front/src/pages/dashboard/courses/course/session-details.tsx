import { Session } from "../../../../interface"
import { motion } from "framer-motion"
import { variants } from "../types"

interface Props {
  targetSession:Session
  isOpen: boolean
}
const SessionDetails:React.FC<Props> = ({targetSession, isOpen}) => {
  return (
    <motion.div
      initial="exit"
      animate={isOpen ? "enter" : "exit"}
      variants={variants}
      className="shadow-lg rounded-lg my-5 border"
    >
      <div className="flex justify-center items-center w-full h-40">
          <p>{targetSession.id}</p>
          <p>{targetSession.createAt}</p>
          <p>{targetSession.title}</p>
      </div>
    </motion.div>
  )
}

export default SessionDetails