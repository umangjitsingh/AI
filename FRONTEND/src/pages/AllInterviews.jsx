import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BACKEND_URL } from "../../../constants.js";
import { FaFileAlt, FaChartLine, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AllInterviews() {
    const [interviewReports, setInterviewReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/interview/all`, { withCredentials: true });
                console.log(res.data.interviewReports);
                setInterviewReports(res.data.interviewReports);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
        if (score >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        return 'text-red-400 bg-red-500/20 border-red-500/30';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen flex items-center justify-center p-4">
                <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-pink-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 blur-2xl bg-pink-600/30 rounded-full"></div>
                </div>
                <p className="text-zinc-300 mt-6 text-lg sm:text-xl tracking-wide">Loading interviews...</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen pb-16 relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-pink-900/20 border-b border-white/10">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text tracking-tight mb-2">
                            Interview History
                        </h1>
                        <p className="text-base sm:text-lg text-gray-400 font-light">
                            View all your generated interview reports
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 relative z-10">
                {interviewReports.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <FaFileAlt className="text-6xl text-gray-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-300 mb-3">No Interviews Yet</h2>
                        <p className="text-gray-500 mb-6">Generate your first interview report to see it here</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-pink-500/30"
                        >
                            Create Interview
                            <FaArrowRight />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {interviewReports.map((interviewReport) => (
                            <div
                                key={interviewReport._id}
                                className="group glass rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white/10 hover:border-pink-500/30"
                                onClick={() => navigate(`/interview/${interviewReport._id}`)}
                            >
                                {/* Header Section */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                                            {interviewReport.jobTitle}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="font-medium text-gray-300">{interviewReport.personName}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-2 rounded-xl border ${getScoreColor(interviewReport.matchScore)} flex items-center justify-center`}>
                                        <span className="text-lg sm:text-xl font-black">{interviewReport.matchScore}%</span>
                                    </div>
                                </div>

                                {/* Summary */}
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                                    {interviewReport.summary || 'No summary available'}
                                </p>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                        <FaCalendarAlt className="text-pink-400" />
                                        <span>{formatDate(interviewReport.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-pink-400 group-hover:translate-x-1 transition-transform">
                                        <span className="text-xs sm:text-sm font-medium">View Details</span>
                                        <FaArrowRight className="text-xs" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllInterviews;
