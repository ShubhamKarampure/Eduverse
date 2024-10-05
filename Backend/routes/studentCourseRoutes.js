import express from 'express'
import { enrollStudentController, getAllCoursesByBranchController} from '../controllers/courseControllers.js'
import { evaluationController } from '../controllers/testControllers.js'
const router=express.Router()


router.route('/:id').post(enrollStudentController).get(getAllCoursesByBranchController)

router.route('/quiz').post(evaluationController)

export const studentCourseRouter = router