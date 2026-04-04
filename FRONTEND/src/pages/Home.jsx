// import React from 'react';
// import { Link } from "react-router-dom";
//
// function Home() {
//     return (
//         <div className="flex flex-col w-full h-screen bg-[#191919] text-gray-100">
//             <div className="flex flex-col items-center justify-center h-full">
//
//                 <h1 className="font-extrabold tracking-tight text-[120px] md:text-[180px] lg:text-[240px] text-[#e1024d]/80 drop-shadow-xl">
//                     HIRED.COM
//                 </h1>
//
//                 <Link
//                     to="/register"
//                     className="mt-10 bg-[#e1024d] border border-[#b8013e] text-white px-10 py-4 rounded-xl text-2xl font-semibold hover:bg-[#c50142] transition"
//                 >
//                     Register
//                 </Link>
//
//                 <p className="mt-6 text-gray-400 text-lg">
//                     Already have an account?
//                     <Link
//                         to="/login"
//                         className="text-[#e1024d] ml-2 hover:underline"
//                     >
//                         Login
//                     </Link>
//                 </p>
//
//             </div>
//         </div>
//     );
// }
//
// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaStar, FaUsers, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Home() {
    const features = [
        {
            icon: <FaRocket className="text-4xl text-pink-400" />,
            title: "Fast & Efficient",
            description: "Get your personalized interview report in seconds"
        },
        {
            icon: <FaStar className="text-4xl text-purple-400" />,
            title: "AI-Powered",
            description: "Advanced AI analysis for accurate skill assessment"
        },
        {
            icon: <FaUsers className="text-4xl text-blue-400" />,
            title: "Career Growth",
            description: "Personalized preparation plans to boost your skills"
        }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen flex flex-col overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-pink-500/5 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-1000"></div>
            </div>

            <Navbar />

            {/* HERO SECTION */}
            <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-20 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                        <span className="text-sm text-gray-300 font-medium">AI-Powered Interview Preparation</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold gradient-text tracking-tight mb-6 leading-tight">
                        Find Your Next
                        <br className="hidden sm:block" />
                        <span className="block mt-2">Opportunity</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        A modern platform designed to connect talent with the right companies.
                        <span className="block mt-2 text-gray-300 font-medium">Fast, simple, and built for the future.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link
                            to="/register"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 border border-pink-500/30 px-8 py-4 rounded-xl text-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-105"
                        >
                            Get Started Free
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-200">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="w-full py-6 px-4 text-center glass border-t border-white/10 relative z-10">
                <p className="text-gray-500 text-sm sm:text-base">
                    © {new Date().getFullYear()} HIRED.COM — All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default Home;