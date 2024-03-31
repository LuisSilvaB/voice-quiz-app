import { createAsyncThunk, createSlice, nanoid,  } from "@reduxjs/toolkit";
import { fragmentShape, kindQuestion, question } from '../interface/types';
import { multipleAnswers, quetionsMultipleAnswers } from "../interface/questions-response/multiple-answers";

export const submitFragment = createAsyncThunk('fragments/submitFragments', async (payload: { fragment: fragmentShape, kindquestion: kindQuestion }) => {
    const { fragment, kindquestion } = payload;
    try{
        const formData = new FormData();
        formData.append('kindquestion', kindquestion); // Nombre de la sesión
        formData.append('documents', new Blob([fragment.content], { type: 'text/plain' }), 'transcript.txt');  
        const textToSend = await fragment.content.toString()
        console.log('Texto obtenido del componente:', textToSend)
        const response = await fetch('http://127.0.0.1:8000/api/docs/v2', {
            method: 'POST',
            body: formData
          });
          if (!response.ok) {
            throw new Error('Error al enviar la transcripción');
          }
          const data = await response.json();
          console.log('Transcripción enviada correctamente:', data);
          return { data , fragment, kindquestion }
    }
    catch(err){
        console.error(err);
    }
})


const fragmentsSlice = createSlice({
    name: 'fragments',
    initialState: {
        loading: false as boolean,
        audioUrl: '' as string,
        transcription: '' as string,
        fragments: [
            // {
            //     id: '1',
            //     content: 'Construirás un pequeño juego de tres en raya durante este tutorial. Este tutorial no asume ningún conocimiento existente de React. Las técnicas que aprenderá en el tutorial son fundamentales para crear cualquier aplicación React, y comprenderlas por completo le brindará una comprensión profunda de React.',
            // }
            {
                id:"2" ,
                content:"Hace tiempo que la inteligencia artificial abandonó el espectro de la ciencia ficción para colarse en nuestras vidas y, aunque todavía en una fase muy inicial, está llamada a protagonizar una revolución equiparable a la que generó Internet. Sus aplicaciones en múltiples sectores —como salud, finanzas, transporte o educación, entre otros— han provocado que la Unión Europea desarrolle sus propias Leyes de la Robótica."
            }
        ] as fragmentShape[], 
        targetFragment: {} as fragmentShape,
    }, 
    reducers:{
        setLoading: (state, action) =>{
            state.loading = action.payload;
        },
        setTargetFragment: (state, action) =>{
            state.targetFragment = action.payload as fragmentShape
        },
        clearTargetFragment: (state) => {
            state.targetFragment = {} as fragmentShape; 
        },
        setFragments:(state, action) => {
            state.fragments = action.payload as fragmentShape[]
        },  
        clearFragments:(state) => {
            state.fragments = [] as fragmentShape[]
        },
        clearAllStates:(state) => {
            state.loading = false;
            state.audioUrl = '' as string;
            state.transcription = '' as string;
            state.fragments = [] as fragmentShape[];
            state.targetFragment = {} as fragmentShape; 
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase( submitFragment.rejected, (state) => {
            state.loading = false;
        })
        .addCase( submitFragment.pending, (state) => {
            state.loading = true;
        })
        .addCase(submitFragment.fulfilled, (state, action) => {
            const jsonData:multipleAnswers[] = JSON.parse(action.payload?.data.data);
            const newQuestions: question[] = jsonData[0].questions?.map((question: quetionsMultipleAnswers) => ({
                id:nanoid(),
                questionTitle: question.questionTitle,
                alternatives: question.alternatives,
                answer: question.answer,
                kindQuestion: action.payload?.kindquestion ?? "multiple_answer" 
            }));
        
            const newFragment: fragmentShape = {
                id: action.payload?.fragment.id || '',
                content: action.payload?.fragment.content || '',
                title: jsonData[0].title || '', 
                questions: [...action.payload?.fragment?.questions ?? [], ...newQuestions]
            };
        
            state.loading = false;
            state.fragments = state.fragments.map((fragment) => fragment.id === newFragment.id ? newFragment : fragment);
            state.targetFragment = newFragment;
        })  
    }
})


export const { setTargetFragment, clearTargetFragment, setFragments, clearFragments } = fragmentsSlice.actions
export default fragmentsSlice.reducer;