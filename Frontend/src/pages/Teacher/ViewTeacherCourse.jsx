import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../../components/index.js";
import { Example } from "../../components/Sidebar.jsx";
import { SquishyCard } from "../../components/index.js";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ViewTeacherCourse = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const storedCourses = localStorage.getItem("teacherCourses");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role.toLowerCase() === "Student") {
        Navigate("/");
      }
      // if (storedCourses) {
      //   setCourses(storedCourses);
      // } else {
      //   axios
      //     .get(
      //       String(import.meta.env.VITE_BACKEND_URL) +
      //         "/api/v1/user/teacher/course",
      //       {
      //         headers: {
      //           instructorid: "66feea7bde656c626f7b53c8",
      //         },
      //       }
      //     )
      //     .then((res) => {
      //       console.log(res);
      //       setCourses(res.data.courses);
      //     })
      //     .catch((e) => console.log(e));
      // }
    } else {
      // Navigate('login')
    }
    if (storedCourses) {
      setCourses(storedCourses);
    } else {
      axios
        .get(
          String(import.meta.env.VITE_BACKEND_URL) +
          "/api/v1/user/teacher/course",
          {
            headers: {
              instructorid: "66feea7bde656c626f7b53c8",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setCourses(res.data.courses);
        })
        .catch((e) => console.log(e));
    }
  }, []);
  const carouselRef = useRef(null);

  // Scroll function
  const scroll = (direction) => {
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  return (
    <div>
      <div className="relative w-full mt-4">
        {/* Left Arrow */}
        <button
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200"
          onClick={() => scroll("left")}
        >
          <FiChevronLeft size={24} />
        </button>

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar space-x-4 p-4 custom-scrollbar"
        >
          {courses.map((course, index) => {
            return (
              <SquishyCard
                name={course.name}
                description={course.description}
                branch={course.branch}
                key={index}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute top-0 right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200"
          onClick={() => scroll("right")}
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ViewTeacherCourse;
