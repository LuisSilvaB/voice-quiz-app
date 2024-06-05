import Login2 from "/public/login/login-2.jpg"; 
import Login3 from "/public/login/login-3.jpg"; 
import Login5 from "/public/login/login-5.jpg"; 
import Login6 from "/public/login/login-6.jpg"
import Login7 from "/public/login/login-7.jpg"
import CarouselComponent from "../../../components/shared/carousel";
import CarouserArrowLeft from "../../../components/shared/carousel/carousel-arrow-left";
import CarouserArrowRight from "../../../components/shared/carousel/carousel-arrow-right";
import VoiceLogo from "/public/voice-quiz-logo.png";
import {
  Card,
  Typography,
  Input,
  Button,
  List,
  ListItem
} from "@material-tailwind/react";
import { GoogleLoginButton } from "react-social-login-buttons"
import { signInWithGoogleAsync } from '../../../features/userAuth.features';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { PiChalkboardTeacherLight } from "react-icons/pi";
import { PiStudent } from "react-icons/pi";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { motion } from "framer-motion";
import { variants } from "../../dashboard/courses/types";
import useToggle from "../../../hooks/useToggle";
import cx from "../../../libs/cx";
import { useEffect, useRef } from "react";
import TeacherModal from "../teacher.modal";
import { useAuth } from "../../../hooks/useAuth";
import { CgSpinner } from "react-icons/cg";
import { Navigate } from "react-router-dom";
import FormUser from "./form-user";
import { Toaster } from "sonner"
import StudentModal from "../student.modal";

const images:string[] = [Login7, Login2, Login3, Login5, Login6];

