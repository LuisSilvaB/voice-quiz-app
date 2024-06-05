import { Link } from 'react-router-dom';
import { TfiSave } from "react-icons/tfi";
import { CiSettings } from "react-icons/ci";
import { BsGrid1X2 } from "react-icons/bs";
import { VscHistory } from "react-icons/vsc";
import cx from '../../../libs/cx';
import { BsJournalCheck } from "react-icons/bs";
// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';


// const accessRoutes:string[] = [
//   "/dashboard", 
//   `/dashboard/class-recordsession/`,
//   "/dashboard/class-record/classes",
//   "/dashboard/save-data",
//   "/dashboard/history",
//   "/dashboard/settings"  
// ]

const SidebarComponent = () => {
  // const location = useLocation();
  // const [someRoute, setSomeRoute] = useState<boolean>(false);
  // useEffect(()=>{
  //   const someRoute =  accessRoutes.some( route => location.pathname === route)
  //   setSomeRoute(someRoute);
  // },[location.pathname])
  // if (!someRoute) return null
  return (
    <nav className="sticky top-0 hidden max-h-[1080px] flex-col justify-between border-r bg-gray-900 pt-6 lg:flex lg:w-[250px] lg:min-w-[250px]">
      {/* <header className=" flex h-[100px] w-full items-center justify-center gap-2 text-[#598392]">
        <p className="font-montserrat text-3xl font-bold">VQ</p>
        <p className="">Voice quiz app </p>
      </header> */}
      <main className="mt-4 w-full flex-1">
        <aside>
          <ul className="flex h-full w-full flex-col items-center justify-center gap-2 font-inter text-white">
            <li className="w-[80%]">
              <Link
                to="/dashboard/courses/courses-list"
                className={cx(
                  "flex flex-row items-center gap-2 rounded-lg py-[10px] pl-3 transition-all  hover:bg-blue-gray-900 hover:text-white",
                  location.pathname.includes("courses") &&
                    "bg-blue-gray-50 text-gray-900",
                )}
              >
                <BsGrid1X2 />
                <p>Cursos</p>
              </Link>
            </li>
            <li className="w-[80%]">
              <Link
                to="/dashboard/my-quizzes"
                className={cx(
                  "flex flex-row items-center gap-2 rounded-lg py-[10px] pl-3 transition-all  hover:bg-blue-gray-900 hover:text-white",
                  location.pathname.includes("my-quizzes") &&
                    "bg-blue-gray-50 text-gray-900",
                )}
              >
                <BsJournalCheck />
                <p>Mis cuestionarios</p>
              </Link>
            </li>
            <li className="w-[80%]">
              <Link
                to="/dashboard/save-data"
                className={cx(
                  "flex flex-row items-center gap-2 rounded-lg py-[10px] pl-3 transition-all  hover:bg-blue-gray-900 hover:text-white",
                  location.pathname === "/dashboard/save-data" &&
                    "bg-blue-gray-50 text-gray-900",
                )}
              >
                <TfiSave />
                <p>Guardadas</p>
              </Link>
            </li>
            <li className="w-[80%]">
              <Link
                to="/dashboard/history"
                className={cx(
                  "flex flex-row items-center gap-2 rounded-lg py-[10px] pl-3 transition-all  hover:bg-blue-gray-900 hover:text-white",
                  location.pathname === "/dashboard/history" &&
                    "bg-blue-gray-50 text-gray-900",
                )}
              >
                <VscHistory />
                <p>Historial</p>
              </Link>
            </li>
            <li className="w-[80%]">
              <Link
                to="/dashboard/settings"
                className={cx(
                  "flex flex-row items-center gap-2 rounded-lg py-[10px] pl-3 transition-all  hover:bg-blue-gray-900 hover:text-white",
                  location.pathname === "/dashboard/settings" &&
                    "bg-blue-gray-50 text-gray-900",
                )}
              >
                <CiSettings />
                <p>Settings</p>
              </Link>
            </li>
          </ul>
        </aside>
      </main>
    </nav>
  );
}

export default SidebarComponent; 