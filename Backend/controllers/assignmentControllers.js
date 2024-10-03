import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

export const createAssignmentController=async(req,res)=>{
    try {
        const {deadline,course,description}=req.body
        if(!deadline || !course || !description)
            return res.status(401).json({
                success:false,
                message:"Enter all fields"
            })
        const Assignment=await AssignmentModel.create(req.body)
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