import { motion } from "framer-motion" 
import { variants } from "../../types"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../../../app/store";
import { IoMdClose } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";
import { Button } from "@material-tailwind/react";
import { clearTargetSession, setSessionToggleModal, deleteSession } from "../../../../../features/db-features/sessions.features";
import { updateCourse } from "../../../../../features/db-features/courses.features";


const DeleteSessionModal:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const isOpenModal = useSelector((state:RootState) => state.sessions.sessionIsOpenModal )
  const typeModal = useSelector((state:RootState) => state.sessions.sessionTypeModal )
  const targetSession = useSelector((state:RootState) => state.sessions.targetSession)
  const currentCourse = useSelector((state:RootState) => state.courses.course)
  const closeModal = () => {
    dispatch(setSessionToggleModal())
    dispatch(clearTargetSession()); 
  }
  const handleDelete = () => {
    dispatch(deleteSession(targetSession))
    dispatch(updateCourse({
      ...currentCourse,
      sessions_count: currentCourse.sessions_count! - 1
    }))
    dispatch(setSessionToggleModal())
    dispatch(clearTargetSession());
  }
  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={isOpenModal && typeModal === "delete" ? "enter" : "exit"}
      className="fixed left-0  top-0 z-30 h-full w-full bg-[#0000004d]"
    >
      <div className=" flex h-full w-full items-center justify-center">
        <div className=" relative h-fit w-[400px] rounded-lg bg-white px-2 py-2 pb-4">
          <div className="absolute flex justify-center items-center border rounded-full w-20 h-20 text-4xl -top-10 right-0 left-0 mx-auto bg-white text-red-600 ">
            <IoMdTrash />
          </div>
          <div className="flex w-full justify-end">
            <div
              onClick={closeModal}
              className="cursor-pointer text-2xl transition-all text-gray-400 hover:text-red-600 focus:text-red-600"
            >
              <IoMdClose />
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 justify-center items-center mt-6">
            <p className="text-lg font-bold font-inter w-full text-center">¿Estás seguro de eliminar la sesion {targetSession.title}?</p>
            <p className="text-md font-normal font-inter w-full text-center text-gray-600">La clase será eliminada de forma permanente</p>
          </div>
          <div className="mt-6 pr-4 w-full flex justify-end gap-2">
            <Button placeholder={""} className="" onClick={closeModal}>
              Cancelar
            </Button >
            <Button placeholder={""} className="bg-red-600" onClick={handleDelete}>
              Eliminar
            </Button >
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DeleteSessionModal