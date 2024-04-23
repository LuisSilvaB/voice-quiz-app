import { Button, Input } from "@material-tailwind/react";
import { AppDispatch } from "../../../../../../app/store";
import { Course } from "../../../../../../class/course.class";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Select from 'react-select'
import { useDispatch } from "react-redux";
import { updateCourse } from '../../../../../../features/db-features/courses.features';
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../app/store";
export interface Weeks {
  readonly value: string;
  readonly label: string;
}

const weeks: readonly Weeks[] = [
  { value: '1', label: '1 semana' },
  { value: '2', label: '2 semanas'},
  { value: '3', label: '3 semanas' },
  { value: '4', label: '4 semanas' },
  { value: '5', label: '5 semanas' },
  { value: '6', label: '6 semanas' },
  { value: '7', label: '7 semanas' },
  { value: '8', label: '8 semanas' },
  { value: '9', label: '9 semanas' },
  { value: '10', label: '10 semanas' },
  { value: '11', label: '11 semanas' },
  { value: '12', label: '12 semanas' },
  { value: '13', label: '13 semanas' },
  { value: '14', label: '14 semanas' },
  { value: '15', label: '15 semanas' },
  { value: '16', label: '16 semanas' },
];


interface Props {
  onClose: () => void;
}

const EditCourseForm:React.FC<Props> = ({
  onClose, 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const targetCourse = useSelector((state: RootState) => state.courses.targetCourse)
  const [courseToUpdate, setCourseToUpdate] = useState<Course>({
    ...targetCourse,
  } as Course);
  
  useEffect(() => {
    setCourseToUpdate({
      ...targetCourse,
    });
  }, [targetCourse])
  

  const [formErrors, setFormErrors] = useState<{
    title: string | null;
    description: string | null;
    duration: string | null;
    initial_date: string | null;
    final_date: string | null;
  }>({
    title: "",
    description: "",
    duration: "",
    initial_date: "",
    final_date: "",
  });
  

  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isValidDate = (dateString: string) => {
      return !!Date.parse(dateString);
    };
  
    if (name === "initial_date" || name === "final_date") {
      if (!isValidDate(value)) {
        return;
      }
    }
  
    setCourseToUpdate({
      ...courseToUpdate,
      [name]: value,
    });


    if (courseToUpdate.title && courseToUpdate.title?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        title: null,
      }));
    } if (courseToUpdate.description && courseToUpdate.description?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        description: null,
      }));
    } if (courseToUpdate.duration && courseToUpdate.duration?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        duration: null,
      }));
    } if (courseToUpdate.initial_date && courseToUpdate.initial_date?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        initial_date: null,
      }));
    } if (courseToUpdate.final_date && courseToUpdate.final_date?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        final_date: null,
      }));
    }
  
  };

  const getFinalDate = () => {
    const initialDate = new Date(courseToUpdate.initial_date ?? '');
  
      if (isNaN(initialDate.getTime())) {
        return;
      }
  
      const durationInWeeks = parseInt(courseToUpdate.duration ?? '', 10);
  
      if (durationInWeeks < 1 || durationInWeeks > 16) {
        return;
      }
  
      const finalDate = new Date(
        initialDate.getTime() + durationInWeeks * 7 * 24 * 60 * 60 * 1000
      );
  
      if (isNaN(finalDate.getTime())) {
        return;
      }
  
      const finalDateString = finalDate.toISOString().slice(0, 10);
  
      setCourseToUpdate((prev) => ({
        ...prev,
        final_date: finalDateString,
      }));
  }

  useEffect(() => {
    getFinalDate()
    if (courseToUpdate.duration) setFormErrors((prev) => ({ ...prev, duration: null }));
    if (courseToUpdate.initial_date) setFormErrors((prev) => ({ ...prev, initial_date: null }));
  }, [courseToUpdate.duration, courseToUpdate.initial_date])

  const onSubmit = () => {
    const newCourse:Course = {
      ...courseToUpdate,
    }

    switch (true) {
      case !newCourse.title || !newCourse.title.length:
        setFormErrors((prev) => ({
          ...prev,
          title: "El título del curso es requerido",
        }));
        return;
      case !newCourse.description || !newCourse.description.length:
        setFormErrors((prev) => ({
          ...prev,
          description: "La descripción del curso es requerida",
        }));
        return;
      case !newCourse.duration || !newCourse.duration.length:
        setFormErrors((prev) => ({
          ...prev,
          duration: "La duración del curso es requerida",
        }));
        return;
      case !newCourse.initial_date || !newCourse.initial_date.length:
        setFormErrors((prev) => ({
          ...prev,
          initial_date: "La fecha de inicio del curso es requerida",
        }));
        return;
      case !newCourse.final_date || !newCourse.final_date.length:
        setFormErrors((prev) => ({
          ...prev,
          final_date: "La fecha de fin del curso es requerida",
        }));
        return;
      default:
        break;
    }
    
    try {
      dispatch(updateCourse(newCourse))
      toast.success('Curso actualizado correctamente')
    }catch (error) {
      toast.error('Ocurrió un error al crear el curso')
    }

    onClose()
  }

  return (
    <div className="mx-5 mt-6 flex flex-col gap-3">
      <div>
        <label className="text-xs text-blue-gray-300">Profesor</label>
        <Input
          label="Profesor"
          crossOrigin={""}
          disabled={true}
          type="area"
          color="blue-gray"
          placeholder="Profesor"
          value={courseToUpdate?.teacher_name ?? ''}
          onChange={onChangeForm}
        />
      </div>

      <div>
        <Input
          label="Título del curso"
          name="title"
          crossOrigin={""}
          type="text"
          color="blue-gray"
          placeholder="Título"
          required={true}
          value={courseToUpdate?.title}
          onChange={onChangeForm}
        />

        {formErrors.title ? (
          <p className="text-xs text-red-500">{formErrors.title}</p>
        ) : null}
      </div>

      <div>
        <Input
          label="Descripción del curso"
          name="description"
          crossOrigin={""}
          type="area"
          color="blue-gray"
          placeholder="Descripción del curso"
          required={true}
          value={courseToUpdate?.description ?? ''}
          onChange={onChangeForm}
        />

        {formErrors.description ? (
          <p className="text-xs text-red-500">{formErrors.description}</p>
        ) : null}
      </div>

      <div>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="duration"
          options={weeks}
          onChange={(e) => {
            setCourseToUpdate((prev) => ({
              ...prev,
              duration: e?.value ?? "",
            }));
          }}
          placeholder={courseToUpdate?.duration ?? '' + " semanas"}
        />

        {formErrors.duration ? (
          <p className="text-xs text-red-500">{formErrors.duration}</p>
        ) : null}
      </div>
      
      <div className="box-border flex flex-col items-center gap-3">
        <div className="w-full">
          <Input
            label="Fecha de inicio"
            value={courseToUpdate?.initial_date ? new Date(courseToUpdate.initial_date).toISOString().slice(0, 10) : ''}
            name="initial_date"
            crossOrigin={""}
            type="date"
            color="blue-gray"
            required={true}
            onChange={onChangeForm}
            className="flex-1"
            size="md"
          />

          {formErrors.initial_date ? (
            <p className="text-xs text-red-500">{formErrors.initial_date}</p>
          ) : null}
        </div>

        <Input
          label="Fecha de fin"
          value={courseToUpdate?.final_date ?? ''}
          name="final_date"
          crossOrigin={""}
          type="date"
          color="blue-gray"
          required={true}
          onChange={onChangeForm}
          className="flex-1"
          size="md"
          disabled
        />
      </div>

      <div className="mt-6 flex w-full justify-end gap-2 pr-4">
        <Button placeholder={""} className=" h-fit" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          placeholder={""}
          className="mb-4 h-fit bg-blue-600"
          onClick={onSubmit}
        >
          Actualizar
        </Button>
      </div>
    </div>
  );
};

export default EditCourseForm;
