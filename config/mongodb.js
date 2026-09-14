import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectMongodb = async () => {
await mongoose.connect(process.env.MONGO_URI);
  console.log("mongodb connected successfully");
};
