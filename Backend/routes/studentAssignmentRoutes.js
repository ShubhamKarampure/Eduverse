import express from 'express'
import { submitAssignment } from '../controllers/assignmentControllers.js'
import fileUpload from 'express-fileupload'
const router = express.Router()

router.route('/:id').post(fileUpload({
    useTempFiles: true,
    tempFileDir: '../tempFiles'
}),submitAssignment)

export const studentAssignmentRouter=router