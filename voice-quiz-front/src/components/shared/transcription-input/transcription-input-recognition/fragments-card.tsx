import { IconButton, Button } from "@material-tailwind/react";
import { IoCopy } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setTargetFragment } from "../../../../features/fragments.features";
import { AppDispatch } from "../../../../app/store";
import { fragmentShape } from "../../../../interface/types";

interface Props {
    fragment: fragmentShape;
    position: number;
}

const FragmentsCard:React.FC<Props> = ({fragment}) => {
    const dispatch = useDispatch<AppDispatch>()
    const handleTargetFragment = (fragment:fragmentShape) => {
        dispatch(setTargetFragment({
            id:fragment.id, 
            content:fragment.content, 
        }))
    }
  return (
    <div className='w-full flex flex-col gap-4 max-w-[300px] h-[200px] p-4 shadow-sm transition-all hover:shadow-2xl hover:border-none cursor-pointer border rounded-2xl'>
        <p className="font-bold">
            Fragmento número <span>{fragment.id}</span>
        </p>
        <p className="max-h-[150px] h-full text-clip flex-nowrap font-normal">
            <span className="font-bold">
                Idea principal:      
            </span>
            {fragment.content}
        </p>
        <div className="flex justify-between items-center gap-2">
            <IconButton
              placeholder={""}
              className="bg-gray-200"
            >
              <IoCopy className="text-blue-500" />
            </IconButton>
            <IconButton
              placeholder={""}
              className="bg-gray-200"
            >
              <FaTrash className="text-red-500" />
            </IconButton>
            <Button
              placeholder={""}
              className="text-[10px]"
              onClick={() => handleTargetFragment(fragment)}
            >
              Generar preguntas
            </Button>
          </div>
    </div>
  )
}

export default FragmentsCard