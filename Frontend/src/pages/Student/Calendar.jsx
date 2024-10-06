import React, { useEffect, useState, memo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';

const DeadlineCalendar = memo(() => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (user && user.enrolledCourses) {
          const fetchedAssignments = [];

          await Promise.all(
            user.enrolledCourses.map(async (course) => {
              const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/assignments`,
                {
                  headers: { course },
                }
              );

              const deadlines = response.data.assignments
                .map((assignment) => assignment.deadline)
                .filter((deadline) => deadline);

              fetchedAssignments.push(...deadlines);
            })
          );

          setAssignments([...new Set(fetchedAssignments)]);
        }
      } catch (error) {
        setError('Error fetching assignments: ' + error.message);
      }
    };

    fetchAssignments();
  }, [user]);

  const tileClassName = ({ date, view }) => {
    if (view !== 'day') return null;

    const classes = ['react-calendar__tile', 'relative flex items-center justify-center'];

    // Check if the date is today
    if (date.toDateString() === new Date().toDateString()) {

      classes.push('today');
    }

    // Check if the date matches any assignment deadline
    if (assignments.some((assignment) => new Date(assignment).toDateString() === date.toDateString())) {
      console.log(assignments.toDateString());
      classes.push('assignment-date');
    }

    return classes.join(' ');
  };

  return (
    <div className="deadline-calendar flex flex-col p-6">
      <h2 className="text-lg font-bold mb-4">Deadlines</h2>
      <Calendar
        tileClassName={tileClassName}
        className="rounded-lg border border-gray-300 shadow-md"
      />
      <div className="mt-4">
        <h3 className="font-semibold">Selected Dates:</h3>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : assignments.length > 0 ? (
          <ul className="mt-2 list-disc list-inside">
            {assignments.map((date, index) => (
              <li key={index} className="text-gray-700">
                {format(new Date(date), 'MM/dd/yyyy')}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No deadlines available.</p>
        )}
      </div>
    </div>
  );
});

export default DeadlineCalendar;
