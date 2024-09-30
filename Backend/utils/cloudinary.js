import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.CLOUD_KEY , 
    api_secret: process.env.CLOUD_SECRET
});




export const uploadOnCloud=async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })//uploads file to cloud
        return response.url//returns url to controller
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath)//Removes locally saved temp file
    }
}



   
    