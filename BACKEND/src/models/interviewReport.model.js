import mongoose from "mongoose";
const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        // required: [true,"Technical Question is required"],
    },
    intention:{
        type: String,
        // required: [true,"Intention is required"],
    },
    answer:{
        type: String,
        // required: [true,"Answer is required"],
    }
},{_id:false});

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        // required: [true,"Behavioral Question is required"],
    },
    intention:{
        type: String,
        // required: [true,"Intention is required"],
    },
    answer:{
        type: String,
        // required: [true,"Answer is required"],
    }
},{_id:false});

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        // required: [true,"Skill is required"],
    },
    severity:{
        type: String,

    }
},{_id:false});

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        // required: [true,"Day is required"],
    },
    focus:{
        type:String,
        // required: [true,"Focus is required"],
    },
    task:{
        type: String,
        // required: [true,"Task is required"],
    }
},{_id:false});

const interviewReportSchema = mongoose.Schema({
    personName:String,
    jobTitle:String,
    summary:String,
    jobDescription: {
        type: String,
        // required: [true, "Job description is required"],
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore:{
        type: Number,
        min:0,
        max:100
    },
    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGap:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }

}, {timestamps: true});

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)
export default interviewReportModel;

