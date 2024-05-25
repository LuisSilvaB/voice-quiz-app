import { AppDispatch, RootState } from "../../../../../app/store";
import InputRecognition from "../../../../../components/shared/transcription-input/transcription-input-recognition"
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "../../../../../class/fragments";
import { getQuestions } from "../../../../../features/fragments.features";
import { Question } from "../../../../../class/questions.class";
import { useEffect, useState, useCallback } from "react";
import { Button, Chip } from "@material-tailwind/react";
import QuestionsList from "./questions/questions-list";
import QuestionsEmpty from "./questions/questions-empty";
import { supabase } from "../../../../../config/config";
import QuestionsPresentationModal from "./questions/questions-presentation-modal";
import useToggle from "../../../../../hooks/useToggle";
import QuizSessionOptions from "../../../quizzes/quiz-session-options/quiz-menu-oiptions";

const TranscriptionRealTime = () => {
  const targetFragment = useSelector((state:RootState) => state.fragments.targetFragment); 
  const questions = useSelector((state:RootState) => state.fragments.questions); 
  const currentUser = useSelector((state:RootState) => state.users.user); 
  const dispatch = useDispatch<AppDispatch>()
  const toggleQuestionsPermission = useToggle()
  // const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [reverseQuestions, setResverseQuestions] = useState<Question[]>([])
    const onReverseQuestions = useCallback(() => {
    if (questions) {      
      const reverseArray: Question[] = [];
      for (let i = questions.length - 1; i >= 0; i--) {
        reverseArray.push(questions[i]);
      }
      setResverseQuestions(reverseArray)
    }
  }, [questions]);

  useEffect(() => {
    onReverseQuestions()
  },[onReverseQuestions])

  const fragment = targetFragment ?? ""

  useEffect(()=> {

    const subscribeUpdateChannel = supabase
    .channel("insert-questions")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "QUESTIONS" },
      (payload) => {
        if (currentUser && (payload.new.USER_ID === currentUser?.ID) && fragment.ID.length) {
          dispatch(
            getQuestions(fragment),
          );
        }
      },
    ).subscribe();

    return () => {
      subscribeUpdateChannel.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[fragment])
  
  useEffect(()=>{
    const fragment:Fragment = targetFragment
    if (fragment){
      dispatch(getQuestions(fragment))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[targetFragment])
    
  return (
    <div className="flex w-full flex-1 items-center justify-center gap-2 p-4 pt-0 text-black">
      <div className="flex h-full max-h-[80vh] w-full flex-1 flex-row gap-4 rounded-xl p-4 text-2xl">
        <InputRecognition />

        <div className="box-border flex w-full flex-col">
          <div className="flex w-full flex-col items-center justify-between pb-2 pt-4">
            <div className="flex w-full flex-col items-center justify-between lg:flex-row">
              <div className="flex flex-row items-center gap-2 rounded-md bg-gray-200 p-2">
                <h3 className="text-sm font-medium">Fragmento: </h3>
                <Chip
                  color="deep-purple"
                  variant="ghost"
                  value={
                    targetFragment.ID
                      ? targetFragment.ID
                      : "Seleccione un fragmento"
                  }
                  className=""
                ></Chip>
              </div>
              <div className="flex w-full flex-row justify-end items-center gap-2">
                {questions && questions.length ? (
                  <Button
                    placeholder={""}
                    className="flex w-fit h-fit justify-center gap-2"
                    size="md"
                    color="deep-purple"
                    variant="outlined"
                    onClick={toggleQuestionsPermission.onToggle}
                  >
                    Presentar preguntas
                  </Button>
                ) : null}
                {questions && questions.length ? (
                  <QuizSessionOptions questions={reverseQuestions} />
                ) : null}
              </div>
            </div>
          </div>
          {!targetFragment.ID || (questions && !questions.length) ? (
            <QuestionsEmpty />
          ) : (
            <QuestionsList questions={reverseQuestions} />
          )}
        </div>
      </div>

      {toggleQuestionsPermission.isOpen ? (
        <QuestionsPresentationModal
          questions={questions}
          questionClear={() => {}}
          {...toggleQuestionsPermission}
        />
      ) : null}
    </div>
  );
}

export default TranscriptionRealTime