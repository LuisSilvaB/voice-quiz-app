import { Button, Input } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";
import { Course } from "../../../../../../class/course.class";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { toast } from "sonner";
import Select from 'react-select'
import { useDispatch } from "react-redux";
import { createCourse } from '../../../../../../features/db-features/courses.features';

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

const CreateCourseForm:React.FC<Props> = ({
  onClose
}) => {
  const currentUser = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch<AppDispatch>();
  const [course, setCourse] = useState<Course>({
    created_at: new Date(),
    description: "",
    title: "",
    duration: "",
    requirements: [],
    teacher_name: currentUser?.name,
    students_count: 0,
    sessions_count: 0,
    initial_date: '',
    final_date: '',
    user_id: currentUser?.ID,
    ID: v4(),
  });

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
  
    setCourse({
      ...course,
      [name]: value,
    });


    if (course.title && course.title?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        title: null,
      }));
    } if (course.description && course.description?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        description: null,
      }));
    } if (course.duration && course.duration?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        duration: null,
      }));
    } if (course.initial_date && course.initial_date?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        initial_date: null,
      }));
    } if (course.final_date && course.final_date?.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        final_date: null,
      }));
    }
  
  };

  const getFinalDate = () => {
    const initialDate = new Date(course.initial_date ?? '');
  
      if (isNaN(initialDate.getTime())) {
        return;
      }
  
      const durationInWeeks = parseInt(course.duration ?? '', 10);
  
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
  
      setCourse((prev) => ({
        ...prev,
        final_date: finalDateString,
      }));
  }

  useEffect(() => {
    getFinalDate()
    if (course.duration) setFormErrors((prev) => ({ ...prev, duration: null }));
    if (course.initial_date) setFormErrors((prev) => ({ ...prev, initial_date: null }));
  }, [course.duration, course.initial_date])

  const onSubmit = () => {
    const newCourse:Course = {
      ...course,
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
      dispatch(createCourse(newCourse))
      toast.success('Curso creado correctamente')
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
          value={currentUser?.name}
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
            setCourse((prev) => ({
              ...prev,
              duration: e?.value ?? "",
            }));
          }}
        />

        {formErrors.duration ? (
          <p className="text-xs text-red-500">{formErrors.duration}</p>
        ) : null}
      </div>

      <div className="box-border flex flex-col items-center gap-3">
        <div className="w-full">
          <Input
            label="Fecha de inicio"
            name="initial_date"
            crossOrigin={""}
            type="date"
            color="blue-gray"
            placeholder="Título"
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
          name="final_date"
          value={course.final_date}
          crossOrigin={""}
          type="date"
          color="blue-gray"
          placeholder="Título"
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
          className="mb-4 h-fit bg-green-600"
          onClick={onSubmit}
        >
          Crear
        </Button>
      </div>
    </div>
  );
};

export default CreateCourseForm;
