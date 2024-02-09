import { useRoutes } from "react-router-dom";
import Home from "../pages/home/home";

const RoutesContainer = () => {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
    ])

    return routes;
}

export default RoutesContainer; 