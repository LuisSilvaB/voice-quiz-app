import { configureStore } from "@reduxjs/toolkit";
import classRecordReducers from "../features/class-record"
export const store = configureStore({
    reducer: {
        classRecord: classRecordReducers
    }, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch