import { useRoutes } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/auth/login/index";
// import Audio from "../pages/audio/audio";
import DashboardLayout from "../pages/dashboard";
import Error from "../pages/error";
import CoursesLayout from "../pages/dashboard/courses";
import SaveData from "../pages/dashboard/save-data/save-data";
import History from "../pages/dashboard/history";
import Settings from "../pages/dashboard/settings";
import Sessions from "../pages/dashboard/courses/sessions-list";
import CursesList from "../pages/dashboard/courses/courses-list";
import Course from "../pages/dashboard/courses/course";

const RoutesContainer = () => {
    const routes = useRoutes([
        { path: "/", element: <Home /> },
        { path: "/auth/login", element: <Login /> },
        { 
          path: "/dashboard", 
          element: <DashboardLayout />, 
          children: [
            { 
              path: "courses", 
              element: <CoursesLayout />, 
              children:[
                { path: "courses-list", element: <CursesList /> },
                { path: "course/:id", element: <Course /> },
                { path: "sessions-list/:id", element: <Sessions /> },
              ]
            },
            { path: "save-data", element: <SaveData /> },
            { path: "history", element: <History /> },
            { path: "settings", element: <Settings /> },
          ]
        },
        { path: "*", element: <Error /> },
    ]);

    return routes;
}

export default RoutesContainer;
