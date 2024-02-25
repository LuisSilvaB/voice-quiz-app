import { useRoutes } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/auth/login/index";
import Audio from "../pages/audio/audio";

const RoutesContainer = () => {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        {path: "/record-audio", element: <Audio />},
    ])

    return routes;
}

export default RoutesContainer; 