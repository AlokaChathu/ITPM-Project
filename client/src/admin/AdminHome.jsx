import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Briefcase,
  Users,
  LogOut,
  Search,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { API_BASE } from "../config/api.js";

function AdminHome() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      await axios.get(`${API_BASE}/api/admin/logout`);
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
    <div className="flex h-screen bg-[#f4f6f9] font-sans overflow-hidden">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#1e2330] text-slate-300 flex flex-col shadow-2xl z-20 flex-shrink-0">
        
        {/* Profile Section (Matches Reference Image) */}
        <div className="p-6 flex items-center gap-4 border-b border-slate-700/50">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
            A
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">System Admin</h3>
            <p className="text-xs text-slate-400 mt-0.5">Administrator</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>

          {/* Active Link (Dashboard) */}
          <button 
            onClick={() => navigate('/admin/home')} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/15 text-indigo-400 border-l-4 border-indigo-500 font-medium transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          {/* Inactive Links */}
          <button 
            onClick={() => navigate('/admin/readiness')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <ClipboardCheck size={18} />
            Internship Readiness
          </button>

          <button 
            onClick={() => navigate('/admin/jobs')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Briefcase size={18} />
            Manage Internships
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Users size={18} />
            Student Directory
          </button>

          <button
            onClick={() => navigate("/admin/system")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <BarChart3 size={18} />
            Admin &amp; Analytics Panel
          </button>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-500 font-medium transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= RIGHT SIDE (MAIN CONTENT) ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f4f7f6]">
        
        {/* Top Header Bar (Search & Icons) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          
          {/* Search Bar */}
          <div className="flex items-center text-slate-400 bg-slate-100/80 px-4 py-2 rounded-full w-96 border border-slate-200/60 focus-within:border-indigo-300 focus-within:bg-white transition-all">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none ml-3 w-full text-sm text-slate-700 placeholder-slate-400" 
            />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-5 text-slate-400">
            <Settings size={20} className="hover:text-slate-700 cursor-pointer transition-colors" />
            <div className="relative cursor-pointer hover:text-slate-700 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back. Here is what's happening today.</p>
          </div>

          {/* EMPTY PLACEHOLDER - As requested */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl h-[65vh] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
              <LayoutDashboard size={40} className="text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-600 mb-1">Right Side Main Content</p>
            <p className="text-sm text-slate-400 max-w-sm text-center">
              This area is kept completely empty for you to add your charts, tables, and widgets later.
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}

export default AdminHome;