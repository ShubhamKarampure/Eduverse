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
    criteria:{
        type:[String],
        required:true
    },
    submissions:{
        type:[{
            student:mongoose.Types.ObjectId,
            submission:String,
            public_id:String,
            submissionDate:Date,
            late:Boolean,
            grade:Number,
        }]
    },
})

export const AssignmentModel=mongoose.model('assginments',AssignmentSchema)