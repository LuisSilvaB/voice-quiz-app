import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import { Quiz, QuizQuestion, QuizType } from '../../class/quiz.class';
import { supabase } from "../../config/config";
import { v4 } from "uuid";
import { toast } from "sonner";

export const createQuiz = createAsyncThunk(
  "quiz/setLocalQuiz",
  async ({ quiz, questionsID }: { quiz: Quiz; questionsID: string[] }) => {
    try {
      const { data } = await supabase.from("QUIZZES").insert([quiz]).select('*');
      if (data && questionsID.length) {
        const newQuizQuestions:QuizQuestion[] = questionsID.map((questionID:string) => ({
          QUESTION_ID: questionID,
          QUIZ_ID: quiz.ID,
          ID: v4(),
        }));
        const { data:quizQuestions } = await supabase.from("QUIZ_QUESTION").insert(newQuizQuestions).select('*'); 
        data && data[0] && quizQuestions?.length && toast.success("Cuestionario creado correctamente")
        return {
          data: data[0] as Quiz,
          quizQuestions: quizQuestions as QuizQuestion[],
        }
      }
      else {
        data && data[0] && toast.success("Cuestionario creado correctamente")
        return {
          data: data?.[0] as Quiz ?? ({} as Quiz),
          quizQuestions: [] as QuizQuestion[],
        };
      }
    } catch (e) {
      console.error("Error al crear el cuestionario: ", e);
    }
  },
);

export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async ({quizFormContent, questionsID} : {quizFormContent:Quiz, questionsID:string[]}) => {
    if (quizFormContent) {      
      try {
        const { data } = await supabase.from("QUIZZES").update(quizFormContent).eq("ID", quizFormContent.ID).select();
        if(data){
          const { data: quizQuestions } = await supabase
            .from("QUIZ_QUESTION")
            .select("*")
            .eq("QUIZ_ID", data[0].ID );
          if (quizQuestions?.length) {

            const quizQuiestionsToCreate = questionsID.filter(
              (questionID: string) =>
                !quizQuestions.some(
                  (quizQuestion: QuizQuestion) =>
                    quizQuestion.QUESTION_ID === questionID,
                ),
            ).map((questionId:string) =>({
              ID:v4(), 
              QUESTION_ID: questionId, 
              QUIZ_ID:quizFormContent.ID,
            })); 
           

            const quizQuiestionsToDelete = quizQuestions.filter(
              (quizQuestions: QuizQuestion) =>
                !questionsID.some(
                  (questionID: string) =>
                    questionID === quizQuestions.QUESTION_ID,
                ),
            ); 
            
            await supabase
              .from("QUIZ_QUESTION")
              .insert(quizQuiestionsToCreate)
              .select("*"); 
            
            
            await supabase
              .from("QUIZ_QUESTION")
              .delete()
              .in(
                "ID",
                quizQuiestionsToDelete.map(
                  (quizQuestions: QuizQuestion) => quizQuestions.ID,
                ),
              ); 
          }else{
            const quizQuiestionsToCreate: QuizQuestion[] = questionsID.map(
              (questionId: string) => ({
                ID: v4(),
                QUESTION_ID: questionId,
                QUIZ_ID: data[0].ID,
              }),
            );
            await supabase
              .from("QUIZ_QUESTION")
              .insert(quizQuiestionsToCreate)
              .select("*");
          }
           toast.success("Cuestionario actualizado")
        }
        return data as Quiz[];
      } catch (e) {
        console.error("Error al actualizar el cuestionario: ", e);
      }
    }
    else{
      return [] as Quiz[]
    }
  },
);

export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz", async(quiz:Quiz)=>{
    await supabase.from("QUIZ_QUESTION").delete().eq("QUIZ_ID", quiz.ID);
     await supabase.from("QUIZZES").delete().eq("ID", quiz.ID);
     const { data } = await supabase.from("QUIZZES").select("*").eq("SESSION_ID", quiz.SESSION_ID)
     return data as Quiz[]
  }
)

export const getQuizListbySessionID = createAsyncThunk(
  "quiz/getQuizbySessionID",
  async (sessionID:string) => {
    if(sessionID){
      try {
        const { data } = await supabase.from("QUIZZES").select("*").eq("SESSION_ID", sessionID)
        return data as Quiz[]
      } catch (e) {
        console.error("Error al obtener los cuestionarios: ", e);
      }
    }
    else{
      return [] as Quiz[]
    }
  },
);

export const getQuizQuiestionsByQuizID = createAsyncThunk(
  "quiz/getQuizQuiestions", 
  async (quizID: string) => {
    if (quizID && quizID.length) {
      try{
        const { data } = await supabase.from("QUIZ_QUESTION").select("*").eq("QUIZ_ID", quizID)
        return data as QuizQuestion[]
      }catch (e){
        console.error(e)
      }
    } 
  }
)


const quizSlice = createSlice({
  name:'quiz',
  initialState:{
    localquiz:{} as Quiz,
    globalquiz:{} as Quiz,
    typeQuiz: undefined as QuizType | undefined,
    quizLoading: false as boolean,
    quizList: [] as Quiz[],
    quizQuiesions: [] as QuizQuestion[],
    quizQuestionsLoading: false as boolean
  },
  reducers:{
    setLocalQuiz: (state, action) => {
      state.localquiz = action.payload as Quiz
    },
    clearLocalQuiz: (state) => {
      state.localquiz = {} as Quiz;
    },
    setGlobalQuiz: (state, action) => {
      state.globalquiz = action.payload as Quiz
    },
    clearGlobalQuiz: (state) => {
      state.globalquiz = {} as Quiz;
    },
    setTypeQuiz: (state, action) => {
      state.typeQuiz = action.payload as QuizType
    },
    clearTypeQuiz: (state) => {
      state.typeQuiz = undefined as QuizType | undefined;
    },
    clearQuizQuestions: (state) => {
      state.quizQuiesions = [] as QuizQuestion[]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuizListbySessionID.pending, (state) => { 
        state.quizLoading = true;
      })
      .addCase(getQuizListbySessionID.fulfilled, (state, action) => {
        state.quizLoading = false;
        state.quizList = action.payload as Quiz[];
      })
      .addCase(getQuizListbySessionID.rejected, (state) => {
        state.quizLoading = false;
      })
      .addCase(getQuizQuiestionsByQuizID.pending, (state) => {
        state.quizQuestionsLoading = true;
      })
      .addCase(getQuizQuiestionsByQuizID.fulfilled, (state, action) => {
        state.quizQuestionsLoading = false;
        state.quizQuiesions = action.payload as QuizQuestion[]
      })
      .addCase(getQuizQuiestionsByQuizID.rejected, (state) => {
        state.quizQuestionsLoading = true;
      })
      .addCase(deleteQuiz.pending, (state) => { 
        state.quizLoading = true;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizList = action.payload as Quiz[]
      })
  },
})

export const { setLocalQuiz, clearLocalQuiz, setGlobalQuiz, clearGlobalQuiz, clearQuizQuestions } = quizSlice.actions;
export default quizSlice.reducer;