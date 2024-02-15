import { Carousel } from "@material-tailwind/react";

interface CarouselComponent {
    images:string[];
    arrowLeft: React.ReactNode;
    arrowRight: React.ReactNode;
}

const CarouselComponent:React.FC<CarouselComponent> = ({images, arrowLeft, arrowRight}) => {
  return (
    <Carousel
      prevArrow={() => {
        return <>{arrowLeft}</>;
      }}
     nextArrow={() => {
        return <>{arrowRight}</>;
      }}
      autoplay
      loop
      placeholder={""}
      className=""
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute p-0 m-0 bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {images.map((image, i) => (
        <img
          key={i}
          src={image}
          alt="carousel"
          className="h-full w-full object-cover"
        />
      ))}
    </Carousel>
  );
}

export default CarouselComponent