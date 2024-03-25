import { RootState } from "../../../../app/store";
import InputRecognition from "../../../../components/shared/transcription-input/transcription-input-recognition"
import { useSelector } from "react-redux";
import { question } from '../../../../interface/types';
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { variants } from "../types";

const TranscriptionRealTime = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<question | null >(null)
  const [reverseQuestions, setResverseQuestions] = useState<question[]>([])
  const targetFrament = useSelector((state:RootState) => state.fragments.targetFragment); 
  const onReverseQuestions = useCallback(() => {
    if (targetFrament.questions) {      
      const reverseArray: question[] = [];
      for (let i = targetFrament.questions.length - 1; i >= 0; i--) {
        reverseArray.push(targetFrament.questions[i]);
      }
      setResverseQuestions(reverseArray)
    }
  }, [targetFrament]);

  useEffect(() => {
    onReverseQuestions()
  },[onReverseQuestions])
    
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-4 pt-0 text-black">
      <div className="flex h-full w-full flex-row gap-4 rounded-xl border p-4 text-2xl font-semibold">
        <InputRecognition />
        <div className="flex w-full flex-col">
          <h3 className="text-lg">Generación de preguntas</h3>
          <div className="flex h-full max-h-[550px] w-full flex-col gap-3 overflow-y-auto rounded-lg border p-3">
            {reverseQuestions?.map((question: question, index: number) => (
              <motion.div
                key={index}
                className="cursor-pointer rounded-lg p-2 transition-all hover:shadow-lg "
                onClick={() => setSelectedQuestion(question)}
              >
                <p className="text-lg">{question.questionTitle}</p>
                <ul>
                  {question.alternatives?.map(
                    (alternative: string, index: number) => (
                      <li className="text-xs" key={index}>
                        {alternative}
                      </li>
                    ),
                  )}
                </ul>
                <div className="rounded-full border-blue-500 p-2">
                  <p className="mt-2 text-xs text-red-200">{question.answer}</p>
                </div>
              </motion.div>
            ))}
            <AnimatePresence>
              {selectedQuestion ? (
                <motion.div
                  variants={variants}
                  layoutId={selectedQuestion.id}
                  className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-[#0f1b4225] opacity-25"
                  onClick={() => setSelectedQuestion(null)}
                >
              <motion.div
                className="cursor-pointer rounded-lg p-2 transition-all hover:shadow-lg bg-white"
              >
                <p className="text-lg">{selectedQuestion.questionTitle}</p>
                <ul>
                  {selectedQuestion.alternatives?.map(
                    (alternative: string, index: number) => (
                      <li className="text-xs" key={index}>
                        {alternative}
                      </li>
                    ),
                  )}
                </ul>
                <div className="rounded-full border-blue-500 p-2">
                  <p className="mt-2 text-xs text-red-200">{selectedQuestion.answer}</p>
                </div>
              </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranscriptionRealTime