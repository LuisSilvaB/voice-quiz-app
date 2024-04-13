import { configureStore } from "@reduxjs/toolkit";
import courseReducers from "../features/course.features"
import fragmentsReducers from "../features/fragments.features"
import userAuthReducers  from "../features/userAuth.features";
import usersReducers from "../features/db-features/users.db.features"
import rolesReducers from "../features/db-features/roles.db.features"
import usersRolesReduces from "../features/db-features/users-roles.db.freatures"


export const store = configureStore({
    reducer: {
        course: courseReducers,
        fragments: fragmentsReducers,
        userAuth: userAuthReducers,
        users: usersReducers, 
        roles: rolesReducers,
        users_roles: usersRolesReduces 
    }, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch