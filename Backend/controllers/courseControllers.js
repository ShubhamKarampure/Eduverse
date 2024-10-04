import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";
import bcrypt from 'bcrypt'

export const createCourseController=async (req,res)=>{
    try {
        const {name,branch,description,instructor,enrollmentKey}=req.body
        if(!name || !branch || !description || !instructor || !enrollmentKey)
            return res.status(400).json({
                success:false,
                message:"Please enter all fields"
            })
        const branches=['Computer Engineering','Data Science','Machine Learning','EXTC']
        if(!branches.includes(branch))
            return res.status(401).json({
                success:false,
                message:"Invalid branch"
            })
        const hashedKey=await bcrypt.hash(enrollmentKey,10)
        req.body.enrollmentKey=hashedKey
        const course=await CourseModel.create(req.body)
        res.status(201).json({
            success:true,
            message:"Course created successfully",
            course
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const updateCourseController=async(req,res)=>{
    try {
        const id=req.params.id
        const newCourse=await CourseModel.findOneAndUpdate(id,req.body,{new:true})
        res.status(201).json({
            success:true,
            message:"Course updated successfully",
            newCourse
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const deleteCourseController=async(req,res)=>{
    try {
        const id=req.params.id
        const deletedCourse=await CourseModel.deleteOne({id:id})
        const deletedAssignments=await AssignmentModel.deleteMany({course:id})
        res.status(200).json({
            success:true,
            message:"Course and related assignments deleted",
            deletedCourse,
            deletedAssignments
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const getAllCoursesByBranchController=async(req,res)=>{
    try {
        const branch=req.headers.branch
        const courses=await CourseModel.find({branch:branch})
        res.status(200).json({
            success:true,
            message:"Found all courses",
            courses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    } 
}

export const enrollStudentController=async(req,res)=>{
    try {
        const student=req.params.id
        const {courseId,enrollmentKey}=req.body
        const Course=await CourseModel.findById(courseId)
        if(!Course)
            return res.status(401).json({
                success:false,
                message:"Course not found",
            })  
        
        const valid=await bcrypt.compare(enrollmentKey,Course.enrollmentKey)
        if(!valid){
            return res.status(400).json({
                success:false,
                message:"Invalid Enrollment Key"
            })
        }  

        Course.students.push(student)
        await Course.save()
        res.status(201).json({
            success:true,
            message:"Student enrolled",
            Course
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}



