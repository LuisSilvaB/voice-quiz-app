import './App.css'
import './input.css'
import Navbar from './components/layout/navbar'
import { Outlet } from 'react-router-dom'
import RoutesContainer from './routes/routes'

function App() {

  return (
    <div className='bg-white w-screen border border-solid h-screen flex items-center  flex-col'>
      <Navbar />
      <RoutesContainer />
      <Outlet />
    </div>
  )
}

export default App
