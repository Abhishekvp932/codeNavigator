import mongoose from "mongoose";

import dotenv from "dotenv";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
      throw new Error("Mongo db url is not defin .env file");
    }

    const conn = await mongoose.connect(mongoURL);

    console.log(`Database Connected : ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.log("db connecting error", error);
  }
};

export default connectDB;
