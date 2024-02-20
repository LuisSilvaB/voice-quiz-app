import './App.css'
import './input.css'
import Navbar from './components/layout/navbar'
import { Outlet } from 'react-router-dom'
import RoutesContainer from './routes/routes'

function App() {

  return (
    <div className='bg-white w-screen h-full min-h-screen items-center  flex flex-col m-0 p-0'>
      <div className='max-w-[1920px] w-full h-full m-0 p-0'>
        <Navbar />
        <RoutesContainer />
        <Outlet />
      </div>
    </div>
  )
}

export default App
