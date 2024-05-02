import { createAsyncThunk, createSlice  } from "@reduxjs/toolkit";
import { kindQuestion } from '../interface/types';
import { Fragment } from '../class/fragments';
import { supabase } from "../config/config";
import { Question } from '../class/questions.class';

export const createFragment = createAsyncThunk('fragments/createFragment', async(fragment:Fragment) => {
    try{
        await supabase.from('FRAGMENTS').insert([fragment])
        const { data } =  await supabase.from('FRAGMENTS').select("*").eq("SESSION_ID", fragment.SESSION_ID)
        return data as Fragment[]
    }catch(e){
        console.error("x", "fragmento no creado")
    }
})

export const getFragments = createAsyncThunk('fragments/getFragments', async(sessionId:string) => {
    try{
        const { data } = await supabase.from('FRAGMENTS').select("*").eq("SESSION_ID", sessionId)
        return data as Fragment[]
    }catch(e){
        console.error("Error al obtener los fragmentos")
    }
})



export const createQuestions = createAsyncThunk('fragments/submitFragments', async (payload: { fragment: Fragment, kindquestion: kindQuestion }) => {
    const { fragment, kindquestion } = payload;
    try{
        const formData = new FormData();
        formData.append('kindquestion', kindquestion); // Tipo de pregunta
        formData.append('documents', new Blob([fragment.content], { type: 'text/plain' }), 'transcript.txt'); // Envio del documento del fragmento
        const response = await fetch('http://127.0.0.1:8000/api/docs/v2', {
            method: 'POST',
            body: formData
          });
          if (!response.ok) {
            throw new Error('Error al enviar la transcripción');
          }
          const questions = await response.json();
          Array.isArray(questions) && questions.map(async(question) => {
            await supabase
              .from("QUESTIONS")
              .insert([
                {
                  ...question,
                  type: kindquestion,
                },
              ])
              .select("*");
          })
            const { data } = await supabase
                .from("QUESTIONS")
                .select("*")
                .eq("FRAGMENT_ID", fragment.ID);

          return data as Question[] 
    }
    catch(err){
        console.error(err);
    }
})


export const getQuestions = createAsyncThunk('fragments/getQuestions', async(fragment:Fragment) => {
    try{
        const { data } = await supabase.from('QUESTIONS').select("*").eq("FRAGMENT_ID", fragment.ID)
        return data as Question[]
    }catch(e){
        console.error("Error al obtener las preguntas")
    }
})

const fragmentsSlice = createSlice({
    name: 'fragments',
    initialState: {
        loading: false as boolean,
        audioUrl: '' as string,
        transcription: '' as string,
        fragments: [] as Fragment[],
        fragmentLoading: false as boolean,  
        fragmentsLoading: false as boolean,  
        targetFragment: {} as Fragment,
        questions: [] as Question[]
    }, 
    reducers:{
        setLoading: (state, action) =>{
            state.loading = action.payload;
        },
        setTargetFragment: (state, action) =>{
            state.targetFragment = action.payload as Fragment
        },
        clearTargetFragment: (state) => {
            state.targetFragment = {} as Fragment; 
        },
        setFragments:(state, action) => {
            state.fragments = action.payload as Fragment[]
        },  
        clearFragments:(state) => {
            state.fragments = [] as Fragment[]
        },
        clearAllStates:(state) => {
            state.loading = false;
            state.audioUrl = '' as string;
            state.transcription = '' as string;
            state.fragments = [] as Fragment[];
            state.questions = [] as Question[]
            state.targetFragment = {} as Fragment; 
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase( createQuestions.rejected, (state) => {
            state.loading = false;
        })
        .addCase( createQuestions.pending, (state) => {
            state.loading = true;
        })
        .addCase( createQuestions.fulfilled, (state, action) => {
            const jsonData = JSON.parse(JSON.stringify(action.payload as Question[]));
            state.questions = jsonData as Question[];
            state.loading = false;
        })  
        //createFragment
        .addCase(createFragment.pending, (state) => {
            state.fragmentsLoading = true; 
            state.fragmentLoading = true;
        })
        .addCase(createFragment.fulfilled, (state, action) => {
            state.fragmentsLoading = true;
            state.fragmentLoading = false; 
            state.fragments = action.payload as Fragment[]
        })
        // getFragment
        .addCase(getFragments.pending, (state) => {
            state.fragmentsLoading = true; 
        })
        .addCase(getFragments.fulfilled, (state, action) => {
            state.fragmentsLoading = false; 
            state.fragments = action.payload as Fragment[]
        })
    }
})


export const { setTargetFragment, clearTargetFragment, setFragments, clearFragments } = fragmentsSlice.actions
export default fragmentsSlice.reducer;