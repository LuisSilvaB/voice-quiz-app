import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { Session } from "../../class/sessions";
import { Question } from "../../class/questions.class";
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
        return data as Question[]
    }
})

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
