
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_KEY,
});

// ---------------- ZOD SCHEMA ----------------
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        task: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

// ---------------- AI FUNCTION ----------------

export async function generateInterviewReport({
                                                  resume,
                                                  selfDescription,
                                                  jobDescription,
                                              }) {
    const prompt = `
You are an AI that outputs ONLY valid JSON.
Never include explanations, markdown, or text outside the JSON object.

Generate an interview report using ONLY the following inputs:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Follow these rules strictly and generate interview report using zod interviewReportschema:
- Output ONLY JSON.
- No extra information is required, only provide what is asked in the interviewReportSchema.
- No text before or after the JSON.
- Arrays MUST contain objects, not strings.
-technicalQuestions MUST be an array of objects with {question, intension, answer}.
- behavioralQuestions MUST be an array of objects with {question, intension, answer}.
- skillGaps MUST be an array of objects with {skill, severity}.
-preparationPlan MUST be an array of objects with {day, focus, tasks}.
- All fields MUST match the interviewReportSchema exactly.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash" ,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(interviewReportSchema),
        }
    })
    console.log(response.text)

    return JSON.parse(response.text)

}






