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

function Home() {
    return (
        <div className="min-h-screen w-full bg-[#191919] text-gray-100 flex flex-col">

            {/* NAVBAR */}
            <nav className="w-full py-6 px-10 flex justify-between items-center bg-[#1f1f1f] border-b border-[#2a2a2a]">
                <h1 className="text-3xl font-bold tracking-tight text-[#e1024d]">
                    HIRED<span className="text-gray-200">.COM</span>
                </h1>

                <div className="flex items-center gap-6">
                    <Link
                        to="/login"
                        className="text-gray-300 hover:text-white transition border border-[#3a3a3a] hover:bg-[#2a2a2a] px-8 py-2 rounded-lg"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-[#e1024d] border border-[#b8013e] px-5 py-2 rounded-lg font-semibold hover:bg-[#c50142] transition"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                    Find Your Next Opportunity
                </h2>

                <p className="mt-4 text-gray-400 max-w-xl text-lg">
                    A modern platform designed to connect talent with the right companies.
                    Fast, simple, and built for the future.
                </p>

                <div className="mt-10 flex gap-6">
                    <Link
                        to="/register"
                        className="bg-[#e1024d] border border-[#b8013e] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#c50142] transition"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="px-8 py-3 rounded-lg text-lg font-semibold border border-[#3a3a3a] hover:bg-[#2a2a2a] transition"
                    >
                        Login
                    </Link>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="py-6 text-center text-gray-500 text-sm border-t border-[#2a2a2a]">
                © {new Date().getFullYear()} HIRED.COM — All rights reserved.
            </footer>
        </div>
    );
}

export default Home;