import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { toast } from "sonner";
import { Result } from "../../class/questions.class";

export const getResultsByQuizId = createAsyncThunk( 
  'user/getResults',
  async (quizId: string) => {
    try {
      const { data } = await supabase
        .from("RESULTS")
        .select("*")
        .eq("QUIZ_ID", quizId);
      return data;
    } catch (error) {
      toast.error("Error al obtener los resultados");
    }
  }
)


const resultsSlice = createSlice({
  name: 'results_slice',
  initialState: {
    results: [] as Result[],
    resultsLoading: false as boolean,
  },
  reducers:{
    setResultsToggle: (state) =>{
      state.resultsLoading = !state.resultsLoading;
    },
  },

})

export const { setResultsToggle } = resultsSlice.actions;
export default resultsSlice.reducer;