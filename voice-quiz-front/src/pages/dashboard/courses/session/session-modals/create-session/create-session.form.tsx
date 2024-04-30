import { Button, Input } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../app/store";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Session } from '../../../../../../class/sessions';
import { useParams } from "react-router-dom";

import { CgSpinner } from "react-icons/cg";


import { getAllSessions, createSession, clearSessionsData } from "../../../../../../features/db-features/sessions.features";
import { updateCourse } from "../../../../../../features/db-features/courses.features";

interface Props {
  onClose: () => void;
}

const CreateSessionForm:React.FC<Props> = ({
  onClose
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.users.user);
  const currentSessions = useSelector((state: RootState) => state.sessions.sessions);
  const currentCourse = useSelector((state: RootState) => state.courses.course);
  const sessionsLoading = useSelector((state: RootState) => state.sessions.sessionsLoading);
  const params = useParams();
  const [session, setSession] = useState<Session>({
    ID: v4(),
    model: '' ,
    USER_ID: currentUser?.ID,
    COURSE_ID: '',
    created_at: new Date(),
    fragments_count: 0,
    title: '',
  });
  useEffect(() => {
    if (currentSessions || params){
      setSession((prev) => ({
        ...prev,
        COURSE_ID: params.id,
        title:
          `Session ${(currentSessions?.length ?? "session") + 1}`.toUpperCase(),
      }));
    }
  },[currentSessions, sessionsLoading, params])
    
  useEffect(() => {
    dispatch(getAllSessions({
      userId: currentUser?.ID ?? '',
      courseId: params.id ?? ''
    }));

    return () => {
      dispatch(clearSessionsData());
    }
  },[])



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
  
    setSession({
      ...session,
      [name]: value,
    });


  };


  const onSubmit = () => {
    const newSession:Session = {
      ...session,
    }

    switch (true) {
      case !newSession.title || !session.title.length:
        setFormErrors((prev) => ({
          ...prev,
          title: "El título del curso es requerido",
        }));
        return;
      default:
        break;
    }
    
    try {
      dispatch(createSession(session))
      dispatch(
        updateCourse({
          ...currentCourse,
          sessions_count: (currentCourse?.sessions_count ?? 0) + 1,
        })
      )
      setSession({
        ID: v4(),
        model: '' ,
        USER_ID: currentUser?.ID,
        COURSE_ID: params.id,
        created_at: new Date(),
        fragments_count: 0,
        title: '',
      })
      toast.success('Curso creado correctamente')
    }catch (error) {
      toast.error('Ocurrió un error al crear el curso')
    }
    onClose()
  }

  return (
    <div className="mx-5 mt-6 flex flex-col items-center justify-center gap-3">
      {sessionsLoading ? (
        <div className="flex h-40 w-40 items-center justify-center">
          <CgSpinner className="h-auto w-20 animate-spin text-tangaroa-500" />
        </div>
      ) : null}

      {!sessionsLoading ? (
        <div className="w-full">
          <div>
            <label className="text-xs text-blue-gray-300">Profesor</label>
            <Input
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
            <label className="text-xs text-blue-gray-300">
              Nombre de la session
            </label>

            <Input
              disabled
              value={session.title}
              name="title"
              crossOrigin={""}
              type="text"
              color="blue-gray"
              placeholder="Título"
              onChange={onChangeForm}
            />
            {formErrors.title ? (
              <p className="text-xs text-red-500">{formErrors.title}</p>
            ) : null}
          </div>
        </div>
      ) : null}

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

export default CreateSessionForm;
