import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/AuthSlice";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../../../constants.js";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <div className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#1f1f1f] via-[#1a0a0a] to-[#1f1f1f] flex items-center justify-center p-6">
            {/* Blurry moving pinkish circle */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -top-40
                    -left-40
                    h-112
                    w-112
                    rounded-full
                    bg-[#e0024d]/60
                    opacity-40
                    blur-3xl
                    animate-[floatCircle_18s_ease-in-out_infinite_alternate]
                "
            />

            {/* Optional second subtle circle */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-40
                    -right-40
                    h-99
                    w-99
                    rounded-full
                    bg-[#b8013e]/80
                    opacity-30
                    blur-3xl
                    animate-[floatCircle2_22s_ease-in-out_infinite_alternate]
                "
            />

            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 w-[90%] max-w-3xl text-white">
                <h1 className="text-3xl font-bold mb-6 tracking-wide">
                    Dashboard
                </h1>

                <button
                    className="px-6 py-3 rounded-lg font-semibold text-[#1f1f1f] bg-[#e1024d] hover:bg-[#b8013e] transition-all duration-300 shadow-lg"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
