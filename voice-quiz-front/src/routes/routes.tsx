import { useRoutes } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/auth/login/index";
// import Audio from "../pages/audio/audio";
import DashboardLayout from "../pages/dashboard";
import Error from "../pages/error";
import CoursesLayout from "../pages/dashboard/courses/layout";
import SaveData from "../pages/dashboard/save-data/save-data";
import History from "../pages/dashboard/history";
import Settings from "../pages/dashboard/settings";
import CursesList from "../pages/dashboard/courses/courses-list";
import Course from "../pages/dashboard/courses/course";
import Session from "../pages/dashboard/courses/session";
import MyQuizzes from "../pages/dashboard/quizzes/my-quizzes";
import EditQuiz from "../pages/dashboard/quizzes/my-quizzes/edit-quiz";
import CreateQuiz from "../pages/dashboard/quizzes/my-quizzes/create-quiz";
import Quiz from "../pages/dashboard/quizzes/quiz";
import StastQuiz from "../pages/dashboard/quizzes/my-quizzes/stats-quiz/stats-quiz";

const RoutesContainer = () => {
    const routes = useRoutes([
      { path: "/", element: <Home /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/quiz/:quizId", element: <Quiz /> },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "courses",
            element: <CoursesLayout />,
            children: [
              { path: "courses-list", element: <CursesList /> },
              { path: "course/:courseId", element: <Course /> },
              {
                path: "course/:courseId/session/:sessionId",
                element: <Session />,
              },
            ],
          },
          { path: "save-data", element: <SaveData /> },
          {
            path: "my-quizzes",
            element: <MyQuizzes />,
          },
          { path: "my-quizzes/edit-quiz/:quizId", element: <EditQuiz /> },
          { path: "my-quizzes/create-quiz/", element: <CreateQuiz /> },
          { path: "my-quizzes/stats-quiz/:quizId", element: <StastQuiz /> },
          { path: "history", element: <History /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      { path: "*", element: <Error /> },
    ]);

    return routes;
}

export default RoutesContainer;
