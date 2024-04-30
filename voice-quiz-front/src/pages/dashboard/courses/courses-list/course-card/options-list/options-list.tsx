import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import cx from "../../../../../../libs/cx";
import { variants } from "../../../types"; 
import { ModalActions } from "../../../../../../interface/types";
import { useDispatch } from "react-redux";
import { setTypeModal, setToggleModal, setTargetCourse } from "../../../../../../features/db-features/courses.features";
import { useEffect, useRef } from "react";
import useToggle from "../../../../../../hooks/useToggle";
import { Course } from "../../../../../../class/course.class";
interface Props extends Course {}

const OptionsList:React.FC<Props> = ({ ...course }) => {
  const dispatch = useDispatch();
  const toggleOptions = useToggle() 
  const optionsRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
      toggleOptions.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleSelectModal = ( action: ModalActions ) => {
    dispatch(setTargetCourse(course))
    dispatch(setTypeModal(action))
    dispatch(setToggleModal())
    toggleOptions.onClose(); 
  }
  return (
    <div ref = {optionsRef} className="relative">
      <div className="z-10 flex w-fit justify-end pl-4">
        <div
          className={cx(
            "cursor-pointer rounded-full p-2 transition-all hover:bg-blue-gray-500 hover:text-white",
            toggleOptions.isOpen && "bg-blue-gray-500 text-white",
          )}
          onClick={toggleOptions.onToggle}
        >
          <BsThreeDotsVertical />
        </div>
      </div>
      <motion.ul
        variants={variants}
        initial="exit"
        animate={toggleOptions.isOpen ? "enter" : "exit"}
        className="absolute right-5 top-6 z-10 flex flex-col gap-4  rounded-lg bg-white p-1 shadow-2xl"
      >
        <li
          onClick={()=> {handleSelectModal("edit")}}
          className="flex w-full flex-row items-center justify-start gap-1 rounded-lg border p-2 transition-all hover:bg-blue-gray-500 hover:text-white"
        >
          <MdEdit />
          <p>Editar</p>
        </li>
        <li
          onClick={()=> {handleSelectModal("delete")}}
          className="mt-1 flex w-full flex-row items-center justify-start gap-1 rounded-lg border p-2 transition-all hover:bg-red-500 hover:text-white"
        >
          <IoMdTrash />
          <p>Eliminar</p>
        </li>
      </motion.ul>
    </div>
  );
}

export default OptionsList