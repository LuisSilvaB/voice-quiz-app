import { HiInbox } from "react-icons/hi2";

const QuizListEmpty = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg text-gray-600">
      <div className="flex max-w-[300px] flex-col items-center justify-center gap-3">
        <HiInbox width={100} height={100} className="h-auto w-[100px]" />
        <p className="text-center text-lg">
          Aún no se crearon cuestionarios 
        </p>
      </div>
    </div>
  );
}

export default QuizListEmpty