import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import Hamburger from 'hamburger-react'
import useToggle from '../../../hooks/useToggle';
import useDevice from "../../../hooks/useDevice";
import cx from "../../../libs/cx";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import {
  Button,
  Card,
  List,
  ListItem
} from "@material-tailwind/react";
import { variants } from "../../../libs/animate";
import NavbarOptions from "./navbar-options";
// const hiddenRoutes:string[] = [
//   "/auth/login", 
// ]

const Navbar = () => {
  const userAuth = useSelector((state:RootState) => state.userAuth);
  const auth = useAuth(); 
  const {isOpen, onClose, onToggle} = useToggle();
  const toggleOptions = useToggle();
  // const [hiddenSidebar, setHiddenSidebar] = useState<boolean>() 
  const device = useDevice(); 
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const handleDeviceDetection = () => {
      switch(device){
        case 'Desktop': onClose(); break;
      }
    }
    handleDeviceDetection();
  },[device]); 
  

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
        {userAuth.userAuthInfo ? (
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
                src={userAuth?.userAuthInfo?.user_metadata?.picture}
                alt=""
              />
              <p className="hidden font-inter text-sm text-gray-600 lg:flex">
                {userAuth?.userAuthInfo?.user_metadata.name}
              </p>
              <div className="flex h-full items-center justify-center rounded-r-xl border-l px-4 transition-all ease-in-out hover:bg-gray-200">
                {/* <MdOutlineArrowDropDownCircle className="text-gray-600" /> */}
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
        ) : (
          <>
            <Link to={"/auth/login"} className="z-10 flex items-center">
              <Button placeholder={"Iniciar Sesión"} className=" bg-[#598392]">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to={"/auth/register"} className="z-10 flex items-center">
              <Button
                placeholder={"Registro"}
                className="hidden items-center justify-center bg-[#F3F4F6] text-[#598392] lg:flex"
              >
                Registro
              </Button>
            </Link>
          </>
        )}
        <div className="flex items-center justify-center text-gray-500 lg:hidden">
          <Hamburger size={25} toggled={isOpen} onToggle={onToggle} />
        </div>
      </div>
    </nav>
  );
}


export default Navbar; 