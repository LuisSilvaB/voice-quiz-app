import { useEffect } from 'react';
import { Course } from '../../../../class/course.class';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; 
import { AppDispatch, RootState } from '../../../../app/store';  
import { Button } from '@material-tailwind/react';
import { setTypeModal, setToggleModal } from '../../../../features/db-features/courses.features';

import EditCourseModal from './course-card-modals/edit-course/edit-course.modal';
import DeleteCourseModal from './course-card-modals/delete-course.modal';
import CourseCard from './course-card/course-card';
import CreateCourseModal from './course-card-modals/create-course/create-course.modal';
import { Toaster } from 'sonner';

import { supabase } from '../../../../config/config';
import { getAllCourses } from '../../../../features/db-features/courses.features';

interface Props {

}

const CursesList:React.FC<Props> = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const newCoursesStore = useSelector((state: RootState) => state.courses)
  const userStore = useSelector((state: RootState) => state.users)
 
  const handleCreatClass = () => {
    dispatch(setTypeModal("create"))
    dispatch(setToggleModal())
  }


  useEffect(()=>{
    console.log('first fetch')
    dispatch(getAllCourses(userStore.user?.ID ?? ''))
  },[])

  useEffect(() => {
    const subscribeChannel = supabase
      .channel("insert-courses")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "COURSES",
        },
        (payload) => {
          if (payload.new.user_id === userStore.user?.ID) {
            console.log('refetch')
            dispatch(getAllCourses(userStore.user?.ID ?? ''))
          }
        }
      )
      .subscribe();

      const subscribeUpdateChannel = supabase
        .channel("update-courses")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "COURSES" },
          (payload) => {
            if (payload.new.user_id === userStore.user?.ID) {
              console.log('refetch')
              dispatch(getAllCourses(userStore.user?.ID ?? ''))
            }
          },
        ).subscribe();

        const subscribeDeleteChannel = supabase
        .channel("delete-course")
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "COURSES" },
          (payload) => {
            console.log(payload)
            // if (payload.new.user_id === userStore.user?.ID) {
            //   console.log('refetch')
            //   dispatch(getAllCourses(userStore.user?.ID ?? ''))
            // }
          },
        ).subscribe();
  
    // Limpiar la suscripción al desmontar el componente
    return () => {
      subscribeChannel.unsubscribe();
      subscribeUpdateChannel.unsubscribe();
      subscribeDeleteChannel.unsubscribe();
      // dispatch(clearCourses());
    };
  }, [dispatch, userStore.user?.ID]);


  return (
    <div className="flex h-fit w-full flex-col items-start justify-start lg:p-10">
      <div className="flex w-full items-center justify-between pb-4 pr-4">
        <div>
          <p className="font-montserrat text-4xl font-bold">Lista de cursos</p>
        </div>
        <div className="flex gap-2">
          <Button
            placeholder={""}
            className="bg-blue-gray-300"
            loading={newCoursesStore.coursesLoading}
          >
            Cursos
          </Button>
          <Button
            placeholder={""}
            className="bg-green-600"
            onClick={handleCreatClass}
          >
            Añadir nuevo curso +
          </Button>
        </div>
      </div>
      <section className="px-auto left-0 right-0 my-auto flex h-fit max-h-[75vh] flex-1 flex-wrap items-start justify-start gap-3 overflow-y-auto lg:justify-start">
        {newCoursesStore.courses
          ? newCoursesStore.courses?.map((course: Course, index) => (
              <CourseCard key={index} {...course} />
            ))
          : null}
      </section>
      <CreateCourseModal />
      <EditCourseModal />
      <DeleteCourseModal />
      <Toaster richColors />
    </div>
  );
}

export default CursesList; 