import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const generateQuestions = createAsyncThunk("questions/generateQuestions",
    async () => {return }, 
)

const questionsSlice = createSlice({
    name: 'questions',
    initialState: {},
    reducers:{
        setLoading: () =>{},
    }
})