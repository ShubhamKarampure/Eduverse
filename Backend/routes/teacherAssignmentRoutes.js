import express from 'express'
import { createAssignmentController, deleteAssignmentController, updateAssignmentController } from '../controllers/assignmentControllers.js'

const router=express.Router()

router.route('/').post(createAssignmentController)
router.route('/:id').patch(updateAssignmentController).delete(deleteAssignmentController)


export const teacherAssignmentRouter=router