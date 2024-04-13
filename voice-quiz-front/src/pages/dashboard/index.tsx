import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom';
import SidebarComponent from '../../components/layout/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
interface DashboardProps {
    children?: React.ReactNode; 
} 

const DashboardLayout:React.FC<DashboardProps> = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  if (location.pathname === "/dashboard" || location.pathname === "/dashboard/"  ) {
    navigate('/dashboard/courses')
  }
  useEffect(()=>{
    if (location.pathname === "/dashboard") {
      navigate('/dashboard/courses')
    }
  },[location.pathname, navigate])
  return (
    <div className='w-full h-full flex-1 flex flex-row'>
        <SidebarComponent />   
        <Outlet />
    </div>
  )
}

export default DashboardLayout; 