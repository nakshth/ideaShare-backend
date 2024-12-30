import mongoose from "mongoose";
import { Db } from "mongodb";
import { initializeGridFS } from "./gridfs";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string); // Connection options are no longer needed
    initializeGridFS(mongoose?.connection?.db as Db);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
