import React from 'react'
import AudioRecorder from '../../components/audioRecorder/audioRecorder'
import SpeechToText from '../../components/audioRecorder/audioRecorderNav'
import AudioUploader from '../../components/audioRecorder/audioUploader'

const Audio = () => {
  return (
    <>
        <h1 className='text-black text-center'>Audio-page</h1>
        <AudioRecorder/>
        <p className='text-black' >--------------------------------------------------</p>
        <AudioUploader/>
        <p className='text-black' >--------------------------------------------------</p>
        <SpeechToText/>
    </>
        
  )
}

export default Audio