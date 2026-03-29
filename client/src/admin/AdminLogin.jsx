import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import BgImg from "../assets/Background1.jpg";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import NewLogo from "../assets/TalenTracerLogo2.png";

import {
  Mail,Lock
} from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fillDemo = () => {
    setEmail("admin2@gmail.com");
    setPassword("admin123");
    setError("");
  };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    const res = await axios.post("http://localhost:4000/api/admin/login", {
      email,
      password,
    });
    setIsLoading(false);

    if (res.status === 200) {
      navigate("/admin/home");
    }
  } catch (err) {
    setIsLoading(false);

    if (err.response && err.response.status === 401) {

      setError("Invalid credentials");
      toast.error("Invalid credentials");
      navigate("/admin/login");
    } else {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  }
};


  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
 
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-white/10 to-black/40 backdrop-blur-sm" />

      <img
        src={NewLogo}
        alt="logo"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-28 cursor-pointer z-10"
      />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8
             bg-white/85 backdrop-blur-xl border border-white/30
             shadow-[0_20px_50px_rgba(0,0,0,0.35)]
             text-slate-800 mt-20 mb-10"
      >
        <h2 className="text-3xl text-slate-900 font-bold text-center mb-2">
          Admin Login
        </h2>
        <p className="text-center text-sm text-slate-600 mb-8">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
       
          <div className="relative">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     bg-white text-slate-800 placeholder-slate-400 transition"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     bg-white text-slate-800 placeholder-slate-400 transition"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-3 rounded-xl border border-indigo-200 bg-white text-indigo-700 font-semibold hover:border-indigo-300 hover:shadow-sm transition"
            >
              Demo Fill
            </button>

          <button
            type="submit"
            className="w-full py-3 rounded-xl
                 bg-gradient-to-r from-indigo-500 to-indigo-900
                 hover:scale-[1.02] transition font-semibold cursor-pointer text-white/90"
          >
            Login
          </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Staff member?{" "}
          <span
            onClick={() => navigate("/admin/login")}
            className="text-indigo-700 underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>


    </div>
  );
}

export default AdminLogin;
