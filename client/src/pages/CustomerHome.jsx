import React, { useContext, useState } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Logo from '../assets/TalenTracerLogo2.png'; // Make sure this path is correct!
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Briefcase, 
  FolderOpen,
  User, 
  LogOut, 
  Search, 
  Bell, 
  ShieldAlert,
  Settings 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

function CustomerHome() {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper for the avatar
  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Logout Logic (Combined from Navbar2)
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

  // Send Verification Logic (Combined from Navbar2)
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f7f6]">
        <LoadingSpinner />
        <p className="text-slate-500 font-medium mt-4">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans overflow-hidden">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-[#1e2330] text-slate-300 flex flex-col shadow-2xl z-20 flex-shrink-0">
        
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-slate-700/50 px-4">
          {/* Fallback text if logo fails to load, otherwise shows Logo */}
          <img src={Logo} alt="TalentTracer" className="w-32 select-none filter brightness-0 invert opacity-90" />
        </div>

        {/* Profile Section */}
        <div className="p-6 flex items-center gap-4 border-b border-slate-700/50">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {getInitials(userData.name)}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-white font-bold text-sm truncate">{userData.name.split(' ')[0]}</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">Student Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>

          <button 
            onClick={() => navigate('/customer-home')} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/15 text-indigo-400 border-l-4 border-indigo-500 font-medium transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button 
            onClick={() => navigate('/readiness')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <ClipboardCheck size={18} />
            Readiness
          </button>

          <button 
            onClick={() => navigate('/jobs')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Briefcase size={18} />
            Job Board
          </button>

          <button 
            onClick={() => navigate('/portfolio')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <FolderOpen size={18} />
            My Portfolio
          </button>

          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6 mb-4">Account</p>

          <button 
            onClick={() => navigate('/my-profile')} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <User size={18} />
            My Profile
          </button>

          {/* Verification Warning Link (Only shows if unverified) */}
          {!userData.isAccountVerified && (
            <button 
              onClick={sendVerificationOtp} 
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-medium transition-colors mt-2"
            >
              <ShieldAlert size={18} />
              Verify Email
            </button>
          )}
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="max-w-6xl mx-auto">
            
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {userData.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-500 text-lg mt-1">Here is an overview of your internship journey.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: ID Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden sticky top-0">
                  <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                  <div className="px-8 pb-8 relative">
                    <div className="w-20 h-20 rounded-2xl bg-white p-1.5 absolute -top-10 shadow-md">
                      <div className="w-full h-full bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-2xl font-bold">
                        {getInitials(userData.name)}
                      </div>
                    </div>
                    
                    <div className="pt-14 border-b border-slate-100 pb-5 mb-5">
                      <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
                      <p className="text-slate-500 text-sm font-medium mt-1">{userData.email}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs font-bold tracking-wider">AGE</p>
                        <p className="font-semibold text-slate-800">{userData.age || 'N/A'}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs font-bold tracking-wider">PHONE</p>
                        <p className="font-semibold text-slate-800">{userData.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-bold tracking-wider mb-1">ADDRESS</p>
                        <p className="font-semibold text-slate-800 text-sm">{userData.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs font-bold tracking-wider">STATUS</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          userData.isAccountVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${userData.isAccountVerified ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {userData.isAccountVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Modules */}
              <div className="lg:col-span-2 space-y-5">
                
                {/* Module 1: Readiness */}
                <div 
                  onClick={() => navigate('/readiness')}
                  className="bg-white rounded-2xl p-6 sm:p-8 flex items-center gap-6 cursor-pointer shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    <ClipboardCheck size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Internship Readiness</h4>
                    <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
                      Submit your CV, view academic feedback, and check your eligibility for the upcoming internship program.
                    </p>
                  </div>
                </div>

                {/* Module 2: Job Board */}
                <div 
                  onClick={() => navigate('/jobs')}
                  className="bg-white rounded-2xl p-6 sm:p-8 flex items-center gap-6 cursor-pointer shadow-sm border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Internship Job Board</h4>
                    <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
                      Browse active internship postings from top companies and apply instantly once you are eligible.
                    </p>
                  </div>
                </div>

                {/* Module 3: Portfolio & Inbox */}
                <div 
                  onClick={() => navigate('/portfolio')}
                  className="bg-white rounded-2xl p-6 sm:p-8 flex items-center gap-6 cursor-pointer shadow-sm border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="bg-sky-50 p-4 rounded-2xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                    <FolderOpen size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">My Portfolio & Inbox</h4>
                    <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
                      Manage your skill tags to improve job matching and check direct messages from the admin team.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerHome;