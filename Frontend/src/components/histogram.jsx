import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const Histogram = ({ studentMarks }) => {
  // Create bins for the histogram
  const marks = studentMarks.map(student => student.marks); // Extract marks from student data
  const maxMark = Math.max(...marks);  // Get the maximum mark to determine bin range
  const binSize = 10; // Define the size of each bin (e.g., 10 marks per bin)
  
  const bins = Array(Math.ceil(maxMark / binSize)).fill(0); // Create bins of size binSize
  
  // Populate the bins based on student marks
  marks.forEach(mark => {
    const binIndex = Math.floor(mark / binSize);
    bins[binIndex]++;
  });
  // Define data for Chart.js
  const data = {
    labels: bins.map((_, index) => `${index * binSize}-${(index + 1) * binSize}`), // Bin labels (e.g., 0-10, 11-20)
    datasets: [
      {
        label: 'Number of Students',
        data: bins,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  // Define options for Chart.js
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Marks Histogram',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Marks Range',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Students',
        },
        beginAtZero: true,
      },
    },
  };
  return <Bar data={data} options={options} />;
};
export default Histogram;