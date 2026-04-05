import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import BgImg from "../assets/backgroundImage.png";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import NewLogo from "../assets/TalenTracerLogo.png";

import { Mail, Lock } from "lucide-react";
import { API_BASE } from "../config/api.js";

/** Common domain typos — login must match the exact email stored at registration. */
function domainTypoHint(raw) {
  const i = String(raw).trim().lastIndexOf("@");
  if (i < 0) return "";
  const domain = raw.slice(i + 1).trim().toLowerCase();
  const fixes = {
    "gmai.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "hotmial.com": "hotmail.com",
    "yahooo.com": "yahoo.com",
  };
  const correct = fixes[domain];
  return correct ? `You typed @${domain}. Did you mean @${correct}?` : "";
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/admin/login`,
        { email: email.trim(), password },
        { withCredentials: true }
      );
      setIsLoading(false);

      if (res.status === 200 && res.data?.success !== false) {
        toast.success("Welcome back");
        navigate("/admin/home");
      } else {
        setError(res.data?.message || "Login failed");
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err) {
      setIsLoading(false);
      const unreachable =
        err.code === "ERR_NETWORK" ||
        err.message === "Network Error" ||
        !err.response;
      if (unreachable) {
        const hint =
          "Cannot reach the API. From the project server folder run the backend (e.g. npm run dev) and ensure MongoDB is running.";
        setError(hint);
        toast.error(hint);
      } else if (err.response?.status === 401 || err.response?.status === 400) {
        const m = err.response?.data?.message || "Invalid email or password";
        const typo = domainTypoHint(email);
        const full = typo ? `${m} ${typo}` : m;
        setError(full);
        toast.error(full);
      } else {
        setError(err.response?.data?.message || "Something went wrong. Try again.");
        toast.error(err.response?.data?.message || "Something went wrong. Try again.");
      }
    }
  };

  const emailHint = domainTypoHint(email);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-blue-900 to-blue-100/30 backdrop-blur-md" />

      <img
        src={NewLogo}
        alt="logo"
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 z-10 w-28 cursor-pointer"
      />

      <div
        className="relative z-10 mt-20 mb-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <h2 className="mb-2 text-center text-3xl font-bold text-white/90">USIMS Admin Login</h2>
        <p className="mb-8 text-center text-sm text-gray-300">
          Sign in with the same email and password you used on{" "}
          <Link to="/admin/register" className="text-indigo-300 underline hover:text-indigo-200">
            Create admin account
          </Link>
          . (Student signup on the home page is a different account.)
        </p>

        {/* @validation — HTML5: type="email", required; password required */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/30 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-gray-400 backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Admin email"
            />
            {emailHint && <p className="mt-2 text-xs text-amber-200/90">{emailHint}</p>}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/30 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-gray-400 backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-900 py-3 font-semibold text-white/90 transition hover:scale-[1.02]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          First time?{" "}
          <Link to="/admin/register" className="font-medium text-indigo-300 underline hover:text-indigo-200">
            Create admin account
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-300">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
