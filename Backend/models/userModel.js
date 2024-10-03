import mongoose, { mongo } from 'mongoose'

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['Student','Teacher'],
        required:true
    },
    branch:{
        type:String,
        enum:['Computer Engineering','Data Science','Machine Learning','EXTC'],
        required:true,
    },
    enrolledCourses:{
        type:[mongoose.Types.ObjectId],
        default:[]
    },
    img:String,
    dob:{
        type:{
            day:Number,
            month:Number,
            year:Number,
        }
    },
})


export const UserModel=mongoose.model('users',UserSchema) 
