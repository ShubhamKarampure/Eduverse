import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

export const createAssignmentController=async(req,res)=>{
    try {
        const {deadline,course,description,criteria}=req.body
        if(!deadline || !course || !description || !criteria)
            return res.status(401).json({
                success:false,
                message:"Enter all fields"
            })
        const Assignment=await AssignmentModel.create(req.body)
        const courseObject=await CourseModel.findById(course)
        courseObject.assignments.push(Assignment._id)
        courseObject.save()
        res.status(201).json({
            success:true,
            message:"Assignment created",
            Assignment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const deleteAssignmentController=async(req,res)=>{
    try {
        const assignment=req.params.id
        const deletedAssignment=await AssignmentModel.findOneById(assignment)
        res.status(200).json({
            success:true,
            message:"Assignment deleted",
            deletedAssignment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const updateAssignmentController=async(req,res)=>{
    try {
        const assignment=req.params.id
        const updatedAssignment=await AssignmentModel.findByIdAndUpdate(assignment,req.body,{new:true})
        if(req.body.deadline){
            let n=updatedAssignment.submissions.length
            for(let i=0;i<n;i++) updatedAssignment.submissions[i].false=(submissionDate>deadline)
        }
        res.status(200).json({
            success:true,
            message:"Assignment updated",
            updatedAssignment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const submitAssignment=async(req,res)=>{
    try {
        const studentId=req.params.id
        const {submissionFile}=req.files
        console.log(submissionFile);
        const {assignmentId} =req.body
        if(submissionFile.mimetype!='application/pdf')
            return res.status(401).json({
                success:false,
                message:"Use only pdf format"
            })
        const submission=await uploadOnCloud(submissionFile.tempFilePath)
        const assignment=await AssignmentModel.findById(assignmentId)
        assignment.submissions.push({student:studentId,submission,submissionDate:Date.now(),late:(Date.now()>assignment.deadline)})
        assignment.save()
        res.status(201).json({
            success:true,
            message:"Assignment submitted",
            assignment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const getAssignmentsByCourseController=async(req,res)=>{
    try {
        const {course}=req.headers
        console.log(course);        
        const assignments=await AssignmentModel.find({course:course})
        res.status(200).json({
            success:true,
            message:"Assignments fetched",
            assignments
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const gradeAssignmentController=async(req,res)=>{
    try {
        const {studentId,assignmentId}=req.body
        const assignment= await AssignmentModel.findById(assignmentId)
        const criteria=assignment.criteria
        const submission=assignment.submissions.find((submission)=>submission.student==studentId)
        const pdf_url=submission.submission
        console.log({pdf_url,criteria});        
        const response=await axios.post(`${process.env.FLASK_URL}/grade`,{pdf_url,criteria},{
            headers:{
                "Content-type":"application/json",
            },
            credentials:true
        })
        const evaluation=response.data
        submission.grade=response.data.grade
        assignment.save()
        res.status(200).json({
            success:true,
            message:"Assignment evaluated successfully",
            evaluation,
            assignment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}