import { configureStore } from "@reduxjs/toolkit";
import courseReducers from "../features/course.features"
import fragmentsReducers from "../features/fragments.features"
export const store = configureStore({
    reducer: {
        course: courseReducers,
        fragments: fragmentsReducers,
    }, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch