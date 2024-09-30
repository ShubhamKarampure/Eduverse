import express from 'express'
import { signupController,loginController,updateProfileController } from "../controllers/userControllers.js";
import fileUpload from 'express-fileupload'

const router=express.Router()

router.route('/signup').post(signupController)
router.route('/login').post(loginController)
router.route('/:id').patch(fileUpload({
    useTempFiles: true,
    tempFileDir: 'C:/Windows/Temp'
}),updateProfileController)

export const userRouter=router