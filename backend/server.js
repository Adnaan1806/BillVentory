import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";

//app config
const app = express();
const port = process.env.PORT || 10000;
connectDB(); //connect to MongoDB
connectCloudinary(); //connect to Cloudinary

//middleware
app.use(express.json());
app.use(cors());

//API endpoints
app.use("/api/user", userRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("API Working good");
});

//running the app
app.listen(port, () => console.log("Server Started", port));
