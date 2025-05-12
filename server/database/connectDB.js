import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const connectDB = () => {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/usedb"; // fallback if not set
  mongoose.set("strictQuery", true);
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database connection error:", err);
    });
};

export default connectDB;
