import express from 'express'
import { signupController,loginController,updateProfileController } from "../controllers/userControllers.js";
import fileUpload from 'express-fileupload'
import {  getAssignmentsByCourseController } from '../controllers/assignmentControllers.js';
import { getAllCoursesByBranchController, getLeaderboard } from '../controllers/courseControllers.js';
const router=express.Router()

router.route('/signup').post(signupController)
router.route('/login').post(loginController)
router.route('/:id').patch(fileUpload({
    useTempFiles: true,
    tempFileDir: 'C:/Windows/Temp'
}),updateProfileController)
router.route('/assignments').get(getAssignmentsByCourseController)
router.route('/course/:id').get(getLeaderboard)
export const userRouter=router