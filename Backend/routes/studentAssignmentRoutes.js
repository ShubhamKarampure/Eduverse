import express from 'express'
import { getAssignmentByStudent, submitAssignment } from '../controllers/assignmentControllers.js'
import fileUpload from 'express-fileupload'
const router = express.Router()

router.route('/:id').post(fileUpload({
    useTempFiles: true,
    tempFileDir: '../tempFiles'
}),submitAssignment).get(getAssignmentByStudent)


export const studentAssignmentRouter=router