const Login = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const toggleOptions = useToggle(); 
  const toggleTeacherModal = useToggle(); 
  const toggleStudentModal = useToggle();
  const userAuth = useSelector((state:RootState) => state.userAuth)
  const userSelector = useSelector((state:RootState) => state.users)
  const user_roles = useSelector((state:RootState) => state.users_roles)
  const role = useSelector((state:RootState) => state.roles)
  const cardRef = useRef<HTMLDivElement>(null)
  const auth = useAuth(); 

  console.log(role)

  useEffect(()=>{
    if (cardRef && toggleOptions.isOpen) {
      setTimeout(()=>{
        cardRef.current?.focus()
      },100)
    }
  },[toggleOptions.isOpen])

  if (userAuth.userAuthInfo && userSelector.user && user_roles.user_rol) {
    return <Navigate to={"/"}/>
  }

  if (userAuth.authLoading || role.rolLoading || user_roles.user_rol_loading) return (
    <div className="fixed w-full h-full top-0 right-0 flex justify-center items-center">
      <CgSpinner className="animate-spin w-20 h-auto text-tangaroa-500"/>
    </div>
  );


  if (userAuth.userAuthInfo && (!userSelector.user || !user_roles.user_rol) )
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-tangaroa-500 to-tangaroa-900">
        <div className="flex h-full min-h-screen w-full max-w-[1440px] flex-col items-center justify-center">
          <div className="mt-4 flex h-12 w-full items-center justify-between p-2">
            <p className="p-0 font-concert text-3xl text-white">
              Voice Quiz app
            </p>
            <div className="h-full">
              <div
                className={cx(
                  "flex h-12 cursor-pointer items-center gap-4 rounded-xl border bg-white pl-6 text-gray-400 transition-all ease-in-out",
                  toggleOptions.isOpen ? "rounded-b-none" : "",
                )}
                onClick={toggleOptions.onToggle}
              >
                <img
                  className="h-8 w-8 rounded-full "
                  src={userAuth.userAuthInfo.user_metadata.avatar_url}
                  alt=""
                />
                <p className="hidden font-inter text-sm text-gray-600 lg:flex">
                  {userAuth.userAuthInfo.user_metadata.name}
                </p>
                <div className="flex h-full items-center justify-center rounded-r-xl border-l px-4 transition-all ease-in-out hover:bg-gray-200">
                  <MdOutlineArrowDropDownCircle className="text-gray-600" />
                </div>
              </div>
              <motion.div
                variants={variants}
                initial="exit"
                onBlur={toggleOptions.onClose}
                animate={toggleOptions.isOpen ? "enter" : "exit"}
                className="fixed h-auto w-auto"
              >
                <Card
                  placeholder={""}
                  tabIndex={0}
                  ref={cardRef}
                  className="w-[123px] rounded-none rounded-b-xl lg:w-[336px]"
                >
                  <List placeholder={""}>
                    <ListItem
                      placeholder={""}
                      className="text-xs text-red-500 hover:text-red-800"
                      onClick={() => auth.handleLogout()}
                    >
                      Cerrar sesión
                    </ListItem>
                  </List>
                </Card>
              </motion.div>
            </div>
          </div>
          <div className="mt-12 flex w-[100vw] flex-1 items-start justify-center gap-10 rounded-xl  lg:mt-0 lg:w-[30vw] lg:items-center">
            {!userSelector.user ? (
              <div
                className={
                  "relative mb-10 flex h-full flex-1 flex-col items-center justify-center gap-3 rounded-lg bg-white py-10"
                }
              >
                <div className="absolute -top-10 flex w-fit items-center justify-center rounded-full bg-white p-2">
                  <img
                    className="z-20 h-16 w-16 rounded-full"
                    src={userAuth.userAuthInfo.user_metadata.picture}
                  />
                </div>
                <div
                  className={cx(
                    "absolute left-0 top-0 z-10 hidden h-full w-full items-center justify-center rounded-lg bg-gray-500 opacity-25 transition-opacity",
                    userSelector.userLoading && "flex",
                  )}
                >
                  <CgSpinner className="h-auto w-10 animate-spin text-tangaroa-950" />
                </div>
                <p className="mt-4 text-xl font-semibold text-tangaroa-500">
                  {userSelector.user ? "Bienvenido" : "Datos del usuario"}
                </p>
                <FormUser />
              </div>
            ) : null}

            {userSelector.user ? ( 
              <div className="relative mb-10 flex h-full max-h-[80vh] w-fit flex-1 flex-col items-center justify-center rounded-lg  bg-white py-6">
                <div
                  className={cx(
                    "absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-gray-500 opacity-50",
                    userSelector.user && "hidden",
                  )}
                >
                  <div className="absolute bg-black p-2">
                    <p className="text-white">Registra tus datos</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-tangaroa-500">
                  ¿Que deseas ser?
                </h3>

                <div className="mt-4 flex w-full flex-col items-center gap-10 px-4 transition-all ease-in-out">
                  <div
                    className="flex h-32 w-full cursor-pointer flex-row items-center justify-start gap-4 rounded-lg border bg-white p-8 shadow-lg hover:shadow-2xl lg:h-auto lg:w-full lg:py-5"
                    onClick={toggleTeacherModal.onToggle}
                  >
                    <PiChalkboardTeacherLight className="h-auto w-12 text-tangaroa-500 lg:w-10" />
                    <p className="text-xs font-semibold text-tangaroa-800 lg:text-sm">
                      Profesor
                    </p>
                  </div>

                  <div className="flex h-32 w-full cursor-pointer flex-row items-center justify-start gap-4 rounded-lg border bg-white p-8 shadow-lg hover:shadow-2xl lg:h-auto lg:w-full lg:py-5"
                    onClick={toggleStudentModal.onToggle}
                  >
                    <PiStudent
                      className="h-auto w-12 text-tangaroa-500 lg:w-10"
                    />
                    <p className="text-xs font-semibold text-tangaroa-800 lg:text-sm">
                      Estudiante
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Toaster richColors />
        </div>
        {toggleTeacherModal.isOpen ? (
          <TeacherModal
            isOpen={toggleTeacherModal.isOpen}
            onClose={toggleTeacherModal.onClose}
            onOpen={toggleTeacherModal.onOpen}
            toggle={toggleTeacherModal.onToggle}
          />
        ) : null}
        {toggleStudentModal.isOpen ? (
          <StudentModal
            isOpen={toggleStudentModal.isOpen}
            onClose={toggleStudentModal.onClose}
            onOpen={toggleStudentModal.onOpen}
            toggle={toggleStudentModal.onToggle}
          />
        ) : null}
      </div>
    );

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="m-0 flex h-full max-h-[1080px] w-full flex-col items-center justify-center p-0 text-black lg:flex-row">
        <section className="relative hidden h-full w-[40%] lg:flex">
          <CarouselComponent
            arrowLeft={<CarouserArrowLeft />}
            arrowRight={<CarouserArrowRight />}
            images={images}
          />
          <div className="absolute top-0 h-full w-full bg-black opacity-70" />
          <Description className="absolute bottom-6 flex w-full flex-col gap-4 p-16 text-white" />
        </section>
        <section className="flex h-full w-[60%] items-center justify-center bg-white">
          <Card
            placeholder={""}
            color="transparent"
            shadow={false}
          >
            <Typography
              placeholder={""}
              variant="h4"
              color="blue-gray"
            >
              Iniciar sesión
            </Typography>
            <Typography
              placeholder={""}
              color="gray"
              className="mt-1 font-normal"
            >
              Encantado de conocerte ! Ingresa tus datos para continuar
            </Typography>
            <div className="flex w-full flex-col gap-4">
              <form action="" className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 ">
                  <Typography
                    placeholder={""}
                    variant="h6"
                    color="blue-gray"
                    className="-mb-3"
                  >
                    Correo
                  </Typography>
                  <Input
                    crossOrigin=""
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4 ">
                  <Typography
                    placeholder={""}
                    variant="h6"
                    color="blue-gray"
                    className="-mb-3"
                  >
                    Contraseña
                  </Typography>
                  <Input
                    crossOrigin={""}
                    type="password"
                    size="lg"
                    placeholder="********"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                </div>
                <Button
                  placeholder={''}
                >
                  Iniciar sesión
                </Button>
              </form>
              <div className="flex w-full items-center justify-center">
                <p className="Inter">
                  O inicia sesión con tus redes sociales favoritas
                </p>
              </div>
              <div className="flex flex-col">
                <GoogleLoginButton 
                  onClick={() => dispatch(signInWithGoogleAsync())}
                />
              </div>
            </div>
          </Card>
        </section>
      </div>

    </div>
  );
}

export default Login; 

interface DescriptionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Description:React.FC<DescriptionProps> = ({... props}) => {
  return (
    <div {...props}>
      <div className="flex flex-col w-[60%]">
        <img src={VoiceLogo} className="-m-3 w-28 h-28 rounded-full"/>
        <h1 className="text-white">Bienvenido a</h1>
        <div className="flex flex-row gap-3 items-center">
          <span className="Pacifico text-5xl">Voice quiz</span>
          {/* <PiMicrophoneStageFill size={40}/> */}
        </div>
      </div>
      <p className="Inter font-medium">¡Bienvenido a nuestra página de inicio de sesión! Con nuestra plataforma, ingresar es fácil y seguro. Accede a tu cuenta con solo unos pocos clics y comienza a explorar todo lo que tenemos para ofrecer!</p>
    </div>
  )
}