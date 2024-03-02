import { useEffect, useState } from 'react';
import { ClassRecord } from '../../../interface/types';
import ClassCard from './class-card/class-card';
import ClassesMock from '../mock/class.mock.json'
import { nanoid } from '@reduxjs/toolkit';

interface Props {

}

const ClassRecords:React.FC<Props> = () => {
  const [ classes, setClasses ] = useState<ClassRecord[]>([])
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
    setClasses (prevClasses => {
      const newclasses = [
        ...prevClasses, 
        ...getClasses
      ]
      return newclasses
    })
    return () => {setClasses([])}
  },[])
  return (
    <div className='flex flex-1 gap-2 flex-wrap  h-auto border lg:p-10'>
        <section className='flex-1 border p-4 flex justify-center lg:justify-start items-start flex-wrap gap-3 h-fit max-h-[80vh] my-auto overflow-y-auto'>
          {classes.map((item, index) => (
            <ClassCard key={index} id={item.id} placeholderImg={item.placeholderImg} title={item.title} sessions={item.sessions} createAt={item.createAt}/>
          ))}

        </section>
    </div>
  )
}

export default ClassRecords; 