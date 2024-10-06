import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraph = ({ studentMarks }) => {
  // Extract student names and marks from studentMarks array
  const studentNames = studentMarks.map(student => student.name);
  const studentMarksData = studentMarks.map(student => student.marks);

  // Data to be passed to Chart.js
  const data = {
    labels: studentNames, // x-axis labels (student names)
    datasets: [
      {
        label: 'Marks',
        data: studentMarksData, // y-axis data (student marks)
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for customizing the bar graph
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Marks',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Student Names',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Marks',
        },
        beginAtZero: true, // Start y-axis from 0
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarGraph;
