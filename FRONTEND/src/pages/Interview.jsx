import { useSelector } from "react-redux";
import {Link} from "react-router-dom";

const Interview = () => {
    const interviewData = useSelector(state => state?.interview);
    const data = interviewData?.interview?.interviewReport;
    console.log(data);
    const isLoading = !data; // data not ready yet

    if (isLoading) {
        return (
            <div className="bg-zinc-900 w-full min-h-screen flex flex-col items-center justify-center p-4">
                <div className="relative">
                    {/* Pink glowing loader */}
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-pink-600 border-t-transparent animate-spin"></div>

                    {/* Soft glow */}
                    <div className="absolute inset-0 blur-2xl bg-pink-600/30 rounded-full"></div>
                </div>

                <p className="text-zinc-300 mt-6 text-lg sm:text-xl tracking-wide">
                    Generating your interview report…
                </p>

                <p className="text-zinc-500 text-sm mt-2">
                    This usually takes 5–7 seconds
                </p>
            </div>
        );
    }



    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-yellow-400'
        return 'text-red-400'
    }

    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen pb-16 relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Modern Header with gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-pink-900/20 border-b border-white/10">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text mb-3 tracking-tight">
                                Interview Report
                            </h1>
                            <div className="space-y-2">
                                <p className="text-base sm:text-xl text-gray-400 font-light flex items-center gap-3">
                                    <span className="inline-block w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                                    {data?.jobTitle}
                                </p>
                                <p className="text-base sm:text-xl text-gray-400 font-light flex items-center gap-3">
                                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                    {data?.personName}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">Overall Score</p>
                                <p className={`text-4xl sm:text-5xl font-black ${getScoreColor(data?.matchScore)} drop-shadow-lg`}>
                                    {data?.matchScore}%
                                </p>
                            </div>
                            <div className="w-60 h-14  hover:bg-linear-to-br hover:from-gray-800/90 hover:to-gray-900/80 border border-purple-600 rounded-full flex items-center justify-center ">
                                <Link to={"/all-interviews"}>All Reports</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 relative z-10">
                {/* Top Row - Score Cards & Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    {/* Match Score Card */}
                    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-pink-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all"></div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">🎯</span> Match Analysis
                        </h3>
                        <div className="flex items-center justify-center py-4">
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className="text-gray-700"
                                        strokeWidth="6"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                    <circle
                                        className={`${getScoreColor(data?.matchScore)} transition-all duration-1500 ease-out`}
                                        strokeWidth="6"
                                        strokeDasharray={251}
                                        strokeDashoffset={251 - (251 * data?.matchScore) / 100}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-2xl sm:text-3xl font-black ${getScoreColor(data?.matchScore)}`}>
                                        {data?.matchScore}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className={`text-center text-xs sm:text-sm font-medium ${
                            data?.matchScore >= 80 ? 'text-green-400' :
                            data?.matchScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                            {data?.matchScore >= 80 ? '✓ Excellent match for this role' :
                             data?.matchScore >= 60 ? '◐ Good match with some gaps' :
                             '◑ Significant skill gaps detected'}
                        </p>
                    </div>

                    {/* Skill Gaps Summary */}
                    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-red-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">⚡</span> Key Skill Gaps
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                            {data.skillGap && data.skillGap.length > 0 ? (
                                data.skillGap.slice(0, 3).map((gap, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-gray-300 text-xs sm:text-sm truncate flex-1">{gap.skill}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            gap.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                            gap.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                            {gap.severity}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-xs sm:text-sm">No skill gaps identified</p>
                            )}
                            {data.skillGap && data.skillGap.length > 3 && (
                                <p className="text-xs text-gray-500 pt-2">+{data.skillGap.length - 3} more</p>
                            )}
                        </div>
                    </div>

                    {/* Preparation Timeline */}
                    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">📅</span> Prep Timeline
                        </h3>
                        <div className="flex items-center justify-center py-6">
                            <div className="text-center">
                                <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2">
                                    {data.preparationPlan && data.preparationPlan.length > 0 ? data.preparationPlan.length : 0}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm">Days Planned</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 mt-2">
                            {data.preparationPlan && data.preparationPlan.length > 0 && (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/30"></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle Row - Technical & Behavioral Questions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    {/* Technical Questions */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-blue-400 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 text-xl sm:text-2xl">💻</span>
                                Technical Questions
                            </h2>
                            <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                                {data.technicalQuestion?.length || 0} Questions
                            </span>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {data.technicalQuestion && data.technicalQuestion.length > 0 ? (
                                data.technicalQuestion.map((q, idx) => (
                                    <div key={idx} className="group bg-gray-900/60 rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs sm:text-sm font-bold">
                                                {idx + 1}
                                            </span>
                                            <p className="text-white text-sm sm:text-base font-medium flex-1 leading-relaxed">{q.question}</p>
                                        </div>
                                        <div className="ml-9 sm:ml-10 space-y-2 sm:space-y-3">
                                            <div className="bg-purple-500/10 rounded-lg p-2 sm:p-3 border border-purple-500/20">
                                                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">Intention</p>
                                                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{q.intention}</p>
                                            </div>
                                            {q.answer && (
                                                <div className="bg-green-500/10 rounded-lg p-2 sm:p-3 border border-green-500/20">
                                                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Answer Guide</p>
                                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{q.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No technical questions available</p>
                            )}
                        </div>
                    </div>

                    {/* Behavioral Questions */}
                    <div className="bg-gradient-to-br from-orange-900/20 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-orange-400 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/20 text-xl sm:text-2xl">🤝</span>
                                Behavioral Questions
                            </h2>
                            <span className="text-xs font-medium text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
                                {data.behavioralQuestion?.length || 0} Questions
                            </span>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {data.behavioralQuestion && data.behavioralQuestion.length > 0 ? (
                                data.behavioralQuestion.map((q, idx) => (
                                    <div key={idx} className="group bg-gray-900/60 rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs sm:text-sm font-bold">
                                                {idx + 1}
                                            </span>
                                            <p className="text-white text-sm sm:text-base font-medium flex-1 leading-relaxed">{q.question}</p>
                                        </div>
                                        <div className="ml-9 sm:ml-10 space-y-2 sm:space-y-3">
                                            <div className="bg-purple-500/10 rounded-lg p-2 sm:p-3 border border-purple-500/20">
                                                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">Intention</p>
                                                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{q.intention}</p>
                                            </div>
                                            {q.answer && (
                                                <div className="bg-green-500/10 rounded-lg p-2 sm:p-3 border border-green-500/20">
                                                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Answer Guide</p>
                                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{q.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No behavioral questions available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Full Width Preparation Plan */}
                <div className="bg-gradient-to-br from-emerald-900/20 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 flex items-center gap-3">
                            <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 text-2xl sm:text-3xl">📋</span>
                            Your Personalized Preparation Plan
                        </h2>
                        <span className="text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-500/20 px-4 py-2 rounded-full">
                            {data.preparationPlan?.length || 0} Days Roadmap
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {data.preparationPlan && data.preparationPlan.length > 0 ? (
                            data.preparationPlan.map((plan, idx) => (
                                <div key={idx}
                                     className="group relative bg-gray-900/60 rounded-xl p-5 sm:p-6 border border-gray-700/50 hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-xl opacity-0 group-hover:opacity-100 transition-all"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg">
                                            {plan.day}
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">{plan.focus}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Task</p>
                                        <p className="text-gray-300 text-sm leading-relaxed">{plan.task}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-12 col-span-full text-sm sm:text-base">No preparation plan available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interview;
