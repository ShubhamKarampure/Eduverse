import React, { useEffect, useRef, useState } from "react";
import { SquishyCard } from "../../components/index.js";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { getAllCoursesByInstructor } from "../../APIRoutes/index.js";

const ViewTeacherCourse = () => {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate=useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      if(user.role.toLowerCase()==='student'){
        navigate('/')
      }
      try {
        const response = await axios.get(`${getAllCoursesByInstructor}`, {
          headers: {
            "instructorid": `${user._id}`
          }
        });
        if (response.data.success) {
          // console.log(response.data.courses);
          
          setCourses(response.data.courses);
          localStorage.setItem('teacher-courses', JSON.stringify(response.data.courses));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCourses();
  }, [])
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
          <FiChevronLeft size={24} className="text-black" />
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
                id={course._id}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute top-0 right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200"
          onClick={() => scroll("right")}
        >
          <FiChevronRight size={24} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default ViewTeacherCourse;
