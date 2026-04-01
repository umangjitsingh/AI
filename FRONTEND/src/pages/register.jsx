import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom"
import {BACKEND_URL} from "../../../constants.js";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const navigate=useNavigate();

    const handleChange = (key) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [key]: e.target.value,
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const {username, email, password} = formData;
            const result = await axios.post(`${BACKEND_URL}/api/auth/register`,
                {username,email,password},
                {withCredentials:true});
            console.log("resisterPageData",result.data)


            if(result.status === 201){
                navigate('/login');
            };
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#191919]">
            <div className="w-full max-w-md bg-[#1f1f1f] shadow-xl rounded-xl p-8 border border-[#2a2a2a]">
                <h1 className="text-3xl font-semibold text-center text-gray-100 mb-6">
                    Create Account
                </h1>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1 font-medium">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={handleChange("username")}
                            placeholder="Enter your username"
                            className="p-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring focus:ring-[#e1024d]"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange("email")}
                            placeholder="Enter your email"
                            className="p-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring focus:ring-[#e1024d]"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={handleChange("password")}
                            placeholder="Enter your password"
                            className="p-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring focus:ring-[#e1024d]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 cursor-pointer bg-[#e1024d] border border-[#b8013e] text-white py-3 rounded-lg font-semibold hover:bg-[#c50142] transition w-1/2 mx-auto"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-4">
                    Already have an account?
                    <Link to={"/login"} className="text-[#e1024d]/90 font-medium cursor-pointer ml-1 hover:underline" >
            Login
          </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;