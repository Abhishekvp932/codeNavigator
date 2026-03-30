import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));

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