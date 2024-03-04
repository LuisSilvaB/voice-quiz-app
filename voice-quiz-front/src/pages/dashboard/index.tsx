import React from 'react'
import { Outlet } from 'react-router-dom';
import SidebarComponent from '../../components/layout/sidebar';
interface DashboardProps {
    children?: React.ReactNode; 
} 

const Dashboard:React.FC<DashboardProps> = () => {
  return (
    <div className='w-full h-full flex-1 flex flex-row'>
        <SidebarComponent />   
        {/* <Audio />    */}
        <Outlet />
    </div>
  )
}

export default Dashboard; 