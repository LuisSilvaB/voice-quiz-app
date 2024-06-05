import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../config/config";
import { Rol } from "../../class/rol.class";

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
        rol:{} as Rol, 
        rolLoading:false as boolean, 
    },
    reducers:{
        setRolLoading: (state, action) => {
            state.rolLoading = action.payload
        }, 
        clearRol: (state) => {
            state.rol = {} as Rol;
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
export const { clearRol, setRolLoading } = users_roles_Slice.actions; 
export default users_roles_Slice.reducer; 