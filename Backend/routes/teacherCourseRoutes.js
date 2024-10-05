import express from 'express'
import { createCourseController, updateCourseController, deleteCourseController, generateQuizController, getAllCoursesByInstructor, getCourseById } from '../controllers/courseControllers.js'
import fileUpload from 'express-fileupload'

const router = express.Router()

router.route('/').post(createCourseController).get(getAllCoursesByInstructor)
router.route('/:id').patch(fileUpload({
    useTempFiles: true,
    tempFileDir: 'C:/Windows/Temp'
}),updateCourseController).delete(deleteCourseController).get(generateQuizController)
router.route('/get-course/:id').get(getCourseById);

export const teacherCourseRouter = router