import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageNotFound } from "./components/index.js";
import { ChakraProvider } from '@chakra-ui/react';
import Home from "./pages/Student/Home.jsx";
import Courses from "./pages/Student/Courses.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import MyCourses from "./pages/Student/MyCourses.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

    ],
    errorElement: <PageNotFound />,
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
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "/home",
        element: <Courses />,
      },
      {
        path: "/home/mycourses",
        element: <MyCourses />,
      },
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
