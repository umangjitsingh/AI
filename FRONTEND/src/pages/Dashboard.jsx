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
        <div className="bg-yellow-700 w-full h-screen">
            Dashboard
            <button
                className="bg-red-100 ml-8 cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default Dashboard;
