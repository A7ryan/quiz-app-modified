import mongoose from "mongoose";
import conf from "../conf/conf.js";
import { initializeDefaultUsers } from "../utils/seedFaculty.js";
import dotenv from "dotenv";
dotenv.config();

const uri = String(process.env.MONGO_DB_URL);
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(uri, {
         
    });
    console.log(
      `✅ MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
    
    // Initialize default users (faculty and admin)
    await initializeDefaultUsers();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
