import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./dataBase/db.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import empRouter from "./routes/employeeRouter.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectDb();
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", userRouter);
app.use("/employees", empRouter);
app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("App is running on PORT ", process.env.PORT || 3000);
});
