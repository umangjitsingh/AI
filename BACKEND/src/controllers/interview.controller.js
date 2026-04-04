import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import  { generateInterviewReport } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

// Enable fake worker mode for Node.js
pdfjsLib.GlobalWorkerOptions.disableWorker = true;

export const generateInterviewReportController = async (req, res) => {
    try {
        const pdfData = req.file.buffer;
        const uintData= Uint8Array.from(pdfData);
        const loadingTask = pdfjsLib.getDocument({
            data: uintData,
            standardFontDataUrl: "node_modules/pdfjs-dist/standard_fonts/"
        });

        const pdf = await loadingTask.promise;

        let resumeContent = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            resumeContent += content.items.map((i) => i.str).join(" ") + " ";
        }

        const { selfDescription, jobDescription,personName } = req.body;

        const responseByAI = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription,
            personName
        });



        const interviewReport=  await interviewReportModel.create({
            user: req.user.id,
            jobTitle: responseByAI.title || "Software Developer",
            resume: resumeContent,
            selfDescription,
            jobDescription,
            personName,
            matchScore: responseByAI.matchScore,
            summary: `Interview report for ${responseByAI.title}`,
            technicalQuestion: responseByAI.technicalQuestion,
            behavioralQuestion: responseByAI.behavioralQuestion,
            skillGap: responseByAI.skillGap,
            preparationPlan: responseByAI.preparationPlan,
        });

        return res.status(201).json({
            message: "Interview Report generated successfully",
            interviewReport
        });
    } catch (e) {
        return res.status(500).json({
            message: `Server error generating interview report: ${e}`,
        });
    }
};

export const getClickedInterviewController = async (req, res) => {

    console.log(req.params.interviewId)

    try {
    const singleInterviewReport = await interviewReportModel.findById({_id: req.params.interviewId});
        return res.status(200).json({
            message: `Interview report for ${singleInterviewReport?.personName} fetched successfully`,
            singleInterviewReport
        });
    } catch (e) {
        return res.status(500).json({
            message: `Server error fetching interview reports: ${e}`,
        });
    }
}

export const getAllInterviewReportsController = async (req, res) => {
    try {
        const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1})
            .select("-resume -selfDescription -jobDescription -technicalQuestion -behavioralQuestion -skillGap -preparationPlan -skillGap " +
                "-preparationPlan -__v");
        return res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        });
    } catch (e) {
        return res.status(500).json({
            message: `Server error fetching interview reports: ${e}`,
        });
    }
}