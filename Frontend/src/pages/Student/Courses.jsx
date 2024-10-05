import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from '../../components/index.js';
import { Example } from '../../components/Sidebar.jsx';
import { SquishyCard } from '../../components/index.js';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { getAllCoursesByBranchRoute } from '../../APIRoutes/index.js';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const branch = user?.branch;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${getAllCoursesByBranchRoute}/${branch}`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setCourses(response.data.courses);
                    localStorage.setItem('student-courses', JSON.stringify(response.data.courses));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCourses();
    }, [branch]);

    // Reference for the scrollable container
    const carouselRef = useRef(null);

    // Scroll function
    const scroll = (direction) => {
        if (direction === 'left') {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        } else {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className='bg-white'>
            <div className='relative w-full mt-4'>
                {/* Left Arrow */}
                <button
                    className='absolute left-0 z-10 p-2 mx-4 bg-white rounded-full shadow-lg hover:bg-gray-200'
                    onClick={() => scroll('left')}
                >
                    <FiChevronLeft size={24} className='text-black' />
                </button>

                {/* Carousel container */}
                <div
                    ref={carouselRef}
                    className='flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar space-x-4 p-4'
                >
                    {
                        courses.map((course, index) => {
                            const imageUrl = course?.image?.url; // Safely access image URL
                            return (
                                <SquishyCard
                                    id={course._id}
                                    name={course.name}
                                    description={course.description}
                                    branch={course.branch}
                                    studentId={user._id}
                                    students={course.students}
                                    key={index}
                                    background={imageUrl} // Pass the image URL to SquishyCard
                                />
                            )
                        })
                    }
                </div>

                {/* Right Arrow */}
                <button
                    className='absolute top-0 right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 mx-4'
                    onClick={() => scroll('right')}
                >
                    <FiChevronRight size={24} className='text-black' />
                </button>
            </div>
        </div>
    )
};

export default Courses;
