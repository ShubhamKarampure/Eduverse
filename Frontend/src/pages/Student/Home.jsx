import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../../components/index.js";
import { Example } from "../../components/Sidebar.jsx";
import { SquishyCard } from "../../components/index.js";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Home = () => {
<<<<<<< HEAD
  useEffect(() => {
    const user =JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role.toLowerCase() === "teacher") Navigate("/teacher");
    } else {
    //   Navigate("/login");
    }
  }, []);
  return (
    <div className="flex h-screen">
      <div className="sticky top-0 h-screen shrink-0">
        <Example />
      </div>
      <div className="flex-1 w-full overflow-y-auto">
        <div className="flex flex-col">
          <Navbar />
          <Outlet />
=======
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            if (user.role.toLowerCase() === "teacher") Navigate("/teacher");
        } else {
            Navigate("/login");
        }
    }, []);
    return (
        <div className="flex h-screen">
            <div className="sticky top-0 h-screen shrink-0">
                <Example />
            </div>
            <div className="flex-1 w-full overflow-y-auto">
                <div className="flex flex-col">
                    <Navbar />
                    <Outlet />
                </div>
            </div>
>>>>>>> 80b7e0ae546c7b24aad05acaf9013203331a1844
        </div>
    );
};

export default Home;
