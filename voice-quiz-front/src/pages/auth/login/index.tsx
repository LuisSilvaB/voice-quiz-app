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
  Button
} from "@material-tailwind/react";
import { GoogleLoginButton, FacebookLoginButton, GithubLoginButton } from "react-social-login-buttons"

const images:string[] = [Login7, Login2, Login3, Login5, Login6];

const Login = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
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
          <Card placeholder={""} color="transparent" shadow={false}>
            <Typography placeholder={""} variant="h4" color="blue-gray">
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
                    crossOrigin={''}
                    type="password"
                    size="lg"
                    placeholder="********"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                </div>
                <Button placeholder=''>Iniciar sesión</Button>
              </form>
              <div className="flex w-full justify-center items-center">
                <p className="Inter">O inicia sesión con tus redes sociales favoritas</p>
              </div>
              <div className="flex flex-col">
                <GoogleLoginButton />
                <FacebookLoginButton />
                <GithubLoginButton />
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