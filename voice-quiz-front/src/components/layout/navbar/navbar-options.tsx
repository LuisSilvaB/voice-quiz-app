import cx from "../../../libs/cx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface NavbarOptiosInterface extends  React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
    onToggle: () => void;
    onClose: () => void;
    isOpen: boolean;
  }
  
  const NavbarOptions:React.FC<NavbarOptiosInterface> = ({isOpen, onClose}) => {
    const user = useSelector((state:RootState) => state.users);
    const rol = useSelector((state:RootState) => state.roles);

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
        {
            user.user && user.user.state === "active" && rol.rol.name === "TEACHER" ? (
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
                    location.pathname.includes("dashboard") && "bg-[#598392]",
                    )}
                />
                </Link>
            ) : null
        }

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

export default NavbarOptions; 