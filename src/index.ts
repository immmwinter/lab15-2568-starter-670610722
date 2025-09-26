import express from "express";
import morgan from 'morgan';
import {type Request, type Response} from 'express';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { success } from 'zod';
import { courses , students } from "./db/db.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "lab 15 API service successfully",
  });
});

app.use("/me", studentRoutes);
app.use("/api/v2", courseRoutes);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
