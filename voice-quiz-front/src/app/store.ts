import { configureStore } from "@reduxjs/toolkit";
import userAuthReducers  from "../features/userAuth.features";
import usersReducers from "../features/db-features/users.db.features"
import rolesReducers from "../features/db-features/roles.db.features"
import usersRolesReduces from "../features/db-features/users-roles.db.freatures"
import newCoursesReducers from "../features/db-features/courses.features"
import sessionsReducres from "../features/db-features/sessions.features"
import fragmentsReducers from "../features/fragments.features";
export const store = configureStore({
    reducer: {
        userAuth: userAuthReducers,
        users: usersReducers, 
        roles: rolesReducers,
        users_roles: usersRolesReduces, 
        fragments: fragmentsReducers,
        courses: newCoursesReducers, 
        sessions: sessionsReducres
    }, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch