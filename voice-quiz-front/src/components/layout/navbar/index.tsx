import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Hamburger from 'hamburger-react'
import useToggle from '../../../hooks/useToggle';
import useDevice from "../../../hooks/useDevice";
import cx from "../../../libs/cx";

// const hiddenRoutes:string[] = [
//   "/auth/login", 
// ]

const Navbar = () => {
  const {isOpen, onClose, onToggle} = useToggle();
  // const [hiddenSidebar, setHiddenSidebar] = useState<boolean>() 
  const device = useDevice(); 
  const location = useLocation();
  useEffect(()=>{
    const handleDeviceDetection = () => {
      switch(device){
        case 'Desktop': onClose(); break;
      }
    }
    handleDeviceDetection();
  },[device]); 

  // useEffect(()=>{
  //   const detectionRoute = () => {
  //     hiddenRoutes.forEach( route => {
  //       if(location.pathname === route){
  //         setHiddenSidebar(true); 
  //       }
  //     })
  //   }
  //   detectionRoute(); 
  // },[location.pathname])

  if (location.pathname === "/auth/login") return null

  return (
    <nav
      className={cx(
        "sticky top-0 z-30 flex h-[60px] w-full items-center justify-between bg-white px-2 shadow-lg lg:px-10",
      )}
    >
      <div className="flex flex-row items-center justify-center">
        {/* <img src={Logo} className="w-16 h-16 lg:w-24 lg:h-24"/> */}
        <h1
          className={
            "Montserrat z-10 text-xl font-black text-[#598392] lg:text-4xl"
          }
        >
          VQ
        </h1>
      </div>
      <div className="flex w-auto justify-end gap-6">
        <NavbarOptions isOpen={isOpen} onToggle={onToggle} onClose={onClose} />
        <Link to={"/auth/login"} className="z-10 flex items-center">
          <Button
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            placeholder={"Iniciar Sesión"}
            className=" bg-[#598392]"
          >
            Iniciar Sesión
          </Button>
        </Link>
        <Link to={"/auth/register"} className="z-10 flex items-center">
          <Button
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            placeholder={"Registro"}
            className="hidden items-center justify-center bg-[#F3F4F6] text-[#598392] lg:flex"
          >
            Registro
          </Button>
        </Link>
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
        "Inter relative bg-white hidden flex-row text-xs text-[#598392] transition-all lg:flex",
        isOpen && 
          "fixed top-0 right-0 flex h-full w-[70%] flex-col items-center bg-white pt-[80px]",
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
        to={"/dashboard/courses/courses-list"}
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