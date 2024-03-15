import React from 'react'
import { IconButton, Button } from '@material-tailwind/react'
import { IoCopy } from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa'
import TypeWriter from '../type-writer/type-writer'

interface Props {
    transcript: string; 
}

const TranscriptionInput:React.FC<Props> = ({transcript}) => {
  return (
    <div className='w-auto max-h-60 h-full flex flex-col'>
    <h3>Transcripción</h3>
    <div className="flex h-full w-full flex-col rounded-lg border p-4">
      <p className="h-full text-sm font-normal">
        <TypeWriter text={transcript} speed={50} />
      </p>
        <div className="flex w-full gap-2 items-center justify-end">
          <IconButton placeholder={""} className='bg-gray-200' disabled = {transcript ? false :true}>
            <IoCopy className='text-blue-500'/>
          </IconButton>
          <IconButton placeholder={""} className='bg-gray-200' disabled = {transcript ? false :true}>
            <FaTrash className='text-red-500'/>
          </IconButton>
          <Button placeholder={""} disabled = {transcript ? false :true}>Generar preguntas</Button>
        </div>
    </div>
  </div>
  )
}

export default TranscriptionInput