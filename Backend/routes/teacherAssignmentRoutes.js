import express from 'express'
import { createAssignmentController, deleteAssignmentController, updateAssignmentController, gradeAssignmentController } from '../controllers/assignmentControllers.js'

const router=express.Router()

router.route('/').post(createAssignmentController)
router.route('/:id').patch(updateAssignmentController).delete(deleteAssignmentController).post(gradeAssignmentController)


export const teacherAssignmentRouter=router