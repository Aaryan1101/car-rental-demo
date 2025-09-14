import mongoose from "mongoose";

let isConnected = false; // track connection

const connectDB = async () => {
  if (isConnected) {
    console.log(" Already connected to MongoDB");
    return;
  }

  try {
  await mongoose.connect(process.env.MONGODB_URI);

    isConnected = mongoose.connection.readyState === 1;
    console.log("Database Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
