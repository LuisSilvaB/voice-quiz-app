import { configureStore } from "@reduxjs/toolkit";
import userAuthReducers  from "../features/userAuth.features";
import usersReducers from "../features/db-features/users.db.features"
import rolesReducers from "../features/db-features/roles.db.features"
import usersRolesReducers from "../features/db-features/users-roles.db.freatures"
import newCoursesReducers from "../features/db-features/courses.features"
import sessionsReducers from "../features/db-features/sessions.features"
import fragmentsReducers from "../features/fragments.features";
import quizzesReducers from "../features/db-features/quizzes.features";
import resultsReducers from "../features/db-features/results.features";

export const store = configureStore({
    reducer: {
        userAuth: userAuthReducers,
        users: usersReducers, 
        roles: rolesReducers,
        users_roles: usersRolesReducers, 
        fragments: fragmentsReducers,
        courses: newCoursesReducers, 
        sessions: sessionsReducers,
        quizzes: quizzesReducers,
        results: resultsReducers,
    }, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch