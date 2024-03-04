import ClassRecord from "../../../../class/class-record.class";
import { useEffect } from "react";
import useToggle from "../../../../hooks/useToggle";
import OptionsList from "./options-list/options-list";

interface ClassCardProps extends ClassRecord {
    handleOpenOptions: (id: string) => void
    targetClassRecord: ClassRecord | null; 
} 

const ClassCard:React.FC<ClassCardProps> = ({targetClassRecord, handleOpenOptions ,...props}) => {
  const toggleOptions = useToggle(false); 
  useEffect(()=>{
    if (targetClassRecord?.id === props.id) toggleOptions.onOpen(); 
    else toggleOptions.onClose(); 
  // eslint-disable-next-line 
  },[targetClassRecord, props.id])
  return (
    <div className="flex h-fit w-[300px] cursor-pointer flex-col gap-2 rounded-lg border pb-4 shadow-md transition-all">
      <div>
        <img src={props.placeholderImg} className="h-auto w-fit rounded-t-lg" />
      </div>
      <div className="px-4">
        <p className="text-xs text-gray-500">id: {props.id}</p>
        <p className="font-montserrat text-lg font-bold">{props.title}</p>
        <p>{props.sessions.length} sesiones de clase</p>
        <p>{props.createAt}</p>
      </div>
      <div className="flex w-full justify-end px-4">
        <OptionsList
          cardClassId={props.id}
          isOpen={toggleOptions.isOpen}
          onClose = {toggleOptions.onClose} 
          handleOpenOptions={handleOpenOptions}
        />
      </div>
    </div>
  );
}

export default ClassCard