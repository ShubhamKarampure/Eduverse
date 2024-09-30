import { UserModel } from "../models/userModel.js";
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signupController=async (req,res)=>{
    try {
        const {name,username,email,password,branch,role}=req.body
        if(!username || !password || !name || !email){
            return res.status(400).json({
                success:false,
                message:"Please enter all credentials"
            })
        }
        const existingMail=await UserModel.findOne({email:email})
        if(existingMail){
            return res.status(400).json({
                success:false,
                message:"Email already in use"
            })
        }
        const existingUsername=await UserModel.findOne({username:username})
        if(existingUsername){
            return res.status(400).json({
                success:false,
                message:"Username already in use"
            })
        }
        const hashedPass=await bcrypt.hash(password,10)
        const user=await UserModel.create({username,password:hashedPass,name,email,branch,role})
        return res.status(201).json({
            success:true,
            messsage:"Sign Up Successful",
            user:user
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })    
    }
}

export const loginController=async(req,res)=>{
    try {
        const {email,password}=req.body

        const validUser=await UserModel.findOne({email:email})
        
        
        if(!validUser){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            })
        } 

        const valid=await bcrypt.compare(password,validUser.password)
        if(!valid){
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }  

        const token=jwt.sign({id:validUser.id},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.status(201).json({
            success:true,
            message:"Signed In Successfully",
            token:token,
            user:validUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const updateProfileController=async(req,res)=>{
    try {
        const id=req.params.id
        const {name,email,username}=req.body
        if(!name || !email || !username)
            return res.status(401).json({
                success:false,
                message:"Please enter credentials"
            }) 
        let img="" 
        if(req.files){
            const {image}=req.files
            console.log(image);
            const types=['image/jpg','image/png','image/jpeg']            
            if(!types.includes(image.mimetype))
                return res.json({
                    success:false,
                    message:"Use only png, jpg or jpeg files"
                }) 
            img=await uploadOnCloud(image.tempFilePath)
        }
        const updatedUser = await UserModel.findByIdAndUpdate(id,{name,email,username,img},{new:true})
            return res.status(201).json({
                success:true,
                message:"User updated successfully",
                user:updatedUser
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        }) 
    }
}