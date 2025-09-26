import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import postRoute from "./routes/post.routes.js";
import userRoute from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoute);
app.use(userRoute);
app.use(express.static("uploads"));


const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://rathipreet28_db_user:ue97kjhvfbAm3ClQ@socialmedia.faexrbr.mongodb.net/?retryWrites=true&w=majority&appName=Socialmedia"
  );
  app.listen(9090, () => {
    console.log("app start 9090");
  });
};

start();
