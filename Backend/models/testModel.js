import mongoose from 'mongoose'

const TestSchema=mongoose.Schema({
    course:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    student:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    evaluation:{
        type:[{
            feedback:{
                type:String,
                required:true
            }
        }]
    },
    marks:{
        type:Number,
        required:true,
    }
})

export const TestModel=mongoose.model('tests',TestSchema)