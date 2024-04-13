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
            title:fragment.title, 
            content:fragment.content, 
        }))
    }
  return (
    <div className="flex h-fit w-full max-w-[350px] cursor-pointer flex-col gap-4 rounded-2xl border p-4 shadow-sm transition-all hover:border-none hover:shadow-2xl">
      <p className="font-bold">
        Fragmento número <span>{fragment.id}</span>
      </p>
      <p className="text-sm text-bold">
        Título: <span className="font-light">{fragment.title}</span>
      </p>
      <p className="h-full max-h-[100px] flex-nowrap text-ellipsis font-normal overflow-y-hidden">
        <span className="font-bold">Contenido del fragmento: </span>
        {fragment.content}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-row gap-2">
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