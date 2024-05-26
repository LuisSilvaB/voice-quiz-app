import { supabase } from "../config/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { publicConfig } from "../config/config";

export const signInWithGoogleAsync = createAsyncThunk('userAuth/signInWithGoogleAsync', async () => {
    try{
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider:'google', 
            options: {
                redirectTo:`${publicConfig.front_v1_local}/auth/google/callback`,
            } 
        }); 
        if (error) throw new Error('Ocurrio un error durante la autentificación de usuario');
        return data;
    } catch(error){
        console.error(error)
    }
})
export const singOutWithGoogleAsync = createAsyncThunk('userAuth/singOutWithGoogleAsync', async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error('Ocurrio un error durante la desautentificación de usuario');  
    } catch (error) {
        console.error(error);
    }
})
export const stateChangeGoogleAuth = createAsyncThunk<User | null, void>(
    'userAuth/stateChangeGoogleAuth',
    async () => {
      return new Promise<User | null>((resolve) => {
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            resolve(null);
          } else {
            resolve(session?.user ?? null);
          }
        });
      });
    }
  );
  
  const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState: {
      userAuthInfo: null as User | null,
      authLoading: false,
    },
    reducers: {
      setAuthLoading: (state) => {
        state.authLoading = true;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(
          singOutWithGoogleAsync.fulfilled,
          (state) => {
            state.userAuthInfo = null;
            state.authLoading = false;
          }
        )
        .addCase(
          stateChangeGoogleAuth.pending,
          (state) => {
            state.authLoading = true;
          }
        )
        .addCase(
          stateChangeGoogleAuth.fulfilled,
          (state, action) => {
            state.authLoading = false;
            state.userAuthInfo = action.payload;
          }
        );
    }
  });
  
  export const { setAuthLoading } = userAuthSlice.actions;
  export default userAuthSlice.reducer;