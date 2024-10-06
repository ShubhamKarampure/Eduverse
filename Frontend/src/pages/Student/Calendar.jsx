import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css'; // Keep this for basic calendar structure
import { host } from '../../APIRoutes';
import './calendarStyles.css'

const AssignmentCalendar = () => {
    const [deadlines, setDeadlines] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch deadlines using axios
    useEffect(() => {
        const fetchDeadlines = async () => {
            try {
                const response = await axios.get(`${host}/student/assignment/${user._id}`);
                if (response.data.success) {
                    setDeadlines(response.data.deadlines);
                }
            } catch (error) {
                console.error("Error fetching deadlines:", error);
            }
        };

        fetchDeadlines();
    }, [user._id]); // Add user._id as dependency to rerun when it changes

    // Function to format dates for comparison
    const formatDate = (dateString) => {
        return new Date(dateString).toDateString();
    };

    // Tailwind-based coloring for calendar tiles
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const deadline = deadlines.find((d) => formatDate(d.deadline) === date.toDateString());

            if (deadline) {
                return deadline.submitted
                    ? 'submitted'   // Add specific classes for submitted
                    : 'unsubmitted'; // And unsubmitted
            }
        }
        return null;
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

export default AssignmentCalendar;
