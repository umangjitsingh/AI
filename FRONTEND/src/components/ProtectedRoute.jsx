import React from 'react'
import {useSelector} from "react-redux";
import {Navigate} from "react-router";

function ProtectedRoute({children}) {
    const {isAuthenticated, loading} = useSelector(state => state.auth);
    if (!isAuthenticated) return <Navigate to="/login"/>;
    if (loading) return <div className="text-white">Loading...</div>;
    return children;

}

export default ProtectedRoute
