import { useEffect } from 'react';
import CourseClass from '../../../../class/course.class';
import { nanoid } from '@reduxjs/toolkit';
import ClassesMock from '../../mock/class.mock.json'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; 
import { setCourses, clearCourses, setTargetCourse, clearTargetCourse, setIsOpenModal, setTypeModal } from '../../../../features/class-record';
import { RootState } from '../../../../app/store';  
import { Button } from '@material-tailwind/react';

import EditCourseModal from './course-card/edit-course.modal';
import DeleteCourseModal from './course-card/delete-course.modal';
import CourseCard from './course-card/course-card';
import CreateCourseModal from './create-course.modal';


interface Props {

}

const CursesList:React.FC<Props> = () => {
  const dispatch = useDispatch(); 
  const classSelector = useSelector((state: RootState)=> state.course)
  const handleOpenOptions = (id:string) => {
      if (id === classSelector.classRecordTarget.id) dispatch(clearTargetCourse()) 
      else {
      const targetClass = classSelector.classRecords.find((target) => target.id === id)
      if (targetClass) dispatch(setTargetCourse(targetClass)) 
    }
  }
  const handleCreatClass = () => {
    dispatch(setTypeModal("create"))
    dispatch(setIsOpenModal(true))
  }
  useEffect(()=>{
    const getClasses:CourseClass[] = ClassesMock.dashboardCourses.map(item =>(
      {
        id: item.id,
        title: item.title,
        createAt: item.createAt,
        placeholderImg: item.placeholderImg,
        sessions: item.sessions.map( session => ({
          id: nanoid(),
          title: session.title,
          createAt: session.createAt,
          placeholderImg: session.placeholderImg
        }))
      }
    )) 
    dispatch(setCourses(getClasses));
    return () => {dispatch(clearCourses())}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div className="flex flex-col h-fit justify-start items-start lg:p-10">
      <div className='w-full flex justify-between items-center pr-4 pb-4'>
        <div>
          <p className='font-bold text-4xl font-montserrat'>Lista de cursos</p>
        </div>
        <Button placeholder={""} className='bg-green-600' onClick={handleCreatClass}>
          Añadir nuevo curso + 
        </Button>
      </div>
      <section className="my-auto flex h-fit max-h-[75vh] flex-1 flex-wrap items-start justify-start gap-3 overflow-y-auto lg:justify-start px-auto right-0 left-0 border">
        {classSelector.classRecords.map((item, index) => (
          <CourseCard
            handleOpenOptions={handleOpenOptions}
            targetClassRecord={classSelector.classRecordTarget}
            key={index}
            id={item.id}
            placeholderImg={item.placeholderImg}
            title={item.title}
            sessions={item.sessions}
            createAt={item.createAt}
          />
        ))}
      </section>
      <CreateCourseModal />
      <EditCourseModal />
      <DeleteCourseModal />
    </div>
  );
}

export default CursesList; 