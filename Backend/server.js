import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import 'colors'
import { dbConnect } from './database/dbConnect.js'
import { userRouter } from './routes/userRoutes.js'
import { adminRouter } from './routes/adminROutes.js'
import { teacherCourseRouter } from './routes/teacherCourseRoutes.js'
import { studentCourseRouter } from './routes/studentCourseRoutes.js'
import { teacherAssignmentRouter } from './routes/teacherAssignmentRoutes.js'
import { studentAssignmentRouter } from './routes/studentAssignmentRoutes.js'


dotenv.config();

dbConnect();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
}));

app.use('/api/v1/user',userRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/user/teacher/course',teacherCourseRouter)
app.use('/api/v1/user/student/course',studentCourseRouter)
app.use('/api/v1/user/teacher/assignment',teacherAssignmentRouter)
app.use('/api/v1/user/student/assignment',studentAssignmentRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`.bgBlue.bold);
});