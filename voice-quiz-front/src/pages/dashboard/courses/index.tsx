import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';

const CoursesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  useEffect(()=>{
    if (location.pathname === "/dashboard/courses" || location.pathname === "/dashboard/courses/") navigate('/dashboard/courses/courses-list')
  },[location.pathname, navigate])
  return (
    <div className="flex flex-col flex-1  justify-start items-start lg:p-0">
      <Outlet/>
    </div>
  );
}

export default CoursesLayout; 