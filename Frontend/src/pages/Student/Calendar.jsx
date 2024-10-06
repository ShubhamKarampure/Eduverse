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
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Assignment Deadlines Calendar</h1>
            <Calendar
                tileClassName={tileClassName}
                className="w-full max-w-2xl shadow-lg rounded-lg p-4"
            />
        </div>
    );
};

export default AssignmentCalendar;
