import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import { supabase } from '../../config/config'; 
import { User } from '../../class/user.class';

export const isRegisterOnDB = createAsyncThunk('user/isRegisterOnDB', 
    async(id:string) => {
        if (id) {            
            try {
                const {data: USERS} = await supabase.from("USERS").select('*').eq('ID', id )
                if(USERS && USERS.length >= 1)return USERS[0]; else return null;
            } catch(error){
                console.error(error); 
            }
        }
    }
)
export const registerUserOnDB = createAsyncThunk('user/registerUserOnDB', 
    async(user:User) => {
        try {
            const { data } = await supabase.from("USERS").insert([user]).select('*');
            return data && data[0] as User; 
        } catch (error) {
            console.error(error);
        }
    }
)
const userSlice = createSlice({
    name:'user', 
    initialState:{
        user: {} as User ,   
        userLoading: false,
    },
    reducers:{
        setloadingUser: (state, action) => {
            state.userLoading = action.payload
        }, 
        clearUserData: (state) => {
            state.user = {} as User;
            state.userLoading = false;
        } 
    },
    extraReducers:(builder) => {
        builder.addCase(
            isRegisterOnDB.pending, 
            (state) => {
                state.userLoading = true;
                state.user = {} as User;
            }
        ),
        builder.addCase(
            isRegisterOnDB.fulfilled, 
            (state, action) => {
                state.userLoading = false;
                state.user = action.payload;
            }
        ), 
        builder.addCase(
            registerUserOnDB.pending, 
            (state) => {
                state.userLoading = true;
                state.user = {} as User;
            }
        ),
        builder.addCase(
            registerUserOnDB.fulfilled, 
            (state, action) => {
                state.userLoading = false;
                state.user = action.payload!;
            }
        )
    }
})
export const { setloadingUser, clearUserData } = userSlice.actions; 
export default userSlice.reducer;