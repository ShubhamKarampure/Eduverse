import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from '../../components/index.js';
import { Example } from '../../components/Sidebar.jsx';
import { SquishyCard } from '../../components/index.js';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Outlet, useParams } from 'react-router-dom';

const ViewTeacherCourse = () => {
  const [courses, setCourses] = useState([]);
  const {teacherId}=useParams()
  useEffect(() => {
      const arr = [
          {
              name: 'Introduction to Machine Learning',
              description: 'A beginner course on machine learning concepts and algorithms.',
              branch: 'Computer Science',
          },
          {
              name: 'Digital Signal Processing',
              description: 'Explore the principles of digital signals and systems.',
              branch: 'Electronics',
          },
          {
              name: 'Thermodynamics',
              description: 'Study the fundamentals of heat and energy transfer.',
              branch: 'Mechanical Engineering',
          },
          {
              name: 'Structural Analysis',
              description: 'Understand the mechanics of structures and building design.',
              branch: 'Civil Engineering',
          },
          {
              name: 'Organizational Behavior',
              description: 'Learn about the behavior of individuals and groups within organizations.',
              branch: 'Business Administration',
          },
      ];
      setCourses(arr);
  }, []);
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
      <div>
          <div className='relative w-full mt-4'>
              {/* Left Arrow */}
              <button
                  className='absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200'
                  onClick={() => scroll('left')}
              >
                  <FiChevronLeft size={24} />
              </button>

              {/* Carousel container */}
              <div
                  ref={carouselRef}
                  className='flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar space-x-4 p-4 custom-scrollbar'
              >
                  {
                      courses.map((course, index) => {
                          return (
                              <SquishyCard name={course.name} description={course.description} branch={course.branch} key={index} />
                          )
                      })
                  }
              </div>

              {/* Right Arrow */}
              <button
                  className='absolute top-0 right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200'
                  onClick={() => scroll('right')}
              >
                  <FiChevronRight size={24} />
              </button>
          </div>
      </div>
  )
}

export default ViewTeacherCourse;
