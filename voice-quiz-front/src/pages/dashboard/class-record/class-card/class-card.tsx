import { BsThreeDotsVertical } from "react-icons/bs";
import { ClassRecord } from '../../../../interface/types';


const ClassCard:React.FC<ClassRecord> = ({id, createAt, sessions, title, placeholderImg}) => {
  return (
    <div className='w-[300px] h-fit flex flex-col gap-2 border rounded-lg shadow-md pb-4 cursor-pointer lg:hover:scale-105 transition-all'> 
        <div>
            <img src={placeholderImg} className="rounded-t-lg w-fit h-auto" />
        </div>
        <div className="px-4">
            <p className="text-xs text-gray-500">id: {id}</p>   
            <p className="font-montserrat text-lg font-bold">{title}</p>
            <p>{sessions.length} sesiones de clase</p>
            <p>{createAt}</p>
        </div>
        <div className='w-full flex justify-end px-4'>
            <div className="cursor-pointer p-2 rounded-full hover:bg-blue-gray-500 hover:text-white transition-all">
                <BsThreeDotsVertical />
            </div>
        </div>
    </div>
  )
}

export default ClassCard