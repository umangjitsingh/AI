import React, { useState, useEffect } from "react";
import { FaPlus, FaFilePdf } from "react-icons/fa";
import { MdError, MdCheckCircle } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Logout from "../components/Logout.jsx";
import { generateInterviewReport, clearError } from "../store/interviewSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Dashboard() {
    const [personName, setPersonName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resume, setResume] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get state from Redux store
    const { loading, error, success, interview } = useSelector((state) => state.interview);

    // Auto-navigate when interview is successfully generated
    useEffect(() => {
        if (success && interview) {
            navigate("/interview");
        }
    }, [success, interview, navigate]);

    async function handleGenerateReport(e) {
        e.preventDefault();

        // Basic validation
        if (!personName || !jobDescription || !selfDescription || !resume) {
            alert("Please fill in all fields and upload your resume");
            return;
        }

        // Dispatch the async thunk with candidate name
        await dispatch(generateInterviewReport({
            personName,
            jobDescription,
            selfDescription,
            resume
        }));
    }

    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen pb-16 relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header with gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-pink-900/20 border-b border-white/10">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-400 font-light mt-2">
                                Generate your personalized interview report
                            </p>
                        </div>
                        <div className="sm:hidden">
                            <Logout />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* LEFT PANEL - Job Description */}
                    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-pink-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all"></div>

                        <h2 className="text-xl sm:text-2xl font-bold text-pink-400 mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-500/20 text-xl sm:text-2xl">📋</span>
                            Job Description
                        </h2>

                        <textarea
                            name="jobDescription"
                            placeholder="Enter the job description..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            disabled={loading}
                            className="w-full h-80 sm:h-96 p-4 sm:p-5 rounded-xl bg-gray-900/60 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base resize-none"
                        />
                    </div>

                    {/* RIGHT PANEL - Candidate Details */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 sm:p-5 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-start gap-3 animate-pulse">
                                <MdError className="text-red-400 text-xl sm:text-2xl shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-200 font-semibold text-sm sm:text-base">Error</p>
                                    <p className="text-red-300 text-xs sm:text-sm">{error.message}</p>
                                </div>
                                <button
                                    onClick={() => dispatch(clearError())}
                                    className="text-red-400 hover:text-red-200 transition text-lg sm:text-xl"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 sm:p-5 bg-green-500/20 border border-green-500/50 rounded-2xl flex items-start gap-3">
                                <MdCheckCircle className="text-green-400 text-xl sm:text-2xl shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-green-200 font-semibold text-sm sm:text-base">Success!</p>
                                    <p className="text-green-300 text-xs sm:text-sm">Interview report generated successfully. Redirecting...</p>
                                </div>
                            </div>
                        )}

                        {/* Candidate Name Input */}
                        <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                            <label className="block text-base sm:text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                <span className="text-lg sm:text-xl">👤</span> Your Name
                            </label>
                            <input
                                type="text"
                                value={personName}
                                onChange={(e) => setPersonName(e.target.value)}
                                placeholder="Enter your full name"
                                disabled={loading}
                                className="w-full p-3 sm:p-4 rounded-xl bg-gray-900/60 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                            />
                        </div>

                        {/* Resume Upload */}
                        <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                            <label className="block text-base sm:text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                <span className="text-lg sm:text-xl">📄</span> Upload Resume (PDF)
                            </label>
                            <label
                                htmlFor="resume"
                                className={`flex items-center justify-between w-full p-3 sm:p-4 rounded-xl border cursor-pointer transition ${
                                    loading
                                        ? 'bg-gray-900/30 border-gray-700/50 cursor-not-allowed'
                                        : 'bg-gray-900/60 border-gray-700/50 hover:border-blue-500/30'
                                }`}
                            >
                                <span className="text-gray-100 text-sm sm:text-base truncate pr-4">
                                    {resume ? resume.name : "Click to upload your resume"}
                                </span>
                                <span className="text-black bg-blue-400 p-2 rounded-lg shadow-md shrink-0">
                                    <FaPlus />
                                </span>
                            </label>

                            <input
                                type="file"
                                id="resume"
                                accept=".pdf"
                                disabled={loading}
                                className="hidden"
                                onChange={(e) => setResume(e.target.files[0])}
                            />
                        </div>

                        {/* Self Description */}
                        <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
                            <label htmlFor="selfDescription" className="block text-base sm:text-lg font-semibold text-orange-400 mb-3 flex items-center gap-2">
                                <span className="text-lg sm:text-xl">✍️</span> Self Description
                            </label>
                            <textarea
                                name="selfDescription"
                                placeholder="Tell us about yourself..."
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                disabled={loading}
                                className="w-full h-32 sm:h-48 p-4 sm:p-5 rounded-xl bg-gray-900/60 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base resize-none"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${
                                loading
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                            } text-white`}
                        >
                            {loading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin text-xl sm:text-2xl" />
                                    <span>Generating Report...</span>
                                </>
                            ) : (
                                <span>🚀 Generate Interview Report</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 scale-75 sm:scale-90 hidden sm:block">
                <Logout />
            </div>
        </div>
    );
}

export default Dashboard;
