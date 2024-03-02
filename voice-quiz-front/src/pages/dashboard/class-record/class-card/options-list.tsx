import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";

const OptionsList = () => {
  return (
    <div>
      <div className="flex w-full justify-end px-4">
        <div className="cursor-pointer rounded-full p-2 transition-all hover:bg-blue-gray-500 hover:text-white">
          <BsThreeDotsVertical />
        </div>
      </div>
      <ul>
        <li>
          <MdEdit/>          
          <p>Editar</p>
        </li>
        <li>
          <IoMdTrash/>
          <p>Eliminar</p>
        </li>
      </ul>
    </div>
  );
}

export default OptionsList