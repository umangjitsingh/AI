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
            <div className="min-h-screen w-full bg-[#191919] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">

                    {/* Spinner */}
                    <div className="w-16 h-16 border-4 border-[#2a2a2a] border-t-[#e1024d] rounded-full animate-spin"></div>

                    {/* Text */}
                    <p className="text-gray-300 text-xl tracking-wide">
                        Loading, please wait...
                    </p>
                </div>
            </div>
        );

        ;   // GLOBAL LOADING
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <Outlet />
        </div>
    );
}

export default RootLayout;