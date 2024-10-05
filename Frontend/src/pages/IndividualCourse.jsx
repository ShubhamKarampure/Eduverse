import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'


function IndividualCourse() {
    const {courseId}=useParams()
    useEffect(()=>{

    },[])
  return (
    <div>{courseId}</div>
  )
}

export default IndividualCourse