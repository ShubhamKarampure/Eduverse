import mongoose from "mongoose";

const AssignmentSchema=mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    deadline:{
        type:Date,
        required:true,
    },
    submissions:{
        type:[{
            student:mongoose.Types.ObjectId,
            submission:String,
            submissionDate:Date,
            late:Boolean
        }]
    },
})

export const AssignmentModel=mongoose.model('assginments',AssignmentSchema)