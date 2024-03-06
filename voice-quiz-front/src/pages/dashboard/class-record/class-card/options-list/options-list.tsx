import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import cx from "../../../../../libs/cx";
import { variants } from "../../types"; 
import { ModalActions } from "../../../../../interface/types";
import { useDispatch } from "react-redux";
import { setTypeModal,setIsOpenModal } from "../../../../../features/class-record";

interface Props {
  cardClassId: string;
  isOpen: boolean;
  onClose: () => void;
  handleOpenOptions: (id: string) => void;
}

const OptionsList:React.FC<Props> = ({isOpen, onClose, cardClassId, handleOpenOptions}) => {
  const dispatch = useDispatch(); 
  const handleSelectModal = ( action: ModalActions ) => {
    dispatch(setTypeModal(action))
    dispatch(setIsOpenModal(true))
    onClose(); 
  }
  return (
    <motion.div className="relative">
      <div className="z-10 flex w-fit justify-end pl-4">
        <div
          className={cx(
            "cursor-pointer rounded-full p-2 transition-all hover:bg-blue-gray-500 hover:text-white",
            isOpen && "bg-blue-gray-500 text-white",
          )}
          onClick={()=>handleOpenOptions(cardClassId)}
        >
          <BsThreeDotsVertical />
        </div>
      </div>
      <motion.ul
        variants={variants}
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        className="absolute right-5 top-6 z-10 flex flex-col gap-4  rounded-lg bg-white p-1 shadow-2xl"
      >
        <li
          onClick={()=> handleSelectModal("edit")}
          className="flex w-full flex-row items-center justify-start gap-1 rounded-lg border p-2 transition-all hover:bg-blue-gray-500 hover:text-white"
        >
          <MdEdit />
          <p>Editar</p>
        </li>
        <li
          onClick={()=> handleSelectModal("delete")}
          className="mt-1 flex w-full flex-row items-center justify-start gap-1 rounded-lg border p-2 transition-all hover:bg-red-500 hover:text-white"
        >
          <IoMdTrash />
          <p>Eliminar</p>
        </li>
      </motion.ul>
    </motion.div>
  );
}

export default OptionsList