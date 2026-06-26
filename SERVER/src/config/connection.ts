import mongoose from "mongoose";
import { env } from "./env";

export const mongooseConnection = async () => {
    try {
        await mongoose.connect(env.MONGO_URL as string);
        console.log(`MongoDB connected successfully`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error}`);
        process.exit(1);
    }
}