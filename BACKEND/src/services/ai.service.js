import dotenv from "dotenv";
import {GoogleGenAI} from "@google/genai";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_KEY,
});

// ---------------- ZOD SCHEMA ----------------
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number in the preparation plan"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        task: z.string().describe("Task to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

// ---------------- HELPER FUNCTIONS ----------------

// Fallback parser to fix common Gemini formatting issues
function parseAndFixResponse(responseText) {
    try {
        const parsed = JSON.parse(responseText);
        
        // Fix technicalQuestions if it's a flat array of strings
        if (Array.isArray(parsed.technicalQuestions) && typeof parsed.technicalQuestions[0] === 'string') {
            const fixed = [];
            for (let i = 0; i < parsed.technicalQuestions.length; i += 3) {
                fixed.push({
                    question: parsed.technicalQuestions[i] || '',
                    intention: parsed.technicalQuestions[i + 1] || '',
                    answer: parsed.technicalQuestions[i + 2] || ''
                });
            }
            parsed.technicalQuestions = fixed;
        }
        
        // Fix behavioralQuestions if it's a flat array of strings
        if (Array.isArray(parsed.behavioralQuestions) && typeof parsed.behavioralQuestions[0] === 'string') {
            const fixed = [];
            for (let i = 0; i < parsed.behavioralQuestions.length; i += 3) {
                fixed.push({
                    question: parsed.behavioralQuestions[i] || '',
                    intention: parsed.behavioralQuestions[i + 1] || '',
                    answer: parsed.behavioralQuestions[i + 2] || ''
                });
            }
            parsed.behavioralQuestions = fixed;
        }
        
        // Fix skillGaps if it's a flat array of strings
        if (Array.isArray(parsed.skillGaps) && typeof parsed.skillGaps[0] === 'string') {
            const fixed = [];
            for (let i = 0; i < parsed.skillGaps.length; i += 2) {
                fixed.push({
                    skill: parsed.skillGaps[i] || '',
                    severity: parsed.skillGaps[i + 1] || 'low'
                });
            }
            parsed.skillGaps = fixed;
        }
        
        // Fix preparationPlan if it's a flat array of strings
        if (Array.isArray(parsed.preparationPlan) && typeof parsed.preparationPlan[0] === 'string') {
            const fixed = [];
            for (let i = 0; i < parsed.preparationPlan.length; i += 3) {
                fixed.push({
                    day: Math.floor(i / 3) + 1,
                    focus: parsed.preparationPlan[i] || '',
                    task: parsed.preparationPlan[i + 1] || parsed.preparationPlan[i + 2] || ''
                });
            }
            parsed.preparationPlan = fixed;
        }
        
        return parsed;
    } catch (e) {
        throw new Error(`Failed to parse response: ${e.message}`);
    }
}

// ---------------- AI FUNCTION ----------------

export async function generateInterviewReport({
                                                  resume,
                                                  selfDescription,
                                                  jobDescription,
                                              }) {
    const prompt = `You are generating a structured interview report. Output ONLY valid JSON with no explanations.

INPUT DATA:
- Resume: ${resume}
- Self Description: ${selfDescription}
- Job Description: ${jobDescription}

CRITICAL FORMAT REQUIREMENTS:
Every array item MUST be an object with named properties. NO flat arrays of strings.

REQUIRED JSON STRUCTURE (follow this exact format):
{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "What is your experience with React hooks?",
      "intention": "Assess candidate's knowledge of modern React patterns",
      "answer": "Explain useState, useEffect with examples from past projects"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a challenging project you worked on",
      "intention": "Evaluate problem-solving and communication skills",
      "answer": "Use STAR method: Situation, Task, Action, Result"
    }
  ],
  "skillGaps": [
    {
      "skill": "TypeScript",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Data Structures",
      "task": "Review arrays, linked lists, and hash maps"
    }
  ],
  "title": "Frontend Developer"
}

IMPORTANT:
- Each technicalQuestions item must have: question, intention, answer (as OBJECTS, not strings)
- Each behavioralQuestions item must have: question, intention, answer (as OBJECTS, not strings)
- Each skillGaps item must have: skill, severity (as OBJECTS, not strings)
- Each preparationPlan item must have: day (number), focus, task (as OBJECTS, not strings)
- severity must be one of: "low", "medium", or "high"
- matchScore must be between 0-100

Generate the JSON now:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(interviewReportSchema),
            }
        });

        let responseText = response.text.trim();
        
        // Remove any Markdown code block wrappers if present
        responseText = responseText.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
        
        console.log("Raw AI Response:", responseText);

        // Parse and fix flat arrays if Gemini returns strings instead of objects
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseText);
            
            // Fix technicalQuestions (groups of 3: question, intention, answer)
            if (Array.isArray(parsedResponse.technicalQuestions) && typeof parsedResponse.technicalQuestions[0] === 'string') {
                const fixed = [];
                for (let i = 0; i < parsedResponse.technicalQuestions.length; i += 3) {
                    fixed.push({question: parsedResponse.technicalQuestions[i] || '', intention: parsedResponse.technicalQuestions[i + 1] || '', answer: parsedResponse.technicalQuestions[i + 2] || ''});
                }
                parsedResponse.technicalQuestions = fixed;
            }
            
            // Fix behavioralQuestions (groups of 3: question, intention, answer)
            if (Array.isArray(parsedResponse.behavioralQuestions) && typeof parsedResponse.behavioralQuestions[0] === 'string') {
                const fixed = [];
                for (let i = 0; i < parsedResponse.behavioralQuestions.length; i += 3) {
                    fixed.push({question: parsedResponse.behavioralQuestions[i] || '', intention: parsedResponse.behavioralQuestions[i + 1] || '', answer: parsedResponse.behavioralQuestions[i + 2] || ''});
                }
                parsedResponse.behavioralQuestions = fixed;
            }
            
            // Fix skillGaps (groups of 2: skill, severity)
            if (Array.isArray(parsedResponse.skillGaps) && typeof parsedResponse.skillGaps[0] === 'string') {
                const fixed = [];
                for (let i = 0; i < parsedResponse.skillGaps.length; i += 2) {
                    fixed.push({skill: parsedResponse.skillGaps[i] || '', severity: parsedResponse.skillGaps[i + 1] || 'low'});
                }
                parsedResponse.skillGaps = fixed;
            }
            
            // Fix preparationPlan (groups of 3: day/focus number, focus string, task string)
            if (Array.isArray(parsedResponse.preparationPlan) && typeof parsedResponse.preparationPlan[0] === 'string') {
                const fixed = [];
                for (let i = 0; i < parsedResponse.preparationPlan.length; i += 3) {
                    fixed.push({day: Math.floor(i / 3) + 1, focus: parsedResponse.preparationPlan[i] || '', task: parsedResponse.preparationPlan[i + 1] || parsedResponse.preparationPlan[i + 2] || ''});
                }
                parsedResponse.preparationPlan = fixed;
            }
        } catch (e) {
            throw new Error(`Failed to parse JSON: ${e.message}`);
        }
        
        console.log("Fixed Response:", parsedResponse);
        
        // Validate against Zod schema
        const validatedData = interviewReportSchema.parse(parsedResponse);
        console.log("Validated Data:", validatedData);
        return validatedData;
    } catch (error) {
        console.error("Error parsing AI response:", error);
        if (error.name === 'ZodError') {
            console.error("Zod validation errors:", error.errors);
        }
        throw new Error(`Failed to parse AI response: ${error.message}`);
    }
}
