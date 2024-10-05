import express from 'express'
import { createAssignmentController, deleteAssignmentController, updateAssignmentController, gradeAssignmentController } from '../controllers/assignmentControllers.js'


const router=express.Router()

router.route('/').post(createAssignmentController).get(gradeAssignmentController)
router.route('/:id').patch(updateAssignmentController).delete(deleteAssignmentController)


export const teacherAssignmentRouter=router