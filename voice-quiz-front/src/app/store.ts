import { configureStore } from "@reduxjs/toolkit";
import courseReducers from "../features/class-record"
export const store = configureStore({
    reducer: {
        course: courseReducers
    }, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch