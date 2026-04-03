import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database/mongoDb";
import cors from "cors";
import userRouter from './routes/user.routes';
dotenv.config();

const app: Application = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials:true
}));

app.use('/api/user',userRouter);

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