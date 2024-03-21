import { createSlice,  } from "@reduxjs/toolkit";



const fragmentsSlice = createSlice({
    name: 'fragments',
    initialState: {
        loading: false,
        audioUrl: '' as string,
        transcription: '' as string,
        transcriptions: [] as string[],
    }, 
    reducers:{
        setLoading: () =>{},
    },
})

export default fragmentsSlice.reducer;