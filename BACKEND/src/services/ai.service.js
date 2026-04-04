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
    technicalQuestion: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestion: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGap: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.string().describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances LOW,HIGH,MEDIUM can be the possibilities")
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
        
        // Helper function to detect if an object has scrambled properties
        // Returns true if the object's values look like property names instead of content
        function isScrambledObject(obj, expectedFields) {
            if (!obj || typeof obj !== 'object') return false;
            
            // Check if any value matches the field names themselves (scrambled pattern)
            for (const key of Object.keys(obj)) {
                const value = String(obj[key]).toLowerCase().trim();
                // If a value is exactly a field name, it's likely scrambled
                if (expectedFields.some(field => field.toLowerCase() === value)) {
                    return true;
                }
            }
            return false;
        }
        
        // Fix scrambled technical questions
        function fixTechnicalQuestion(item) {
            if (!item || typeof item !== 'object') return null;
            
            const keys = Object.keys(item);
            const values = Object.values(item).map(v => String(v).toLowerCase().trim());
            
            // Detect scrambled pattern: values contain field names
            if (values.includes('question') || values.includes('intention') || values.includes('answer')) {
                // Try to reconstruct based on typical content patterns
                const fixed = {
                    question: '',
                    intention: '',
                    answer: ''
                };
                
                for (const [key, value] of Object.entries(item)) {
                    const strValue = String(value);
                    const lowerValue = strValue.toLowerCase().trim();
                    
                    // Match based on content patterns
                    if (lowerValue === 'question' || lowerValue === 'intention' || lowerValue === 'answer') {
                        // This is a placeholder, skip it

                    } else if (strValue.includes('?') || strValue.toLowerCase().includes('how') || 
                               strValue.toLowerCase().includes('what') || strValue.toLowerCase().includes('describe')) {
                        // Looks like a question
                        if (!fixed.question) fixed.question = strValue;
                        else if (!fixed.intention) fixed.intention = strValue;
                    } else if (strValue.toLowerCase().includes('assess') || strValue.toLowerCase().includes('evaluate') ||
                               strValue.toLowerCase().includes('understand') || strValue.toLowerCase().includes('knowledge')) {
                        // Looks like an intention
                        if (!fixed.intention) fixed.intention = strValue;
                        else if (!fixed.answer) fixed.answer = strValue;
                    } else {
                        // Likely an answer/explanation
                        if (!fixed.answer) fixed.answer = strValue;
                        else if (!fixed.question) fixed.question = strValue;
                    }
                }
                
                return fixed;
            }
            
            // Not scrambled, return as-is
            return {
                question: item.question || '',
                intention: item.intention || '',
                answer: item.answer || ''
            };
        }
        
        // Fix scrambled behavioral questions (same logic as technical)
        function fixBehavioralQuestion(item) {
            return fixTechnicalQuestion(item);
        }
        
        // Fix scrambled skill gaps
        function fixSkillGap(item) {
            if (!item || typeof item !== 'object') return null;
            
            const values = Object.values(item).map(v => String(v).toLowerCase().trim());
            
            // Detect scrambled pattern
            if (values.includes('skill') || values.includes('severity')) {
                const fixed = {
                    skill: '',
                    severity: 'low'
                };
                
                for (const [key, value] of Object.entries(item)) {
                    const strValue = String(value);
                    const lowerValue = strValue.toLowerCase().trim();
                    
                    if (lowerValue === 'skill' || lowerValue === 'severity') {

                    } else if (['low', 'medium', 'high'].includes(lowerValue)) {
                        fixed.severity = lowerValue;
                    } else {
                        // Assume it's a skill name
                        if (!fixed.skill) fixed.skill = strValue;
                    }
                }
                
                return fixed;
            }
            
            // Not scrambled, return as-is
            return {
                skill: item.skill || '',
                severity: item.severity || 'low'
            };
        }
        
        // Fix scrambled preparation plan
        function fixPreparationPlan(item) {
            if (!item || typeof item !== 'object') return null;
            
            const values = Object.values(item).map(v => String(v).toLowerCase().trim());
            
            // Detect scrambled pattern
            if (values.includes('day') || values.includes('focus') || values.includes('task')) {
                const fixed = {
                    day: 1,
                    focus: '',
                    task: ''
                };
                
                for (const [key, value] of Object.entries(item)) {
                    const strValue = String(value);
                    const lowerValue = strValue.toLowerCase().trim();
                    
                    if (lowerValue === 'day' || lowerValue === 'focus' || lowerValue === 'task') {

                    } else if (!isNaN(parseInt(strValue))) {
                        // It's a number, likely a day
                        fixed.day = parseInt(strValue) || 1;
                    } else if (strValue.toLowerCase().includes('review') || strValue.toLowerCase().includes('study') ||
                               strValue.toLowerCase().includes('practice') || strValue.toLowerCase().includes('learn')) {
                        // Sounds like a task
                        if (!fixed.task) fixed.task = strValue;
                    } else {
                        // Likely a focus area
                        if (!fixed.focus) fixed.focus = strValue;
                    }
                }
                
                return fixed;
            }
            
            // Not scrambled, return as-is
            return {
                day: typeof item.day === 'number' ? item.day : 1,
                focus: item.focus || '',
                task: item.task || ''
            };
        }
        
        // Helper function to safely fix and validate array fields
        const safeFixArrayField = (fieldName, groupSize, validator, fixFunction) => {
            try {
                if (!parsed[fieldName]) {
                    console.warn(`⚠️ Field '${fieldName}' is missing, setting to empty array`);
                    parsed[fieldName] = [];
                    return;
                }
                
                if (!Array.isArray(parsed[fieldName])) {
                    console.warn(`⚠️ Field '${fieldName}' is not an array, setting to empty array`);
                    parsed[fieldName] = [];
                    return;
                }
                
                // If it's a flat array of strings, convert to objects
                if (parsed[fieldName].length > 0 && typeof parsed[fieldName][0] === 'string') {
                    const fixed = [];
                    for (let i = 0; i < parsed[fieldName].length; i += groupSize) {
                        const obj = validator(parsed, i);
                        fixed.push(obj);
                    }
                    parsed[fieldName] = fixed;
                    console.log(`✅ Fixed flat array for '${fieldName}' (${fixed.length} items)`);
                    return;
                }
                
                // If it's an array of objects, check for scrambled properties
                if (parsed[fieldName].length > 0 && typeof parsed[fieldName][0] === 'object') {
                    let needsFixing = false;
                    
                    // Check first few items to see if they're scrambled
                    for (let i = 0; i < Math.min(3, parsed[fieldName].length); i++) {
                        if (fixFunction && fixFunction(parsed[fieldName][i])) {
                            const fixed = fixFunction(parsed[fieldName][i]);
                            if (JSON.stringify(fixed) !== JSON.stringify(parsed[fieldName][i])) {
                                needsFixing = true;
                                break;
                            }
                        }
                    }
                    
                    if (needsFixing) {
                        parsed[fieldName] = parsed[fieldName].map((item, idx) => {
                            try {
                                if (fixFunction) {
                                    return fixFunction(item);
                                }
                                return item;
                            } catch (e) {
                                console.warn(`⚠️ Failed to fix item ${idx} in '${fieldName}': ${e.message}`);
                                return null;
                            }
                        }).filter(item => item !== null);
                        console.log(`✅ Fixed scrambled objects for '${fieldName}' (${parsed[fieldName].length} items)`);
                    }
                }
            } catch (e) {
                console.error(`❌ Error processing field '${fieldName}': ${e.message}. Setting to empty array.`);
                parsed[fieldName] = [];
            }
        };
        
        // Process each field with error isolation and appropriate fix functions
        safeFixArrayField('technicalQuestion', 3, 
            (data, i) => ({
                question: data.technicalQuestion[i] || '',
                intention: data.technicalQuestion[i + 1] || '',
                answer: data.technicalQuestion[i + 2] || ''
            }),
            fixTechnicalQuestion
        );
        
        safeFixArrayField('behavioralQuestion', 3,
            (data, i) => ({
                question: data.behavioralQuestion[i] || '',
                intention: data.behavioralQuestion[i + 1] || '',
                answer: data.behavioralQuestion[i + 2] || ''
            }),
            fixBehavioralQuestion
        );
        
        safeFixArrayField('skillGap', 2,
            (data, i) => ({
                skill: data.skillGap[i] || '',
                severity: data.skillGap[i + 1] || 'low'
            }),
            fixSkillGap
        );
        
        safeFixArrayField('preparationPlan', 3,
            (data, i) => ({
                day: Math.floor(i / 3) + 1,
                focus: data.preparationPlan[i] || '',
                task: data.preparationPlan[i + 1] || data.preparationPlan[i + 2] || ''
            }),
            fixPreparationPlan
        );
        
        // Ensure matchScore exists and is valid
        if (typeof parsed.matchScore !== 'number' || isNaN(parsed.matchScore)) {
            console.warn(`⚠️ Invalid matchScore, defaulting to 0`);
            parsed.matchScore = 0;
        } else {
            // Clamp between 0 and 100
            parsed.matchScore = Math.max(0, Math.min(100, parsed.matchScore));
        }
        
        // Ensure title exists
        if (!parsed.title || typeof parsed.title !== 'string') {
            console.warn(`⚠️ Invalid or missing title, defaulting to 'Unknown'`);
            parsed.title = 'Unknown';
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
    personName
                                              }) {
    const prompt = `You are generating a structured interview report. Output ONLY valid JSON with no explanations.

INPUT DATA:
- Name: ${personName}
- Resume: ${resume}
- Self Description: ${selfDescription}
- Job Description: ${jobDescription}

CRITICAL FORMAT REQUIREMENTS:
Every array item MUST be an object with named properties. NO flat arrays of strings.

REQUIRED JSON STRUCTURE (follow this exact format):
{
  "matchScore": 85,
  "technicalQuestion": [
    {
      "question": "What is your experience with React hooks?",
      "intention": "Assess candidate's knowledge of modern React patterns",
      "answer": "Explain useState, useEffect with examples from past projects"
    }
  ],
  "behavioralQuestion": [
    {
      "question": "Tell me about a challenging project you worked on",
      "intention": "Evaluate problem-solving and communication skills",
      "answer": "Use STAR method: Situation, Task, Action, Result"
    }
  ],
  "skillGap": [
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
- Each technicalQuestion item must have: question, intention, answer (as OBJECTS, not strings)
- Each behavioralQuestion item must have: question, intention, answer (as OBJECTS, not strings)
- Each skillGap item must have: skill, severity (as OBJECTS, not strings)
- Each preparationPlan item must have: day (number), focus, task (as OBJECTS, not strings)
- severity must be one of: "low", "medium", or "high"
- matchScore must be between 0-100

Generate the JSON now:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
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

        // Use the parseAndFixResponse helper function
        const parsedResponse = parseAndFixResponse(responseText);
        
        console.log("Fixed Response:", parsedResponse);
        
        // Try to validate against Zod schema, but don't fail completely if it fails
        try {
            const validatedData = interviewReportSchema.parse(parsedResponse);
            console.log("✅ Validated Data:", validatedData);
            return validatedData;
        } catch (zodError) {
            console.error("⚠️ Zod validation failed, but returning partial data anyway");
            if (zodError.name === 'ZodError') {
                console.error("Zod validation errors:", zodError.errors);
            }
            // Return the parsed data even if validation fails
            return parsedResponse;
        }
    } catch (error) {
        console.error("Error parsing AI response:", error);
        // Instead of throwing, return a minimal valid structure
        const fallbackResponse = {
            matchScore: 0,
            technicalQuestion: [],
            behavioralQuestion: [],
            skillGap: [],
            preparationPlan: [],
            title: 'Error - Could not parse response'
        };
        console.error("Returning fallback response:", fallbackResponse);
        return fallbackResponse;
    }
}
