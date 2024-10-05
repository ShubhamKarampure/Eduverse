import { UserModel } from "../models/userModel.js";
import { CourseModel } from "../models/courseModel.js";
import { AssignmentModel } from "../models/assignmentModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.status(201).json({
            success: true,
            users: users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const deleteAllUsers = async (req, res) => {
    try {
        const users = await UserModel.deleteMany({}, { new: true })
        res.status(201).json({
            success: true,
            users: users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.find({})
        res.status(201).json({
            success: true,
            courses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const deleteAllCourses = async (req, res) => {
    try {
        const courses = await CourseModel.deleteMany({}, { new: true })
        res.status(201).json({
            success: true,
            courses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await AssignmentModel.find({})
        res.status(201).json({
            success: true,
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


