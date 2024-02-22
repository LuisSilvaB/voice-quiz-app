import CarouselComponent from "../../components/shared/carousel";
import homeCarousel1 from "/public/home/home-carousel-1.jpg"
import homeCarousel2 from "/public/home/home-carousel-2.jpg"
import homeCarousel3 from "/public/home/home-carousel-3.jpg"
import CarouserArrowLeft from "../../components/shared/carousel/carousel-arrow-left";
import CarouserArrowRight from "../../components/shared/carousel/carousel-arrow-right";
import Benefits from "./sections/Benefits";
export default function Home() {
  const homeCarouselImages:string[] = [homeCarousel1, homeCarousel2, homeCarousel3]
  return (
    <section className="relative box-border flex h-full w-full flex-col items-center justify-center text-black lg:mt-24 lg:flex-col">
      <div className="flex flex-row justify-center items-center">
        <div className="absolute top-[40%] z-10 flex w-[90%]  flex-1 items-center justify-center lg:items-start lg:pt-20 bg-white py-8 shadow-md lg:shadow-none lg:relative lg:h-[500px] lg:w-[40%] lg:top-0">
          <div className="h-[50%] w-[80%] lg:w-[70%] ">
            <p className="font-concert text-2xl text-[#598392] lg:text-5xl">
              Bienvenido a <br />{" "}
              <span className="text-5xl lg:text-8xl">Voice quiz</span>{" "}
            </p>
            <p className="mt-4 font-montserrat text-lg font-medium text-gray-600 lg:mt-8">
              ¡Prepárate para transformar tus clases en aventuras educativas con
              nuestra asombrosa app! 🚀{" "}
              <span className="hidden lg:flex">
                Con nuestra plataforma innovadora, podrás generar preguntas al
                instante que mantendrán a tus alumnos comprometidos y emocionados
                por aprender.💡
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full lg:h-[60%] lg:w-[60%] ">
            <CarouselComponent
              tailwindStyle="w-full h-[220px] lg:w-full z-10 lg:h-full rounded-md shadow-sm"
              images={homeCarouselImages}
              arrowLeft={<CarouserArrowLeft />}
              arrowRight={<CarouserArrowRight />}
            />
            <div className="absolute w-full h-full bg-[#c5d5c6] blur-sm top-8 -right-8 z-0" />
          </div>
        </div>
      </div>
      <Benefits />
    </section>
  );
}