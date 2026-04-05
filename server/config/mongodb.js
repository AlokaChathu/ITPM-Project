import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("Missing MONGODB_URI in server/.env — add your MongoDB connection string.");
    throw new Error("MONGODB_URI is not configured");
  }

  mongoose.connection.on("connected", () => console.log("Database Connected"));

  await mongoose.connect(uri);
};

export default connectDB;
