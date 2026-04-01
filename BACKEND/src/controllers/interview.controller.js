

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

        const { selfDescription, jobDescription } = req.body;

        const responseByAI = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription,
        });



        const interviewReport=  await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...responseByAI,
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