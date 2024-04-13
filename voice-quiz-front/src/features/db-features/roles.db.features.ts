import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { UserRol } from "../../class/user-rol.class";

export const getRol = createAsyncThunk('user/getUserRol',
    async(rolID:string) => {
        if (rolID) {
            try {
                const { data: Roles } = await supabase.from('ROLES').select('*').eq( "ID", rolID); 
                return Roles && Roles[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
)

const users_roles_Slice = createSlice({
    name:"users_roles_slice",
    initialState:{
        rol:{} as UserRol, 
        rolLoading:false as boolean, 
    },
    reducers:{
        setLoadingUserDB: (state, action) => {
            state.rolLoading = action.payload
        }, 
        clearUserData: (state) => {
            state.rol = {} as UserRol;
            state.rolLoading = false;
        } 
    },
    extraReducers:(builder) => {
        builder
        .addCase(getRol.pending, (state) => {
            state.rolLoading = true
        })
        .addCase(getRol.fulfilled, (state, action) => {
            state.rolLoading = false
            state.rol = action.payload; 
        })
    }
})
export const { clearUserData, setLoadingUserDB } = users_roles_Slice.actions; 
export default users_roles_Slice.reducer; 