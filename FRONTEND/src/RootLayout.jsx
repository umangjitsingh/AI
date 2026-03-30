import React, {useEffect} from "react";
import {Outlet,} from "react-router";
import {useDispatch} from "react-redux";
import {fetchUser} from "./store/AuthSlice.js";

function RootLayout() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUser())
    }, []);

    return (

            <div className="min-h-screen w-full  flex items-center justify-center">

                <Outlet />

            </div>


    );
}

export default RootLayout;