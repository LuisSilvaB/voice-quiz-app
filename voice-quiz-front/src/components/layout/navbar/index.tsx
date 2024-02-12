import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Hamburger from 'hamburger-react'
import useToggle from '../../../hooks/useToggle';
import useDevice from "../../../hooks/useDevice";
import cx from "../../../libs/cx";
const Navbar = () => {
  const {isOpen, onClose, onToggle} = useToggle(); 
  const device = useDevice(); 
  useEffect(()=>{
    const handleDeviceDetection = () => {
      switch(device){
        case 'Desktop': onClose(); break;
      }
    }
    handleDeviceDetection();
  },[device]); 

  return (
    <nav className="flex h-[80px] w-full max-w-[1920px] items-center justify-between px-2 lg:px-10">
      <h1 className="Pacifico z-10 text-3xl text-[#598392] lg:text-4xl">
        Voice quiz
      </h1>
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
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer",
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
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer",
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
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer",
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
          "group flex flex-col rounded-lg p-3 text-base font-medium text-[#598392] transition-all hover:cursor-pointer",
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