import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="w-full py-4 px-4 sm:px-6 lg:px-10 flex justify-between items-center glass bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-pink-900/20 sticky top-0 z-50">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/30">
                        <span className="text-white font-bold text-lg">H</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight hidden sm:block">
                        HIRED<span className="text-gray-400">.COM</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                isActive(link.path)
                                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-3 rounded-xl glass text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-[73px] left-0 w-full h-[calc(100vh-73px)] glass md:hidden z-40 animate-fade-in">
                    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`w-full max-w-xs text-center py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                                    isActive(link.path)
                                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
