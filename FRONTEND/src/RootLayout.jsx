import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/AuthSlice.js";

function RootLayout() {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUser());
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    {/* Animated logo */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/30 animate-pulse">
                            <span className="text-white font-bold text-4xl">H</span>
                        </div>
                        <div className="absolute inset-0 blur-xl bg-pink-500/50 rounded-2xl animate-pulse"></div>
                    </div>

                    {/* Text */}
                    <p className="text-gray-300 text-xl tracking-wide font-medium">
                        Loading, please wait...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full">
            <Outlet />
        </div>
    );
}

export default RootLayout;