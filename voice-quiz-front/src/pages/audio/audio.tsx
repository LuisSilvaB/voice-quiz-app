import AudioRecorder from '../../components/audioRecorder/audioRecorder'
import SpeechToText from '../../components/audioRecorder/audioRecorderNav'
import AudioUploader from '../../components/audioRecorder/audioUploader'

const Audio = () => {
  return (
    <div className='relative box-border flex h-full w-full flex-col items-center justify-center text-black lg:mt-24 lg:flex-col'>

        <h1 className='text-black text-center'>Audio-page</h1>
        <AudioRecorder/>
        <p className='text-black' >--------------------------------------------------</p>
        <AudioUploader/>
        <p className='text-black' >--------------------------------------------------</p>
        <SpeechToText/>
    </div>
        
  )
}

export default Audio