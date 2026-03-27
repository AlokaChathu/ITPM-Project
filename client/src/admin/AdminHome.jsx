import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LogOut, ClipboardCheck } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminHome() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      await axios.get(`http://localhost:4000/api/admin/logout`);
      navigate("/admin/login");
      toast.success("Logout Successful");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-8">
      <div className="max-w-5xl mx-auto mt-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/20 backdrop-blur-lg shadow-lg rounded-3xl p-6 border border-white/30">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 md:mb-0">
            Admin Dashboard
          </h1>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 active:scale-95"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Dashboard Modules Grid */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6">System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Internship Readiness Module Card */}
          <div
            onClick={() => navigate('/admin/readiness')}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all group flex flex-col items-center text-center"
          >
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4 shadow-inner">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
              Internship Readiness
            </h3>
            <p className="text-slate-600 text-sm">
              Review student CVs, evaluate academic performance, and approve internship eligibility.
            </p>
          </div>

          {/* Job Board Module Card */}
          <div
            onClick={() => navigate('/admin/jobs')}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all group flex flex-col items-center text-center"
          >
            <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">
              Manage Internships
            </h3>
            <p className="text-slate-600 text-sm">
              Post new internship opportunities and review student applications.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminHome;