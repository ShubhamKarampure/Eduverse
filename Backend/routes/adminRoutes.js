import express from 'express'
import { getAllUsers,deleteAllUsers,getAllCourses,deleteAllCourses, getAllAssignments } from '../controllers/adminController.js'

const router=express.Router();

router.route('/users').get(getAllUsers).delete(deleteAllUsers)
router.route('/courses').get(getAllCourses).delete(deleteAllCourses)
router.route('/assignments').get(getAllAssignments)
export const adminRouter=router