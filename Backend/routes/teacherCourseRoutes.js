import express from 'express'
import { createCourseController,updateCourseController,deleteCourseController, generateQuizController, getAllCoursesByInstructor} from '../controllers/courseControllers.js'

const router=express.Router()

router.route('/').post(createCourseController).get(getAllCoursesByInstructor)
router.route('/:id').patch(updateCourseController).delete(deleteCourseController).get(generateQuizController)

export const teacherCourseRouter = router