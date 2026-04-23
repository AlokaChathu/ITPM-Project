import React, { useContext, useState } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ArrowRight,
  ClipboardCheck,
  Briefcase,
  FolderOpen
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentNavigation from '../components/StudentNavigation';
import Logo from '../assets/TalenTracerLogo2.png'; // Make sure this path is correct!

function CustomerHome() {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper for the avatar
  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Logout Logic
  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      setIsLoggingOut(true);
      localStorage.removeItem('customer');
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/auth/logout');

      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Send Verification Logic
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoggingOut || !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <LoadingSpinner />
        <p className="text-slate-400 font-light mt-4 tracking-widest uppercase text-xs">Initializing Workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 text-slate-900">
      
      {/* ================= TOP NAVIGATION ================= */}
      <StudentNavigation />

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Header */}
        <header className="mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Workspace Overview
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
            Welcome back, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              {userData.name.split(' ')[0]}
            </span>
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed">
            Your journey to a professional career continues here. Track your progress, explore opportunities, and refine your portfolio.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Profile Card (Left) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500 opacity-50"></div>
              
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white text-2xl font-black shadow-xl mb-6">
                  {getInitials(userData.name)}
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{userData.name}</h2>
                <p className="text-slate-400 text-sm font-medium mb-8">{userData.email}</p>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Age</span>
                    <span className="text-sm font-bold text-slate-700">{userData.age || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone</span>
                    <span className="text-sm font-bold text-slate-700">{userData.phone || '—'}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Address</span>
                    <span className="text-sm font-bold text-slate-700 leading-relaxed">{userData.address || '—'}</span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Account Status</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    userData.isAccountVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${userData.isAccountVerified ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    {userData.isAccountVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Modules (Right) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Module: Readiness */}
            <div 
              onClick={() => navigate('/readiness')}
              className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:border-indigo-100 transition-all cursor-pointer group flex flex-col justify-between min-h-[320px]"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <ClipboardCheck size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Readiness Check</h3>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  Complete your profile and academic standing to qualify for top-tier internship opportunities.
                </p>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Module: Job Board */}
            <div 
              onClick={() => navigate('/jobs')}
              className="bg-slate-900 p-10 rounded-[2rem] shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-2 transition-all cursor-pointer group flex flex-col justify-between min-h-[320px]"
            >
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500">
                <Briefcase size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Opportunity Hub</h3>
                <p className="text-slate-400 font-light leading-relaxed mb-6">
                  Explore curated listings from global tech companies. Find your perfect match and apply instantly.
                </p>
                <div className="flex items-center gap-2 text-white font-bold text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                  View Board <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Module: Portfolio */}
            <div 
              onClick={() => navigate('/portfolio')}
              className="md:col-span-2 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all cursor-pointer group flex items-center gap-10"
            >
              <div className="hidden sm:flex w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shrink-0">
                <FolderOpen size={40} strokeWidth={1.2} />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Professional Identity</h3>
                <p className="text-slate-500 font-light leading-relaxed max-w-xl">
                  Showcase your projects and skills to recruiters. Manage your digital footprint and application history.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-blue-200 group-hover:text-blue-600 transition-all shrink-0">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} TalentTracer Identity
          </p>
          <div className="flex gap-8">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Privacy</button>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Terms</button>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CustomerHome;