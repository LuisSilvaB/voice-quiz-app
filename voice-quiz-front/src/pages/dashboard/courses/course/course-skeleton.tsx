import { Button } from '@material-tailwind/react';

const CourseSkeleton = () => {
  return (
    <div className="relative top-5 mx-auto mt-4 w-full max-w-[350px] rounded-lg border-t bg-white p-6 shadow-lg lg:w-[500px] lg:max-w-[500px]">
      <div className="flex flex-col gap-5">
        <div className=" h-48 w-48 rounded-lg  bg-white">
          <img
            src="https://placehold.co/300x300"
            className="h-full w-full rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-3xl font-bold">
            <div className="h-8 w-40 animate-pulse bg-gray-300 rounded-md" />
          </p>

          <div className="flex items-center justify-between  font-bold text-gray-500">
            <p>id del curso:</p>
            <div className="h-3 w-40 animate-pulse rounded-lg bg-gray-300" />
          </div>

          <div className="flex items-center justify-between font-bold text-gray-500">
            <p>N° de sesiones:{" "}</p>
            <div className="h-3 w-40 animate-pulse rounded-lg bg-gray-300 font-normal" />
          </div>
          
          <p className="flex items-center justify-between font-bold text-gray-500">
            <p>Profesor:{" "}</p>
            <div className="animate-pulse rounded-lg bg-gray-300 font-normal"></div>
          </p>
          {/* <p className="flex justify-between font-bold text-gray-500">
            Cantidad de estudiantes:{" "}
            <span className="animate-pulse bg-gray-300 font-normal"></span>
          </p> */}
          <p className="flex justify-between font-bold text-gray-500">
            Duración :{" "}
            <span className="animate-pulse bg-gray-300 font-normal"></span>
          </p>
          <p className="flex justify-between font-bold text-gray-500">
            Fecha de inicio:{" "}
            <span className="animate-pulse bg-gray-300 font-normal"></span>
          </p>
          <p className="flex justify-between font-bold text-gray-500">
            Fecha de fin:{" "}
            <span className="animate-pulse bg-gray-300 font-normal"></span>
          </p>
        </div>
        <div className="flex gap-4">
          <Button placeholder={""} className="bg-blue-500">
            Editar
          </Button>
          <Button placeholder={""} className="bg-red-500">
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CourseSkeleton