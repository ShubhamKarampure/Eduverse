import React, { useEffect, useRef, useState } from 'react';
import { SquishyCard } from '../../components/index.js';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const id = user._id;
    const branch = user.branch;

    // Set courses from localStorage or fetch from API
    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem('student-courses')) || [];
        setCourses(storedCourses);

        // Filter enrolled courses
        const filteredEnrolledCourses = storedCourses.filter(course => course.students.includes(id));
        setEnrolledCourses(filteredEnrolledCourses);
    }, [id]);

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
            {
                enrolledCourses.length === 0 ? <div className='flex justify-center items-center'><p className='text-3xl text-center font-bold text-blue-200'>You have no enrolled courses...</p></div> : <div className='relative w-full mt-4'>
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
                        className='flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar space-x-4 p-4 custom-scrollbar'
                    >
                        {
                            enrolledCourses.map((course, index) => {
                                return (
                                    <SquishyCard
                                        name={course.name}
                                        description={course.description}
                                        branch={course.branch}
                                        studentId={user._id}
                                        students={course.students}
                                        key={index}
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
            }
        </div>
    );
}

export default MyCourses;
