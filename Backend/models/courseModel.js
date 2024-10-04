import mongoose from "mongoose";

const CourseSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    branch:{
        type:String,
        enum:['Computer Engineering','Data Science','Machine Learning','EXTC'],
        required:true,
    },
    enrollmentKey:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    students:{
        type:[mongoose.Types.ObjectId],
        default:[]
    },
    assignments:{
        type:[mongoose.Types.ObjectId],
        default:[]
    },
})

export const CourseModel = mongoose.model('courses',CourseSchema)