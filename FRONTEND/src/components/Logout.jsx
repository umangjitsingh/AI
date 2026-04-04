import React from 'react'
import axios from "axios";
import {BACKEND_URL} from "../../../constants.js";
import {logout} from "../store/AuthSlice.js";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";

function Logout() {
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
        <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all border border-red-500/30 rounded-xl font-medium text-white shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
        >
            <FaSignOutAlt className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">Logout</span>
        </button>
    )
}

export default Logout
