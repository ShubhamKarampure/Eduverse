import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ViewTeacherCourse() {
    const [courses,setCourses]=useState([])
    const {teacherId}=useParams()
    console.log(teacherId);
    const getCourses=(teacherId)=>{

      setCourses(['DS','FDS'])
    }
    useEffect((()=>getCourses(teacherId)),[])
  return (
    <div className='w-full h-full text-black bg-red-50'>
      <div>
        {courses.map((c)=>(
          <div key={c}>
            {c}
          </div>
        ))}
      </div>

    </div>
  )
}

export default ViewTeacherCourse