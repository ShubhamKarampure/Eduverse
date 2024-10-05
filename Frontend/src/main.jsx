import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {PageNotFound} from "./components/index.js";
import { ChakraProvider } from "@chakra-ui/react";
import {ViewTeacherCourse} from "./pages/index.js";
import Home from "./pages/Student/Home.jsx";
import Courses from "./pages/Student/Courses.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { 
        path: "/teacher/", 
        element: <ViewTeacherCourse /> 
      },{
      path: "/",
      element: <Courses />,
    }],
    errorElement: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </RouterProvider>
  </StrictMode>
);
