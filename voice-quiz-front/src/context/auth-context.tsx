import { useCallback, useEffect, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '../app/store';
import { signInWithGoogleAsync, stateChangeGoogleAuth, singOutWithGoogleAsync } from "../features/userAuth.features"
import { isRegisterOnDB, registerUserOnDB } from '../features/db-features/users.db.features';
import { isRegisterUserRolOnDB, createUserRol } from '../features/db-features/users-roles.db.freatures';
import { User } from "../class/user.class";
import { UserRol } from "../class/user-rol.class";
import React from 'react';

type userRol = "TEACHER" | "STUDENT"  

interface AuthContext {
  handleLogin: () => void;
  registerUserRol: (rol: userRol) => void;
  handleLogout: () => void;
}


// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<AuthContext>({
  handleLogin: () => {},
  registerUserRol: () => {},
  handleLogout: () => {}
});

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { userAuthInfo, authLoading } = useSelector((state:RootState) => state.userAuth);
  const { user, userLoading  } = useSelector((state:RootState) => state.users);     
  const { user_rol } = useSelector((state:RootState) => state.users_roles);
  console.log("userAuthInfo", userAuthInfo)
  console.log("user", user)
  console.log("user_rol", user_rol)

  useEffect(()=>{console.log(user)},[user])

  useEffect(()=>{
    dispatch(stateChangeGoogleAuth()); 
  }
  ,[])

  const handleLogin = () => {
    dispatch(signInWithGoogleAsync());
  }

  const handleLogout = () => {
    dispatch(singOutWithGoogleAsync())
  }
  // const checkUserInformation = useCallback(() => {
  //   if (userAuthInfo && !user) dispatch(isRegisterOnDB(userAuthInfo.id));
  // }, [userAuthInfo, user, dispatch]);
  
  useEffect(() => {
    if (userAuthInfo && !user) dispatch(isRegisterOnDB(userAuthInfo.id));
  }, [userAuthInfo, user, dispatch]);
  
  const handleRegisterUser = useCallback(() => {
    if(userAuthInfo && !authLoading && !user && !userLoading){
      const user:User = {
        ID:userAuthInfo.id || "", 
        name: userAuthInfo.user_metadata.name || "",
        email: userAuthInfo.user_metadata.email || "",
        config: {} as JSON,
        created_at: new Date().toDateString(),
        password:""
      }
      dispatch(registerUserOnDB(user))
    }
  },[userAuthInfo, user, dispatch])

  useEffect(()=>{
    handleRegisterUser(); 
  },[handleRegisterUser])

  const checkUserRole = useCallback(() =>{
    if(userAuthInfo && user && !authLoading && !userLoading ) {
      dispatch(isRegisterUserRolOnDB(user.ID))
    }
  }, [userAuthInfo, user, authLoading, userLoading])

  useEffect(()=>{
    checkUserRole(); 
  },[checkUserRole])

  const registerUserRol = (rol:userRol)=> {
    const user_rol_date = new Date();
    if (
      userAuthInfo &&
      user &&
      !user_rol
    ) {
      if (rol === "STUDENT") {
        const user_rol = new UserRol(user_rol_date.toDateString(), import.meta.env.VITE_APP_STUDENT_ID, userAuthInfo.id)
        dispatch(createUserRol(user_rol))
      }
      else if(rol === "TEACHER") {
        const user_rol = new UserRol(user_rol_date.toDateString(), import.meta.env.VITE_APP_TEACHER_ID, userAuthInfo.id)
        dispatch(createUserRol(user_rol))
      }
    } 
  }
  return(
    <authContext.Provider value={{
      handleLogin,
      registerUserRol, 
      handleLogout
    }}>
      {children}
    </authContext.Provider>
  )
}


export default AuthContextProvider; 