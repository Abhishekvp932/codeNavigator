import mongoose from "mongoose";
import dns from "node:dns";

import dotenv from "dotenv";
dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = process.env.MONGO_URL;
    console.log('mongo url', mongoURL)
    if (!mongoURL) {
      throw new Error("Mongo db url is not defin .env file");
    }

    const conn = await mongoose.connect(mongoURL);

    console.log(`Database Connected : ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.log("db connecting error", error);
    throw err
  }
};

export default connectDB;
