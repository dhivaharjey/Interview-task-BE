import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;

const connectDb = async () => {
  try {
    const connection = mongoose.connect(connectionString);
    console.log("DB is connected");
    return connection;
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDb;
