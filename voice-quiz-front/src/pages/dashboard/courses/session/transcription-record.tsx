import TranscriptionInput from '../../../../components/shared/transcription-input/transcription-input-usellm';

const TranscriptionRecord = () => {

  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-4 pt-0 text-black">
      <div className="flex h-full w-full flex-row gap-4 rounded-xl p-4 text-2xl font-semibold">
        <TranscriptionInput />
        <div className='w-full flex flex-col'>
          <h3 className='text-lg'>Generación de preguntas</h3>
          <div className="h-full min-h-max w-full rounded-lg border"></div>
        </div>
      </div>
    </div>
  );
}

export default TranscriptionRecord;
