import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import bcrypt from 'bcrypt'
import axios from 'axios'
import { UserModel } from "../models/userModel.js";
import { request } from "express";

export const createCourseController = async (req, res) => {
    try {
        const { name, branch, description, instructor, enrollmentKey } = req.body;

        if (!name || !branch || !description || !instructor || !enrollmentKey) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        const branches = ['Computer Engineering', 'Data Science', 'Machine Learning', 'EXTC'];
        if (!branches.includes(branch)) {
            return res.status(401).json({
                success: false,
                message: "Invalid branch"
            });
        }

        const hashedKey = await bcrypt.hash(enrollmentKey, 10);
        req.body.enrollmentKey = hashedKey;

        let imageData = {
            url: null,
            publicId: null,
        };

        if (req.files) {
            const { image } = req.files;

            console.log(image);

            const types = ['image/jpg', 'image/png', 'image/jpeg'];
            if (!types.includes(image.mimetype)) {
                return res.status(401).json({
                    success: false,
                    message: "Use only png, jpg or jpeg files"
                });
            }

            const img = await uploadOnCloud(image.tempFilePath);
            imageData.url = img.url;
            imageData.publicId = img.public_id;
        }

        const course = await CourseModel.create({
            ...req.body,
            image: imageData, 
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateCourseController = async (req, res) => {
    try {
        const id = req.params.id;

        let imageData = null;
        console.log(req.files)
        if (req.files) {
            const { image } = req.files;

            console.log(image);

            const types = ['image/jpg', 'image/png', 'image/jpeg'];
            if (!types.includes(image.mimetype)) {
                return res.status(401).json({
                    success: false,
                    message: "Use only png, jpg or jpeg files"
                });
            }

            const img = await uploadOnCloud(image.tempFilePath);
            imageData = {
                url: img.url,
                publicId: img.public_id,
            };
        }

        const updatedCourse = await CourseModel.findOneAndUpdate(
            { _id: id }, 
            {
                ...req.body,
                ...(imageData && { image: imageData }), 
            },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            updatedCourse
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export const deleteCourseController = async (req, res) => {
    try {
        const id = req.params.id
        const deletedCourse = await CourseModel.deleteOne({ id: id })
        const deletedAssignments = await AssignmentModel.deleteMany({ course: id })
        res.status(200).json({
            success: true,
            message: "Course and related assignments deleted",
            deletedCourse,
            deletedAssignments
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllCoursesByBranchController = async (req, res) => {
    try {
        const branch = req.params.id
        const courses = await CourseModel.find({ branch: branch })
        res.status(200).json({
            success: true,
            message: "Found all courses",
            courses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllCoursesByInstructor = async (req, res) => {
    try {
        console.log(req.headers);
        const { instructorid } = req.headers
        const courses = await CourseModel.find({ instructor: instructorid })
        res.status(200).json({
            success: true,
            message: "Found all courses",
            courses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const enrollStudentController = async (req, res) => {
    try {
        const student = req.params.id
        const { courseId, enrollmentKey } = req.body
        const Course = await CourseModel.findById(courseId)
        if(Course.students.find(student))
                return res.status(401).json({
                    success:false,
                    message:"Student already enrolled"
                })
        const Student = await UserModel.findById(student)
        if (!Course)
            return res.status(401).json({
                success: false,
                message: "Course not found",
            })
        const valid = await bcrypt.compare(enrollmentKey, Course.enrollmentKey)
        if (!valid) {
            return res.status(400).json({
                success: false,
                message: "Invalid Enrollment Key"
            })
        }

        Course.students.push(student)
        Student.enrolledCourses.push(courseId)
        await Course.save()
        await Student.save()
        res.status(201).json({
            success: true,
            message: "Student enrolled",
            Course
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const generateQuizController = async (req, res) => {
    try {
        const courseId = req.params.id
        const course = await CourseModel.findById(courseId)
        const description = course.description
        const response = await axios.post(`${process.env.FLASK_URL}/quiz`, { description }, {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        })
        console.log("response:", response.data);
        course.quiz = response.data.quiz
        console.log("course quiz:", course.quiz)
        course.save()
        res.status(200).json({
            success: true,
            message: "Generated quiz",
            course,
            quiz: response.data.questions
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Course found",
            course
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



