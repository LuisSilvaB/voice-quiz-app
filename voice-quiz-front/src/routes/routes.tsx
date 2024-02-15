import { useRoutes } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/auth/login/index";

const RoutesContainer = () => {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
    ])

    return routes;
}

export default RoutesContainer; 