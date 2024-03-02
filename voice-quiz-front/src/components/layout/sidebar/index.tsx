import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TfiSave } from "react-icons/tfi";
import { CiSettings } from "react-icons/ci";
import { BsGrid1X2 } from "react-icons/bs";
import { useLocation } from 'react-router-dom';
import { VscHistory } from "react-icons/vsc";
import { Button } from '@material-tailwind/react';
import { useEffect } from 'react';
import cx from '../../../libs/cx';


const accessRoutes:string[] = [
  "/dashboard", 
  "/dashboard/", 
  "/dashboard/save-data",
  "/dashboard/history",
  "/dashboard/settings"  
]

const SidebarComponent = () => {
  const location = useLocation();
  const [someRoute, setSomeRoute] = useState<boolean>(false);
  useEffect(()=>{
    const someRoute =  accessRoutes.some( route => location.pathname === route)
    setSomeRoute(someRoute);
  },[location.pathname])
  if (!someRoute) return null
  return (
    <nav className="sticky top-0 hidden flex-col justify-between bg-white pt-6 lg:flex lg:w-[300px] lg:min-w-[300px]">
      {/* <header className=" flex h-[100px] w-full items-center justify-center gap-2 text-[#598392]">
        <p className="font-montserrat text-3xl font-bold">VQ</p>
        <p className="">Voice quiz app </p>
      </header> */}
      <main className="mt-4 w-full flex-1">
        <aside>
          <ul className="flex h-full w-full flex-col font-inter text-gray-700">
            <li>
              <Link
                to="/dashboard"
                className={cx(
                  "flex flex-row items-center gap-2 py-4 pl-8 transition-all hover:bg-blue-gray-50",
                  location.pathname === "/dashboard" && "bg-blue-gray-50",
                )}
              >
                <BsGrid1X2 />
                <p>Clases</p>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/save-data"
                className={cx(
                  "flex flex-row items-center gap-2 py-4 pl-8 transition-all hover:bg-blue-gray-50",
                  location.pathname === "/dashboard/save-data" &&
                    "bg-blue-gray-50",
                )}
              >
                <TfiSave />
                <p>Guardadas</p>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/history"
                className={cx(
                  "flex flex-row items-center gap-2 py-4 pl-8 transition-all hover:bg-blue-gray-50",
                  location.pathname === "/dashboard/history" &&
                    "bg-blue-gray-50",
                )}
              >
                <VscHistory />
                <p>Historial</p>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className={cx(
                  "flex flex-row items-center gap-2 py-4 pl-8 transition-all hover:bg-blue-gray-50",
                  location.pathname === "/dashboard/settings" && "bg-blue-gray-50",
                )}
              >
                <CiSettings />
                <p>Settings</p>
              </Link>
            </li>
          </ul>
        </aside>
      </main>
      <footer className="flex h-[40%] w-full items-center  justify-center">
        <div className="flex h-[80%] w-[80%] flex-col justify-center rounded-lg bg-black p-6 text-white">
          <p className="text-2xl font-bold">Actualiza a pro</p>
          <p className="text-base">
            Descubre nuestros beneficios adicionales que tenemos para ti
          </p>
          <Button className="mt-10" placeholder={"Actualiza"}>
            Actualiza
          </Button>
        </div>
      </footer>
    </nav>
  );
}

export default SidebarComponent; 