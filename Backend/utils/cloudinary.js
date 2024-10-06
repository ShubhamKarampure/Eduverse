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
        const {url,public_id}=response
        return {url,public_id}//returns url to controller
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath)//Removes locally saved temp file
        deleteFromCloud(public_id)
    }
}

export const deleteFromCloud = async (publicId) => {
    try {
        if (!publicId) return null;
        
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image" // This ensures it deletes all types (image, video, etc.)
        });

        if (response.result === "ok") {
            return { success: true, message: "File deleted successfully" };
        } else {
            return { success: false, message: `Failed to delete file: ${response.result}` };
        }
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal server error" };
    }
};



   
    