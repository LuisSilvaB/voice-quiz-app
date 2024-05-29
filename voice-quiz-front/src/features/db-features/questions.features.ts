import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { Session } from "../../class/sessions";
import { Answer, Question, Result } from "../../class/questions.class";
import { QuestionResponse } from "../../class/questions.class";
import { v4 } from "uuid";
import { toast } from "sonner";

export const generateQuestions = createAsyncThunk("questions/generateQuestions",
    async () => {return }, 
)

export const createQuestions = createAsyncThunk("questions/createQuestions", async(questions: Question[]) => {
    try{
        questions.forEach(async(question) => {
            await supabase.from('QUESTIONS').insert(question)
        })
        const { data } =  await supabase.from('QUESTIONS').select("*").eq("SESSION_ID", questions[0].SESSION_ID)
        return data as Question[]
    }catch(e){
        console.log(e)
    }
})

export const getAllQuestionbySession = createAsyncThunk("questions/getAllQuestionbySession", async( session:Session ) => {
    if (session) {
        const { data } = await supabase.from("QUESTIONS").select("*").eq("SESSION_ID", session.ID);
        return data 
    }
})

export const getAllQuestionsByQuizIdToApply = createAsyncThunk(
  "quiz/getAllQuestionsByQuizID", 
  async (quizID: string) => {
    if (quizID && quizID.length) {
      try{
        const { data: question } = await supabase
          .from("QUESTIONS")
          .select("question, ID, type, QUIZ_QUESTION!inner(QUIZ_ID)")
          .eq("QUIZ_QUESTION.QUIZ_ID", quizID)
          return question;
      }catch (e){
        console.error(e)
      }
    } 
  }
)

export const getAllAlternativesByQuestionId = createAsyncThunk(
  "quiz/getAllAlternativesByQuestionId", 
  async (questionID: string) => {
    if (questionID && questionID.length) {
      try{
        const { data } = await supabase
          .from("ALTERNATIVES")
          .select("*")
          .eq("QUESTION_ID", questionID)
        return data
      }catch (e){
        console.error(e)
      }
    } 
  }
)

export const reviewQuestions = createAsyncThunk(
  "questions/reviewQuestions", 
  async ({questionResponse, quizId, userID}: {questionResponse: QuestionResponse[], quizId: string, userID: string}) => {
    const scoreByCorrectQuestion:number = 20/ questionResponse.length;
    if (questionResponse && questionResponse.length && quizId.length && userID.length) {
      try{
        const { data: answersByQuestionId } = await supabase
          .from("ANSWERS")
          .select("*")
          .in(
            "QUESTION_ID",
            questionResponse.map((response) => response.QUESTION_ID),
          ); 
        if (answersByQuestionId) {          
          questionResponse.forEach(async (questionResponse: QuestionResponse) => {
            const correctAnswer:Answer = answersByQuestionId.find(
              (answer:Answer) => answer.QUESTION_ID === questionResponse.QUESTION_ID,
            );
            if (correctAnswer && correctAnswer.position === parseInt(questionResponse.position)) {
                const correctResult:Result = { 
                  ID: v4(),
                  ANSWER_ID: correctAnswer.ID,
                  QUESTION_ID: correctAnswer.QUESTION_ID,
                  ALTERNATIVE_ID: questionResponse.ALTERNATIVE_ID,
                  QUIZ_ID: quizId,
                  USER_ID: userID,
                  SCORE: scoreByCorrectQuestion,
                }
                await supabase.from("RESULTS").insert([correctResult]).select('*');
                console.log(correctAnswer, questionResponse,"correcto")
              } else {
                const incorrectResult:Result = { 
                  ID: v4(),
                  ANSWER_ID: correctAnswer.ID,
                  QUESTION_ID: correctAnswer.QUESTION_ID,
                  ALTERNATIVE_ID: questionResponse.ALTERNATIVE_ID,
                  QUIZ_ID: quizId,
                  USER_ID: userID,
                  SCORE: 0,
                }
                await supabase.from("RESULTS").insert([incorrectResult]).select('*');
                console.log(correctAnswer, questionResponse, "incorrecto")
              }
  
          });
          toast.success("Respuestas enviadas correctamente")
        }
      }catch (e){
        toast.error("Error al enviar las respuestas")
      }
    }
  }
)


const questionsSlice = createSlice({
    name: 'questions_slice',
    initialState: {
        questions: [] as Question[],
        questionsLoading: false as boolean,
    },
    reducers:{
        setQuestionsToggle: (state) =>{
            state.questionsLoading = !state.questionsLoading;
        },
    }, 
    extraReducers: (builder) => {
        builder
          .addCase(getAllQuestionbySession.pending, (state) => {
            state.questionsLoading = true;
          })
          .addCase(getAllQuestionbySession.fulfilled, (state, action) => {
            state.questions = action.payload as Question[];
            state.questionsLoading = false;
          })
          .addCase(getAllQuestionbySession.rejected, (state) => {
            state.questionsLoading = false;
          })
          .addCase(createQuestions.pending, (state) => {
            state.questionsLoading = true;
          })
          .addCase(createQuestions.fulfilled, (state, action) => {
            state.questions = action.payload as Question[];
            state.questionsLoading = false;
          })
          .addCase(createQuestions.rejected, (state) => {
            state.questionsLoading = false;
          })
    }
})

export const { setQuestionsToggle } = questionsSlice.actions;

export default questionsSlice.reducer;
