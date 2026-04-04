import express from "express";
import authM from "../middlewares/auth.middleware.js";
import {
    generateInterviewReportController, getAllInterviewReportsController,
    getClickedInterviewController
} from "../controllers/interview.controller.js";
import {upload} from "../middlewares/fileMulter.middleware.js";


const interviewRouter=express.Router();

interviewRouter.post("/",authM,upload.single("resume"),generateInterviewReportController);

interviewRouter.get("/report/:interviewId",authM,getClickedInterviewController)
//
interviewRouter.get("/all",authM,getAllInterviewReportsController)

export default interviewRouter;