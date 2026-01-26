import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running in ${PORT}`);
    });
  })
  .catch((err) => {
    process.exit(1);
  });
