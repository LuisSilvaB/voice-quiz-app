import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom';
import SidebarComponent from '../../components/layout/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { RootState } from '../../app/store';

interface DashboardProps {
    children?: React.ReactNode; 
} 

const DashboardLayout:React.FC<DashboardProps> = () => {
  const userAuth = useSelector((state:RootState) => state.userAuth);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(()=>{
    if (!userAuth.userAuthInfo) {
      navigate('/auth/login');
    } else if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      navigate('/dashboard/courses');
    }
  }, [userAuth.userAuthInfo, location.pathname, navigate]);
  return (
    <div className='w-full h-full flex-1 flex flex-row'>
        <SidebarComponent />   
        <Outlet />
    </div>
  )
}

export default DashboardLayout; 