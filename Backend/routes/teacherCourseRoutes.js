import express from 'express'
import { createCourseController,updateCourseController,deleteCourseController} from '../controllers/courseControllers.js'

const router=express.Router()

router.route('/').post(createCourseController)
router.route('/:id').patch(updateCourseController).delete(deleteCourseController)

export const teacherCourseRouter = router