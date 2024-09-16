import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

const connectToDB = async ()=> {
    try {
        
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to database");
    } catch (error: any) {
        
        console.error("Failed to connect to database", error)
    }
}       

export default connectToDB;