import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connect ${conn.connection.host}`);
  } catch (error) {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
