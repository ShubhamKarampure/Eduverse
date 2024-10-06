import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import { deleteFromCloud } from "../utils/cloudinary.js";
import dotenv from 'dotenv'
import axios from 'axios'
import { request } from "express";
import { UserModel } from "../models/userModel.js";
dotenv.config()

export const createAssignmentController = async (req, res) => {
    try {
        const { deadline, course, description, criteria } = req.body
        if (!deadline || !course || !description || !criteria)
            return res.status(401).json({
                success: false,
                message: "Enter all fields"
            })
        const Assignment = await AssignmentModel.create(req.body)
        const courseObject = await CourseModel.findById(course)
        courseObject.assignments.push(Assignment._id)
        courseObject.save()
        res.status(201).json({
            success: true,
            message: "Assignment created",
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

export const deleteAssignmentController = async (req, res) => {
    try {
        const assignment = req.params.id
        const deletedAssignment = await AssignmentModel.findOneById(assignment)
        res.status(200).json({
            success: true,
            message: "Assignment deleted",
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

export const updateAssignmentController = async (req, res) => {
    try {
        const assignment = req.params.id
        const updatedAssignment = await AssignmentModel.findByIdAndUpdate(assignment, req.body, { new: true })
        if (req.body.deadline) {
            let n = updatedAssignment.submissions.length
            for (let i = 0; i < n; i++) updatedAssignment.submissions[i].false = (submissionDate > deadline)
        }
        res.status(200).json({
            success: true,
            message: "Assignment updated",
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

export const submitAssignment = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { submissionFile } = req.files;
        const { assignmentId } = req.body;
        // Find the assignment by ID
        const assignment = await AssignmentModel.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        // Check if the file is a PDF
        if (submissionFile.mimetype !== 'application/pdf') {
            return res.status(401).json({
                success: false,
                message: "Use only pdf format"
            });
        }

        // Upload the submission file to the cloud
        const { public_id, url } = await uploadOnCloud(submissionFile.tempFilePath);
        console.log("public_id,url", public_id, url);

        // Check if the student has already submitted
        const index = assignment.submissions.findIndex(submission => submission.student == studentId);
        console.log('Submission index:', index);

        if (index === -1) {
            // New submission, push to the submissions array
            assignment.submissions.push({
                student: studentId,
                submission: url,
                public_id,
                submissionDate: Date.now(),
                late: Date.now() > assignment.deadline
            });
        } else {
            // Update the existing submission
            const existingSubmission = assignment.submissions[index];
            console.log("public id to be deleted:", existingSubmission.public_id);
            const response = await deleteFromCloud(existingSubmission.public_id)
            console.log(response);
            // Keep the rest of the fields and update only url and public_id
            assignment.submissions[index] = {
                student: existingSubmission.student,
                submission: url,
                public_id,
                submissionDate: Date.now(),
                late: Date.now() > assignment.deadline
            };
        }

        // Save the updated assignment
        await assignment.save();

        // Respond with success
        res.status(201).json({
            success: true,
            message: "Assignment submitted",
            assignment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


export const getAssignmentsByCourseController = async (req, res) => {
    try {
        const { course } = req.headers
        console.log(course);
        const assignments = await AssignmentModel.find({ course: course })
        res.status(200).json({
            success: true,
            message: "Assignments fetched",
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

export const gradeAssignmentController = async (req, res) => {
    try {
        const studentId = req.headers.studentid;
        const assignmentId = req.headers.assignmentid;
        const assignment = await AssignmentModel.findById(assignmentId)
        const criteria = assignment.criteria
        const submission = assignment.submissions.find((submission) => submission.student == studentId)
        const pdf_url = submission.submission
        console.log({ pdf_url, criteria });
        const response = await axios.post(`${process.env.FLASK_URL}/grade`, { pdf_url, criteria }, {
            headers: {
                "Content-type": "application/json",
            },
            credentials: true
        })
        const evaluation = response.data
        submission.grade = response.data.grade
        await assignment.save()
        res.status(200).json({
            success: true,
            message: "Assignment evaluated successfully",
            evaluation,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const getAssignmentByStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await UserModel.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        let deadlines = [];

        // Loop over each enrolled course
        for (let i = 0; i < student.enrolledCourses.length; i++) {
            const courseId = student.enrolledCourses[i];
            const course = await CourseModel.findById(courseId);

            if (course) {
                // Loop over each assignment in the course
                for (let j = 0; j < course.assignments.length; j++) {
                    const assignmentId = course.assignments[j];
                    const assignment = await AssignmentModel.findById(assignmentId);

                    if (assignment) {
                        // Check if the student has submitted this assignment
                        const hasSubmitted = assignment.submissions.some(submission => submission.student == studentId);

                        // Add to the deadlines array with both deadline and submitted status
                        deadlines.push({
                            deadline: assignment.deadline,
                            submitted: hasSubmitted,
                        });
                    }
                }
            }
        }

        // Send the response with all deadlines and submission statuses
        res.status(200).json({
            success: true,
            message: 'Assignments Fetched',
            deadlines
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
