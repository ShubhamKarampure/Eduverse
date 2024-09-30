import mongoose from "mongoose"
import 'colors'

export const dbConnect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log(`Connected to Database`.bgGreen.bold);
    } catch (error) {
        console.log(`Error: ${error}`.bgRed.bold);
    }
}