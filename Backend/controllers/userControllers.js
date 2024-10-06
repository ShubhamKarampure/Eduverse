import { UserModel } from "../models/userModel.js";
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { deleteFromCloud, uploadOnCloud } from "../utils/cloudinary.js";

export const signupController = async (req, res) => {
    try {
        const { name, username, email, password, branch, role } = req.body
        if (!username || !password || !name || !email) {
            return res.status(400).json({
                success: false,
                message: "Please enter all credentials"
            })
        }
        const existingMail = await UserModel.findOne({ email: email })
        if (existingMail) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            })
        }
        const existingUsername = await UserModel.findOne({ username: username })
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already in use"
            })
        }
        const hashedPass = await bcrypt.hash(password, 10)
        const user = await UserModel.create({ username, password: hashedPass, name, email, branch, role })
        return res.status(201).json({
            success: true,
            messsage: "Sign Up Successful",
            user: user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        const validUser = await UserModel.findOne({ email: email })


        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        const valid = await bcrypt.compare(password, validUser.password)
        if (!valid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.status(201).json({
            success: true,
            message: "Signed In Successfully",
            token: token,
            user: validUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, username } = req.body;

        if (!name || !email || !username) {
            return res.status(401).json({
                success: false,
                message: "Please enter credentials"
            });
        }

        let imageData = null;

        const user=await UserModel.findById(id)

        if (req.files) {
            if(user.image)
            {const response =await deleteFromCloud(user.image.publicId)
                console.log(response);
            }
            const { image } = req.files;

            const types = ['image/jpg', 'image/png', 'image/jpeg'];
            if (!types.includes(image.mimetype)) {
                return res.status(401).json({
                    success: false,
                    message: "Use only png, jpg or jpeg files"
                });
            }

            const img = await uploadOnCloud(image.tempFilePath);
            imageData = {
                url: img.url,
                publicId: img.public_id,
            };
            user.image=imageData
        }
        user.name=name
        user.email=email
        user.username=username
        
        user.save()
        // const updatedUser = await UserModel.findByIdAndUpdate(
        //     id,
        //     {
        //         name,
        //         email,
        //         username,
        //         ...(imageData && { image: imageData }), 
        //     },
        //     { new: true }
        // );

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
