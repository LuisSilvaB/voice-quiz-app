import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import { supabase } from '../../config/config';
import { UserRol } from '../../class/user-rol.class';
export const isRegisterUserRolOnDB = createAsyncThunk('userRol/isRegisterRolOnDB', 
    async (userID:string) => {
        if(userID){
            try {
                const { data: ROL } = await supabase.from('USERS_ROLES').select('*').eq('USER_ID',userID)
                if(ROL) return ROL[0]; else return null;
            } catch (error) {
                console.error(error);
            }
        }
});  
export const createUserRol = createAsyncThunk('userRol/createUserRol', 
    async (userRol:UserRol) => {
        if(userRol){
            try {
                const { data } = await supabase.from('USERS_ROLES').insert(userRol).select('*'); 
                return data && data[0]; 
            } catch (error) {
                console.error(error); 
            }
        }
        }
) 

const users_roles_Slice = createSlice({
    name:'user_rol', 
    initialState:{
        user_rol: null as UserRol | null,  
        user_rol_loading: false as boolean,
    },
    reducers:{
        setLoadingUserRol: (state, action) => {
            state.user_rol_loading = action.payload
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(
            isRegisterUserRolOnDB.pending, 
            (state) => {
                state.user_rol_loading = true; 
            }
        )
        .addCase(
            isRegisterUserRolOnDB.fulfilled,
            (state, action) => {
                state.user_rol = action.payload; 
                state.user_rol_loading = false
            }
        )
        .addCase(createUserRol.pending,
            (state)=>{
                state.user_rol_loading = true;
            }
        )
        .addCase(
            createUserRol.fulfilled, 
            (state, action) => {
                state.user_rol = action.payload;
                state.user_rol_loading = false; 
        });
    }
})

export const { setLoadingUserRol } = users_roles_Slice.actions;
export default users_roles_Slice.reducer;