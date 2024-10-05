import express from 'express'
import { evaluationController } from '../controllers/testControllers.js'
const router=express.Router()

router.route('/').post(evaluationController)

export const studentQuizRouter = router