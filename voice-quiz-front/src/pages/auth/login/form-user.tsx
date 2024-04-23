import { Button, Input } from '@material-tailwind/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import { User } from '../../../class/user.class'
import { useAuth } from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';

const FormUser = () => {
    const [initialData, setInitialData] = useState<User>({} as User)
    const [ repeatPassword, setRepeatPassword ] = useState<string>('' as string)
    const date = new Date()
    const userAuth = useSelector((state:RootState) => state.userAuth)
    const userSelector = useSelector((state:RootState) => state.users)
    const auth = useAuth();
    useEffect(()=>{
        if(userAuth.userAuthInfo){
            setInitialData({
                ID: userAuth.userAuthInfo?.id || "",
                name: userAuth.userAuthInfo?.user_metadata.name || "",
                email: userAuth.userAuthInfo?.email || "",
                img_url: userAuth.userAuthInfo?.user_metadata.avatar_url || userAuth.userAuthInfo?.user_metadata.picture || "",
                password: '',
                created_at: date.toDateString(),
                config: {} as JSON,
                state: 'inactive'
            })
        }
    },[userAuth.userAuthInfo])

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = new User(
      initialData.ID || "", 
      initialData.name,
      initialData.email,
      initialData.created_at,
      initialData.config,
      initialData.password.toLowerCase(),
      initialData.img_url,
      initialData.state
    );
    auth.handleRegisterUser(user)
  }
  
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInitialData({
        ...initialData,
        [e.target.name]: e.target.value
    })
  }

  if (userSelector.user){
    return (
        <div className='p-4 rounded-lg bg-white flex flex-col justify-center items-center'>
            <div>
                {/* <div className='w-16 h-16'>
                    <img src = {userSelector.user.img_url} alt='user photo' className='rounded-' />
                </div> */}
                <p className='text-xl font-semibold'>{userSelector.user.name}</p>
            </div>
            <div className='p-2 bg-green-400 mt-2 rounded-lg'>
                <p className='text-white text-md'>Ya estás registrado </p>
            </div>
        </div>
    )
  }


  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 flex h-full w-full max-w-60 flex-col gap-4"
    >
      <Input
        value={initialData.name}
        label="nombre de usuario"
        type="text"
        name="name"
        color="blue"
        onChange={onChange}
        crossOrigin={""}
        className="fucus:rounded-b-2xl rounded-t-[6px]"
      />
      <Input
        value={initialData.email}
        label="correo"
        type="email"
        color="blue"
        crossOrigin={""}
        className="fucus:rounded-b-2xl rounded-t-[6px]"
        disabled
      />
      <Input
        label="contaseña"
        type="password"
        name="password"
        color="blue"
        onChange={onChange}
        crossOrigin={""}
        className="fucus:rounded-b-2xl rounded-t-[6px]"
        success={repeatPassword === initialData.password && repeatPassword.length > 0 ? true : false}
      />
      <Input
        label="repita su constraseña"
        type="password"
        color="blue"
        onChange={(e) => {
          setRepeatPassword(e.target.value);
        }}
        crossOrigin={""}
        className="fucus:rounded-b-2xl rounded-t-[6px]"
        error={repeatPassword !== initialData.password && repeatPassword.length > 0 ? true : false}
        success={repeatPassword === initialData.password && repeatPassword.length > 0 ? true : false}
      />
      <Button type="submit" placeholder={""} loading = {userSelector.userLoading}>
        Registrarse
      </Button>
    </form>
  );
}

export default FormUser