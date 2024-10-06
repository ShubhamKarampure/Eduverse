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
import ProfilePage from "./pages/Student/Profile.jsx";
import CoursePage from "./pages/Student/CourseDetails.jsx";
import TeacherProfile from "./components/TeacherProfile.jsx";
import LandingPage from "./pages/landingPage.jsx";
import Blog from "./pages/Blog.jsx";
import TeacherCourse from './components/TeacherCourse.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<LandingPage/>,
    errorElement: <PageNotFound/>
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "teacher",
        element: <ViewTeacherCourse />
      }, {
        path: "",
        element: <Courses />,
      }, {
        path: "mycourses",
        element: <MyCourses />,
      },{
        path: "calendar",
        element: <Calendar/>
      }, {
        path: 'quiz/:id',
        element: <Quiz />
      }, {
        path: 'profile',
        element: <ProfilePage />
      }, {
        path: 'course-details/:id',
        element: <CoursePage />
      },{
        path: 'teacherProfile',
        element:<TeacherProfile/>
      },{
        path: 'blog',
        element: <Blog/>
      },{
        path: '/home/teacher-add-course',
        element: <TeacherCourse/>
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
