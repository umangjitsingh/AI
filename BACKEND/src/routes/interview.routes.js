import express from "express";
import authM from "../middlewares/auth.middleware.js";
import {
    generateInterviewReportController,
    // getAllInterviewReportsController,
    // getInterviewController
} from "../controllers/interview.controller.js";
import {upload} from "../middlewares/fileMulter.middleware.js";


const interviewRouter=express.Router();

interviewRouter.post("/",authM,upload.single("resume"),generateInterviewReportController);

// interviewRouter.get("/report/:interviewId",authM,getInterviewController)
//
// interviewRouter.get("/all-reports",authM,getAllInterviewReportsController)

export default interviewRouter;