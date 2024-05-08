import { IconButton, Button, Chip } from "@material-tailwind/react";
import { IoCopy } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setTargetFragment } from "../../../../features/fragments.features";
import { AppDispatch } from "../../../../app/store";
import { Fragment } from "../../../../class/fragments";

interface Props {
    fragment: Fragment;
    position: number;
}

const FragmentsCard:React.FC<Props> = ({fragment}) => {
    const dispatch = useDispatch<AppDispatch>()
    const handleTargetFragment = (fragment:Fragment) => {
        dispatch(setTargetFragment(fragment))
    }
  return (
    <div className="flex h-fit w-full max-w-[350px] cursor-pointer flex-col gap-3 rounded-xl border hover:border-gray-400 bg-white p-3 shadow-sm transition-all">
      <div className="flex w-fit items-center gap-2 font-bold">
        <Chip
          value={fragment.ID}
          size="sm"
          variant="ghost"
          color="deep-purple"
          className="truncate text-ellipsis"
        />
      </div>
      
      <div className="text-bold text-sm">
        <Chip className="w-fit" value = {"Título"} size="sm" variant="ghost"/>
        <p className="font-medium mt-2">{fragment.title}</p>
      </div>
      
      <div className="h-full max-h-[100px] flex-nowrap overflow-y-hidden text-ellipsis font-normal">
        <Chip className="w-fit" value = {"Contenido del fragmento:"} size="sm" variant="ghost"/>
        <p className="text-wrap min-h-16 overflow-hidden mt-2">
          {fragment.content}
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-row gap-2">
          <IconButton placeholder={""} className="bg-gray-200">
            <IoCopy className="text-blue-500" />
          </IconButton>
          <IconButton placeholder={""} className="bg-gray-200">
            <FaTrash className="text-red-500" />
          </IconButton>
        </div>
        <Button
          placeholder={""}
          className="text-[10px]"
          onClick={() => handleTargetFragment(fragment)}
        >
          Generar preguntas
        </Button>
      </div>
    </div>
  );
}

export default FragmentsCard