import React, {useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {logout} from "../store/AuthSlice";
import {useNavigate} from "react-router";
import {BACKEND_URL} from "../../../constants.js";
import {FaPlus} from "react-icons/fa";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resume, setResume] = useState(null);

    async function handleLogout(e) {
        e.preventDefault();
        try {
            await axios.get(`${BACKEND_URL}/api/auth/logout`, {
                withCredentials: true,
            });

            dispatch(logout());
            navigate("/login");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <main
            className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#1f1f1f] via-[#1a0a0a] to-[#1f1f1f] flex items-center justify-center p-10">

            {/* Floating glow elements */}
            <div
                className="pointer-events-none absolute -top-52 -left-52 h-112.5 w-112.5 rounded-full bg-[#e0024d]/50 opacity-40 blur-3xl animate-[floatCircle_18s_ease-in-out_infinite_alternate]"/>
            <div
                className="pointer-events-none absolute -bottom-52 -right-52 h-95 w-95 rounded-full bg-[#b8013e]/60 opacity-30 blur-3xl animate-[floatCircle2_22s_ease-in-out_infinite_alternate]"/>

            {/* Main container */}
            <div className="w-full max-w-400 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* LEFT PANEL */}
                <div
                    className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-white">
                    <h2 className="text-3xl font-semibold mb-6">Job Description</h2>

                    <textarea
                        name="jobDescription"
                        placeholder="Enter your job description..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full h-160 hover:bg-white/20 p-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                {/* RIGHT PANEL */}
                <div
                    className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-white">
                    <h2 className="text-3xl font-semibold mb-6">Candidate Details</h2>

                    {/* Resume Upload */}
                    <div className="mb-8">
                        <label className="block mb-3 text-lg font-medium">Upload Resume (PDF)</label>

                        <label
                            htmlFor="resume"
                            className="flex items-center justify-between w-full p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition"
                                            >
                            <span className="text-white text-lg">
                                {resume ? resume.name : "Upload your resume (PDF)"}
                            </span>

                                                <span className="text-black bg-white p-3 rounded-xl shadow-md">
                                <FaPlus/>
                            </span>
                        </label>

                        <input
                            type="file"
                            id="resume"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => setResume(e.target.files[0])}
                        />
                    </div>

                    {/* Self Description */}
                    <div className="mb-8">
                        <label htmlFor="selfDescription" className="block mb-3 text-lg font-medium">Self
                            Description</label>
                        <textarea
                            name="selfDescription"
                            id="selfDescription"
                            placeholder="Tell us about yourself..."
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            className="w-full h-48 p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>

                    {/* Generate Button */}
                    <button
                        className="w-full py-4 mt-4 bg-pink-600 hover:bg-pink-700 transition rounded-2xl font-semibold text-white text-xl shadow-lg"
                    >
                        Generate Interview Report
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 mt-4 bg-white/20 hover:bg-white/30 transition rounded-2xl font-semibold text-white text-xl"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
