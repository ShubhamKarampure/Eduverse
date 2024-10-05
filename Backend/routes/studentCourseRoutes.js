import express from 'express'
import { enrollStudentController, getAllCoursesByBranchController} from '../controllers/courseControllers.js'

const router=express.Router()


router.route('/:id').post(enrollStudentController).get(getAllCoursesByBranchController)

export const studentCourseRouter = router