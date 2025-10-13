import mongoose from "mongoose";
import devConfig from "../env/dev.config";
export async function connectDB() {
    try {
        await mongoose.connect(devConfig.DB_URL as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to MongoDB", error);
    }
}
