import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SquishyCard } from "../../components";

function ViewTeacherCourse() {
  const [courses, setCourses] = useState([]);
  const { teacherId } = useParams();
  console.log(teacherId);
  const getCourses = (teacherId) => {
    const arr = [
      {
        name: "Introduction to Machine Learning",
        description:
          "A beginner course on machine learning concepts and algorithms.",
        branch: "Computer Science",
      },
      {
        name: "Digital Signal Processing",
        description: "Explore the principles of digital signals and systems.",
        branch: "Electronics",
      },
      {
        name: "Thermodynamics",
        description: "Study the fundamentals of heat and energy transfer.",
        branch: "Mechanical Engineering",
      },
      {
        name: "Structural Analysis",
        description:
          "Understand the mechanics of structures and building design.",
        branch: "Civil Engineering",
      },
      {
        name: "Organizational Behavior",
        description:
          "Learn about the behavior of individuals and groups within organizations.",
        branch: "Business Administration",
      },
    ];
    setCourses(arr);
  };
  useEffect(() => getCourses(teacherId), []);
  return (
    <div className="w-full h-full text-black">
      <div>
        {courses.map((course) => (
          <SquishyCard
            name={course.name}
            description={course.description}
            branch={course.branch}
          />
        ))}
      </div>
    </div>
  );
}

export default ViewTeacherCourse;
