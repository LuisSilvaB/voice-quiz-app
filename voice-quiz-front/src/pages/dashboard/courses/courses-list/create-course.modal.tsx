import { motion } from "framer-motion" 
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { setIsOpenModal, clearTargetCourse } from "../../../../features/class-record";
import { IoMdClose } from "react-icons/io";
import { Button } from "@material-tailwind/react";
import { variants } from '../types';
import { RootState } from '../../../../app/store';
import { FiPlus } from "react-icons/fi";
import { GrSubtract } from "react-icons/gr";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";


const CreateCourseModal:React.FC = () => {
  const dispatch = useDispatch(); 
  const [sessionsCount, setSessionsCount] = useState<number>(0)
  const isOpenModal = useSelector((state:RootState) => state.course.isOpenModal )
  const typeModal = useSelector((state:RootState) => state.course.typeModal )
  const targetCourse = useSelector((state:RootState) => state.course.classRecordTarget)
  
  const navigate = useNavigate();

  const date = new Date();
  const id = nanoid()

  const handleSessionsCount = (action: "add" | "substract") => {
    if (action === "add" && sessionsCount < 16) setSessionsCount(sessionsCount + 1)
    else if (action === "substract" && sessionsCount > 0 ) setSessionsCount(sessionsCount - 1)
  }

  const closeModal = () => {
    dispatch(setIsOpenModal(false))
    dispatch(clearTargetCourse()); 
  }
  const CreateCourse = () => {
    dispatch(setIsOpenModal(false))
    dispatch(clearTargetCourse()); 
    openSessions(); 
  }

  const openSessions = () => {
    navigate(`/dashboard/courses/sessions-list/${id}`)
  }

  return (
    <motion.div
      variants={variants}
      initial="exit"
      animate={isOpenModal && typeModal === "create" ? "enter" : "exit"}
      className="fixed left-0  top-0 z-30 h-full w-full bg-[#0000004d] select-none"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-auto w-[450px] rounded-lg bg-white">
          <div className="flex w-full flex-col justify-between px-2 py-2">
            <div
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-2xl transition-all hover:text-red-600 focus:text-red-600"
            >
              <IoMdClose />
            </div>
            <div className="absolute -top-10 left-0 right-0 mx-auto flex h-20 w-20 items-center justify-center rounded-full border bg-white text-4xl text-green-600 ">
              <FiPlus />
            </div>
            <div
              style={{
                backgroundImage: `url(${targetCourse?.placeholderImg})`,
              }}
              className="h-40 w-full rounded-lg"
            />
            <div className="mt-6 flex w-full flex-col items-center justify-center gap-1">
              <p className="font-inter text-lg font-bold">Crear clase</p>
              <p className="text-md w-full text-center font-inter font-normal text-gray-600">
                Sientete libre de crear tu clase
              </p>
              <p className="text-md w-full text-center font-inter font-bold text-gray-600">
                Datos
              </p>
            </div>
            <div className="mx-5 mt-6 flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <span className="font-black">Id: </span>
                <p>{id}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-black">Título:</span>{" "}
                <input
                  type="text"
                  className="rounded-md border  p-1 focus:outline-none"
                />
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-black">Fecha de creación:</span>{" "}
                <p>{date.toDateString()}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <span className="font-black">Número de sesiones:</span>{" "}
                <div className="flex flex-row items-center">
                  <div className="w-7 h-7 flex justify-center items-center border rounded-tl-xl rounded-bl-xl cursor-pointer" onClick={() => handleSessionsCount("substract")}>
                    <GrSubtract />
                  </div>
                  <div className="w-7 h-7 flex justify-center items-center select-none border">
                    {sessionsCount}
                  </div>
                  <div className="w-7 h-7 flex justify-center items-center border rounded-tr-xl rounded-br-xl cursor-pointer" onClick={() => handleSessionsCount("add")}>
                    <FiPlus />
                  </div>
                </div>
              </div>
              {/* <span className="w-full flex justify-end text-red-500">* solo es posible un número máximo de 16 sesiones</span> */}
            </div>
            <div className="mt-6 flex w-full justify-end gap-2 pr-4">
              <Button placeholder={""} className=" h-fit" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                placeholder={""}
                className="mb-4 h-fit bg-green-600"
                onClick={CreateCourse}
              >
                Crear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CreateCourseModal