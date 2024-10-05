import { TestModel } from "../models/testModel.js";
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

export const evaluationController=async(req,res)=>{
    try {
        const {course,questions,marks,student}=req.body
        if(!questions.length==5)
                return res.status(401).json({
                    success:false,
                    message:"Answer all questions"
                })
        const response =await axios.post(`${process.env.FLASK_URL}/quiz/feedback`,{questions},{
            headers:{
                "Content-Type":"application/json",
            },
            withCredentials:true
        })
        console.log(response.data.feedback);
        const evaluation=await TestModel.create({course,student,marks,evaluation:response.data.feedback})
        res.status(201).json({
            success:true,
            message:"Quiz evaluated successfully",
            evaluation
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
