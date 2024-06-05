import { useCallback, useEffect, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '../app/store';
import { signInWithGoogleAsync, stateChangeGoogleAuth, singOutWithGoogleAsync } from "../features/userAuth.features"
import { isRegisterOnDB, registerUserOnDB, clearUserData } from '../features/db-features/users.db.features';
import { isRegisterUserRolOnDB, createUserRol, clearUserRol } from '../features/db-features/users-roles.db.freatures';
import { User } from "../class/user.class";
import { useNavigate } from "react-router-dom";

import { UserRol } from "../class/user-rol.class";
import React from 'react';

import { toast } from "sonner"
import { clearRol, getRol } from "../features/db-features/roles.db.features";

type userRol = "TEACHER" | "STUDENT"  

interface AuthContext {
  handleLogin: () => void;
  handleLogout: () => void;
  handleRegisterUser: (userFormData:User) => void;
  registerUserRol: (rol:userRol) => void;
}


// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<AuthContext>({
  handleLogin: () => {},
  handleLogout: () => {},
  handleRegisterUser: () => {},
  registerUserRol: () => {}
});

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const { userAuthInfo, authLoading } = useSelector((state:RootState) => state.userAuth);
  const { user, userLoading  } = useSelector((state:RootState) => state.users);     
  const { user_rol } = useSelector((state:RootState) => state.users_roles);


  useEffect(()=>{
    dispatch(stateChangeGoogleAuth()); 
  }
  ,[])

  const handleLogin = () => {
    dispatch(signInWithGoogleAsync());
  }

  const handleLogout = () => {
    dispatch(singOutWithGoogleAsync()); 
    dispatch(clearUserData()); 
    dispatch(clearUserRol()); 
    dispatch(clearRol())
    localStorage.removeItem('userId');
    navigate('/auth/login');
  }

  
  useEffect(() => {
    if (userAuthInfo) dispatch(isRegisterOnDB(userAuthInfo.id));
  }, [userAuthInfo, dispatch]);

  const handleRegisterUser = (userFormData:User) => {
    if(userAuthInfo && !authLoading && !user && !userLoading){
      dispatch(registerUserOnDB(userFormData))
    }
    else{
      toast.warning("Ya estas registrado")
    }
  }


  const checkUserRole = useCallback(async () =>{
    if(userAuthInfo && user && !authLoading && !userLoading ) {
      const user_rol = await dispatch(isRegisterUserRolOnDB(user.ID))
      if (user_rol.payload) {
        dispatch(getRol(user_rol.payload.ROL_ID))
      }
    }
  }, [userAuthInfo, user, authLoading, userLoading, dispatch])

  useEffect(()=>{
    checkUserRole(); 
  },[checkUserRole])

  const registerUserRol = (rol:userRol)=> {
    const UserAuth = userAuthInfo; 
    const user_rol_date = new Date();
    if (
      userAuthInfo &&
      !user_rol
    ) {
      if (rol === "STUDENT") {
        const user_rol = new UserRol(user_rol_date.toDateString(), import.meta.env.VITE_APP_STUDENT_ID, UserAuth?.id ?? userAuthInfo.id)
        dispatch(createUserRol(user_rol))
      }
      else if(rol === "TEACHER") {
        const user_rol = new UserRol(user_rol_date.toDateString(), import.meta.env.VITE_APP_TEACHER_ID, UserAuth?.id ?? userAuthInfo.id)
        dispatch(createUserRol(user_rol))
      }
    } 
  }
  return(
    <authContext.Provider value={{
      handleLogin,
      handleRegisterUser,
      handleLogout,
      registerUserRol
    }}>
      {children}
    </authContext.Provider>
  )
}


export default AuthContextProvider; 