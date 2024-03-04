import { motion } from "framer-motion" 
import { variants } from "./options-list"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../../../app/store";
import { setIsOpenModal, clearTargetClassRecord } from "../../../../features/class-record";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { Button } from "@material-tailwind/react";

const EditClassModal:React.FC = () => {
  const dispatch = useDispatch(); 
  const isOpenModal = useSelector((state:RootState) => state.classRecord.isOpenModal )
  const typeModal = useSelector((state:RootState) => state.classRecord.typeModal )
  const targetClassRecord = useSelector((state:RootState) => state.classRecord.classRecordTarget)
  const closeModal = () => {
    dispatch(setIsOpenModal(false))
    dispatch(clearTargetClassRecord()); 
  }
  const editModal = () => {
    dispatch(setIsOpenModal(false))
    dispatch(clearTargetClassRecord()); 
  }
  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={isOpenModal && typeModal === "edit" ? "enter" : "exit"}
      className="fixed left-0  top-0 z-30 h-full w-full bg-[#0000004d]"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-[500px] w-[400px] rounded-lg bg-white">
          <div className="flex w-full flex-col justify-between px-2 py-2">
            <div
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-2xl transition-all hover:text-red-600 focus:text-red-600"
            >
              <IoMdClose />
            </div>
            <div className="absolute -top-10 left-0 right-0 mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-white text-4xl text-green-600 ">
              <MdEdit />
            </div>
            <div
              style={{
                backgroundImage: `url(${targetClassRecord?.placeholderImg})`,
              }}
              className="h-40 w-full rounded-lg"
            />
            <div className="mt-6 flex w-full flex-col items-center justify-center gap-1">
              <p className="font-inter text-lg font-bold">Editar clase</p>
              <p className="text-md w-full text-center font-inter font-normal text-gray-600">
                Sientete libre de editar tu clase
              </p>
              <p className="text-md w-full text-center font-inter font-normal text-gray-600">
                Datos
              </p>
            </div>
            <div className="mx-5 mt-6 flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <span className="font-black">Id: </span>
                <p>{targetClassRecord?.id}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <span className="font-black">Título:</span>{" "}
                <p>{targetClassRecord?.title}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <span className="font-black">Fecha de creación:</span>{" "}
                <p>{targetClassRecord?.createAt}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <span className="font-black">Número de sesiones:</span>{" "}
                <div>{targetClassRecord?.sessions?.length}</div>
              </div>
            </div>
            <div className="mt-6 pr-4 w-full flex justify-end gap-2">
            <Button placeholder={""} className="" onClick={closeModal}>
              Cancelar
            </Button >
            <Button placeholder={""} className="bg-green-600" onClick={editModal}>
              Guardar
            </Button >
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EditClassModal