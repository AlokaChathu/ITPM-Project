import React, { useContext } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';

function CustomerHome() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  // Helper to get initials for the avatar placeholder
  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar2 />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        
        {/* Dynamic Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {userData?.name ? userData.name.split(' ')[0] : 'Student'}! 
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Manage your internship journey, track your readiness, and explore opportunities.
          </p>
        </div>
        
        {userData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: User Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden sticky top-8">
                {/* Accent Banner */}
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                
                <div className="px-8 pb-8 relative">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-2xl bg-white p-1.5 absolute -top-10 shadow-md">
                    <div className="w-full h-full bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-2xl font-bold">
                      {getInitials(userData.name)}
                    </div>
                  </div>
                  
                  <div className="pt-14 border-b border-slate-100 pb-5 mb-5">
                    <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">{userData.email}</p>
                  </div>
                  
                  <div className="space-y-5">
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
                      <p className="text-slate-400 text-xs font-bold tracking-wider">ACCOUNT STATUS</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        userData.isAccountVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${userData.isAccountVerified ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {userData.isAccountVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard Modules */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 px-1">Your Workspace</h3>
              
              {/* Module 1: Readiness */}
              <div 
                onClick={() => navigate('/readiness')}
                className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group"
              >
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Internship Readiness</h4>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    Submit your CV, view academic feedback, and check your eligibility for the upcoming internship program.
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>

              {/* Module 2: Job Board */}
              <div 
                onClick={() => navigate('/jobs')}
                className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl shadow-sm border border-slate-200 hover:border-purple-300 transition-all group"
              >
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Internship Job Board</h4>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    Browse active internship postings from top companies and apply instantly once you are eligible.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
              </div>

              {/* Module 3: Portfolio & Inbox */}
              <div 
                onClick={() => navigate('/portfolio')}
                className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl shadow-sm border border-slate-200 hover:border-sky-300 transition-all group"
              >
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">My Portfolio & Inbox</h4>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    Manage your skill tags to improve job matching and check direct messages from the admin team.
                  </p>
                </div>
                <div className="bg-sky-50 p-4 rounded-2xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Loading your workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerHome;