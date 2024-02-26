import { useRoutes } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/auth/login/index";
// import Audio from "../pages/audio/audio";
import Dashboard from "../pages/dashboard";
import Error from "../pages/error";
import ClassRecords from "../pages/dashboard/class-record";
import SaveData from "../pages/dashboard/save-data/save-data";

const RoutesContainer = () => {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/auth/login", element: <Login /> },
        { path: "/dashboard", element: <Dashboard />, children: [
            {path: "/dashboard/" , element: <ClassRecords />},
            {path: "/dashboard/save-data", element: <SaveData /> },
        ]},
        { path: "/*", element: <Error /> },
    ])

    return routes;
}

export default RoutesContainer; 