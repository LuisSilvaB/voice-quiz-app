import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Hamburger from 'hamburger-react'
import useToggle from '../../../hooks/useToggle';
import useDevice from "../../../hooks/useDevice";
import cx from "../../../libs/cx";
import VoiceLogo from '/public/voice-quiz-logo.png'


const Navbar = () => {
  const {isOpen, onClose, onToggle} = useToggle(); 
  const device = useDevice(); 
  const location = useLocation();
  useEffect(()=>{
    const handleDeviceDetection = () => {
      switch(device){
        case 'Desktop': onClose(); break;
      }
    }
    handleDeviceDetection();
    console.log(device)
  },[device]); 
  
  if (location.pathname === '/login') {
    return null
  }

  return (
    <nav className="flex h-[10%] w-full items-center justify-between px-2 lg:px-10 bg-white shadow-lg">
      <div className="flex flex-row justify-center items-center">
        <img src={VoiceLogo} className="w-16 h-16 lg:w-24 lg:h-24"/>
        {/* <h1 className="Montserrat font-black z-10 text-xl text-[#598392] lg:text-4xl">
          Voice quiz
        </h1> */}
      </div>
      <div className="flex w-auto justify-end gap-6">
        <NavbarOptions isOpen={isOpen} onToggle={onToggle} onClose={onClose} />
        <Button placeholder={"Iniciar Sesión"} className="bg-[#598392]">
          Iniciar Sesión
        </Button>
        <Button
          placeholder={"Registro"}
          className="hidden items-center justify-center bg-[#F3F4F6] text-[#598392] lg:flex"
        >
          Registro
        </Button>
        <div className="flex items-center justify-center text-gray-500 lg:hidden">
          <Hamburger size={25} toggled={isOpen} onToggle={onToggle} />
        </div>
      </div>
    </nav>
  );
}
interface NavbarOptiosInterface extends  React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  onToggle: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const NavbarOptions:React.FC<NavbarOptiosInterface> = ({isOpen, onClose}) => {
  return (
    <ul
      className={cx(
        "Inter relative hidden flex-row text-xs text-[#598392] transition-all lg:flex",
        isOpen && 
          "absolute top-0 flex h-full w-full flex-col items-center bg-white pt-[80px]",
      )}
    >
      <Link
        to={"/"}
        onClick={onClose}
        className={cx(
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer hover:text-[#bac1c4]",
          isOpen && 
            "w-full px-6 text-xl focus:text-[#598392] active:bg-blue-gray-600 active:text-white",
        )}
      >
        Inicio
        <span
          className={cx(
            "h-[2px] w-full transition-all  group-hover:bg-[#598392]",
            isOpen && "hidden",
          )}
        />
      </Link>
      <Link
        to={"/"}
        onClick={onClose}
        className={cx(
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer hover:text-[#bac1c4]",
          isOpen &&
            "w-full px-6 text-xl focus:text-[#598392] active:bg-blue-gray-600 active:text-white",
        )}
      >
        Galería
        <span
          className={cx(
            "h-[2px] w-full transition-all  group-hover:bg-[#598392]",
            isOpen && "hidden",
          )}
        />
      </Link>
      <Link
        to={"/"}
        onClick={onClose}
        className={cx(
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer hover:text-[#bac1c4]",
          isOpen &&
            "w-full px-6 text-xl focus:text-[#598392] active:bg-blue-gray-600 active:text-white",
        )}
      >
        Dashboard
        <span
          className={cx(
            "h-[2px] w-full transition-all  group-hover:bg-[#598392]",
            isOpen && "hidden",
          )}
        />
      </Link>
      <Link
        to={"/"}
        onClick={onClose}
        className={cx(
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer hover:text-[#bac1c4]",
          isOpen &&
            "w-full px-6 text-xl focus:text-[#598392] active:bg-blue-gray-600 active:text-white",
        )}
      >
        Features
        <span
          className={cx(
            "h-[2px] w-full transition-all  group-hover:bg-[#598392]",
            isOpen && "hidden",
          )}
        />
      </Link>
    </ul>
  );
}


export default Navbar; 