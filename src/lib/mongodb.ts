import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in environment variables!");
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Track the connection state to avoid multiple connections in development
let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("🚀 MongoDB Connected Successfully to:", db.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};