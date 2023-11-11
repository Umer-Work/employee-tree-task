import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const options: object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL || "", options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

export default connectDatabase;
