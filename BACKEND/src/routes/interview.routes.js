import express from "express";
import authM from "../middlewares/auth.middleware.js";
import { generateInterviewReportController} from "../controllers/interview.controller.js";
import {upload} from "../middlewares/fileMulter.middleware.js";


const interviewRouter=express.Router();

interviewRouter.post("/",authM,upload.single("resume"),generateInterviewReportController);

export default interviewRouter;