import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../constants.js";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (key) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [key]: e.target.value,
        }));
        setError(""); // Clear error on input change
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { username, email, password } = formData;
            const result = await axios.post(
                `${BACKEND_URL}/api/auth/register`,
                { username, email, password },
                { withCredentials: true }
            );
            console.log("resisterPageData", result.data);

            if (result.status === 201) {
                navigate("/login");
            }
        } catch (e) {
            console.log(e);
            setError(e.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md glass shadow-2xl rounded-2xl p-6 sm:p-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mb-4 shadow-lg shadow-pink-500/30">
                        <FaUserPlus className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-400">Join us and start your journey</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 animate-pulse">
                        <div className="text-red-400 text-xl mt-0.5">!</div>
                        <div className="flex-1">
                            <p className="text-red-200 font-semibold text-sm">Error</p>
                            <p className="text-red-300 text-xs mt-1">{error}</p>
                        </div>
                    </div>
                )}

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                            <FaUser className="text-pink-400" />
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={handleChange("username")}
                            placeholder="Choose a username"
                            disabled={isLoading}
                            className="p-4 rounded-xl bg-gray-900/60 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                            <FaEnvelope className="text-purple-400" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            placeholder="Enter your email"
                            disabled={isLoading}
                            className="p-4 rounded-xl bg-gray-900/60 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                            <FaLock className="text-blue-400" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handleChange("password")}
                            placeholder="Create a strong password"
                            disabled={isLoading}
                            className="p-4 rounded-xl bg-gray-900/60 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-2 cursor-pointer bg-gradient-to-r from-pink-600 to-purple-600 border border-pink-500/30 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                            isLoading ? "animate-pulse" : ""
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center text-gray-400 mt-8">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-pink-400 font-medium cursor-pointer ml-2 hover:text-pink-300 transition underline underline-offset-4"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;