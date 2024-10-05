import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ViewTeacherCourse } from "./pages/index.js";
import { PageNotFound } from "./components/index.js";
import { ChakraProvider } from '@chakra-ui/react';
import Home from "./pages/Student/Home.jsx";
import Courses from "./pages/Student/Courses.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import MyCourses from "./pages/Student/MyCourses.jsx";
import Calendar from "./pages/Student/Calendar.jsx";
import Quiz from "./pages/Student/Quiz.jsx";
import IndividualCourse from "./pages/IndividualCourse.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/teacher/",
        element: <ViewTeacherCourse />
      }, {
        path: "/",
        element: <Courses />,
      }, {
        path: '/mycourses',
        element: <MyCourses />,
      },{
        path: '/calendar',
        element: <Calendar/>
      }, {
        path: '/quiz',
        element: <Quiz />
      },{
        path: '/mycourses/:courseId',
        element: <IndividualCourse/>
      }
    ],
    errorElement: <PageNotFound />
  },
  {
    path: "/register",
    element: <Register />,
    children: [

    ],
    errorElement: <PageNotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    children: [

    ],
    errorElement: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
