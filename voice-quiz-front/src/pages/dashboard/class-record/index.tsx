import { useEffect } from 'react';
import ClassRecord from '../../../class/class-record.class';
import { nanoid } from '@reduxjs/toolkit';
import ClassCard from './class-card/class-card';
import ClassesMock from '../mock/class.mock.json'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; 
import { setClassRecords, clearClassRecords, setTargetClassRecord, clearTargetClassRecord, setIsOpenModal, setTypeModal } from '../../../features/class-record';
import { RootState } from '../../../app/store';  
import EditClassModal from './class-card/edit-class.modal';
import DeleteClassModal from './class-card/delete-class.modal';
import { Button } from '@material-tailwind/react';
import CreateClassModal from './create-class.modal';
interface Props {

}

const ClassRecords:React.FC<Props> = () => {
  const dispatch = useDispatch(); 
  const classSelector = useSelector((state: RootState)=> state.classRecord)
  const handleOpenOptions = (id:string) => {
      if (id === classSelector.classRecordTarget.id) dispatch(clearTargetClassRecord()) 
      else {
      const targetClass = classSelector.classRecords.find((target) => target.id === id)
      if (targetClass) dispatch(setTargetClassRecord(targetClass)) 
    }
  }
  const handleCreatClass = () => {
    dispatch(setTypeModal("create"))
    dispatch(setIsOpenModal(true))
  }
  useEffect(()=>{
    const getClasses:ClassRecord[] = ClassesMock.dashboardClasses.map(item =>(
      {
        id: nanoid(),
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
    dispatch(setClassRecords(getClasses));
    return () => {dispatch(clearClassRecords())}
  },[])
  return (
    <div className="flex flex-col h-fit justify-start items-start lg:p-10">
      <div className='w-full flex justify-end pr-4 pb-4'>
        <Button placeholder={""} className='bg-green-600' onClick={handleCreatClass}>
          Añadir nueva clase + 
        </Button>
      </div>
      <section className="my-auto flex h-fit max-h-[80vh]  flex-1 flex-wrap items-start justify-start gap-3 overflow-y-auto border p-4 lg:justify-center">
        {classSelector.classRecords.map((item, index) => (
          <ClassCard
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
      <CreateClassModal />
      <EditClassModal />
      <DeleteClassModal />
    </div>
  );
}

export default ClassRecords; 