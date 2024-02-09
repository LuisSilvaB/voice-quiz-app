import './App.css'
import './input.css'
import Navbar from './components/layout/navbar'
import { Outlet } from 'react-router-dom'
import RoutesContainer from './routes/routes'

function App() {

  return (
    <div className='bg-white w-screen h-screen flex justify-center items-center'>
      <Navbar />
      <RoutesContainer />
      <Outlet />
    </div>
  )
}

export default App
