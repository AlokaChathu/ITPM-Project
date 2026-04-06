import React, { useEffect, useRef, useContext } from 'react';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BgImg from "../assets/backgroundImage.png";
import NewLogo from '../assets/LogoNew.png';

function EmailVerify() {

    axios.defaults.withCredentials = true;

    const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

            if (data.success) {
                toast.success(data.message);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (_err) {
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        if (isLoggedin && userData && userData.isAccountVerified) navigate('/');
    }, [isLoggedin, userData, navigate]);

    return (
        <div className="relative min-h-screen flex items-center justify-center px-6 sm:px-0">

            {/* Background image */}
            <div className="absolute inset-0">
                <img src={BgImg} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
            </div>

            {/* Logo */}
            <img
                onClick={() => navigate("/")}
                src={NewLogo}
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer z-20"
            />

            {/* Form */}
            <form
                onSubmit={onSubmitHandler}
                className="relative z-30 bg-slate-900 bg-opacity-90 p-8 rounded-xl shadow-xl w-96 text-sm flex flex-col items-center"
            >
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
                <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>

                <div className="flex justify-between mb-8 w-full" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            type="text"
                            maxLength={1}
                            key={index}
                            required
                            ref={e => inputRefs.current[index] = e}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 bg-[#333AdC] text-white text-xl rounded-md text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    ))}
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white font-medium hover:scale-105 transition-transform">
                    Verify Email
                </button>
            </form>
        </div>
    );
}

export default EmailVerify;
