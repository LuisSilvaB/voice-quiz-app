import { HiInbox } from "react-icons/hi2";

const QuestionsEmpty = () => {
  return (
    <div className="flex h-full w-full items-center justify-center text-gray-600">
      <div className="flex max-w-[300px] flex-col justify-center items-center gap-3">
        <HiInbox width={100} height={100} className="h-auto w-[100px]" />
        <p className="text-lg text-center">Aún no se generaron preguntas o no se seleccionó un fragmento</p>
      </div>
    </div>
  );
}

export default QuestionsEmpty