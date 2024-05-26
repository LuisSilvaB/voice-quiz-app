import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom';
import SidebarComponent from '../../components/layout/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { RootState, AppDispatch } from '../../app/store';
import { isRegisterOnDB } from '../../features/db-features/users.db.features';
import { CgSpinner } from 'react-icons/cg';
interface DashboardProps {
    children?: React.ReactNode; 
} 

const DashboardLayout:React.FC<DashboardProps> = () => {
  const user = useSelector((state:RootState) => state.users);
  const userAuth = useSelector((state:RootState) => state.userAuth);
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch<AppDispatch>();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fn = async () => {
      try {
        const data = await dispatch(isRegisterOnDB(userId ?? ""));
        if (!data.payload && !userId) {
          navigate('/auth/login');        
        }
        else if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
          navigate('/dashboard/courses');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fn(); 
  }, [userAuth]);

  if (user.userLoading)
    return (
      <div className="flex-1 w-full flex justify-center items-center">
        <CgSpinner className="h-auto w-20 animate-spin text-tangaroa-500" />
      </div>
    );

  return (
    <div className='w-full h-full flex-1 flex flex-row'>
        <SidebarComponent />   
        <Outlet />
    </div>
  )
}

export default DashboardLayout; 