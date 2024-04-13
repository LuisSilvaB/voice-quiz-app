import 'regenerator-runtime/runtime'
import './App.css'
import './input.css'
import Navbar from './components/layout/navbar'
import { Outlet } from 'react-router-dom'
import RoutesContainer from './routes/routes'
import AuthContextProvider from './context/auth-context'

function App() {

  return (
    <AuthContextProvider>  
      <main className="box-border bg-white w-full h-full min-h-screen items-center flex flex-col m-0 p-0">
        <div className="max-w-[1920px] flex-1 flex flex-col h-full m-0 p-0 w-full">
            <Navbar />
            <RoutesContainer />
            <Outlet />
        </div>
      </main>
    </AuthContextProvider>
  );
}

export default App
