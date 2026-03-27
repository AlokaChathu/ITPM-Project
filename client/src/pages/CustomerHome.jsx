import React, { useContext } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function CustomerHome() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mt-10 text-indigo-900 mb-10'>Customer Dashboard</h1>
        
        {userData ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            
            {/* User Profile Card */}
            <div className='md:col-span-1 bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-500 h-fit'>
              <div className='border-b pb-4 mb-6'>
                <h2 className='text-2xl font-bold text-slate-800'>{userData.name}</h2>
                <p className='text-slate-500'>{userData.email}</p>
              </div>
              <div className='space-y-4'>
                <div>
                  <p className='text-slate-400 text-xs font-bold tracking-wider'>AGE</p>
                  <p className='font-semibold text-slate-800'>{userData.age}</p>
                </div>
                <div>
                  <p className='text-slate-400 text-xs font-bold tracking-wider'>PHONE</p>
                  <p className='font-semibold text-slate-800'>{userData.phone}</p>
                </div>
                <div>
                  <p className='text-slate-400 text-xs font-bold tracking-wider'>ADDRESS</p>
                  <p className='font-semibold text-slate-800'>{userData.address}</p>
                </div>
                <div className='pt-4 border-t'>
                  <p className='text-slate-400 text-xs font-bold tracking-wider'>ACCOUNT STATUS</p>
                  <p className={`font-bold ${userData.isAccountVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {userData.isAccountVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Modules / Quick Links */}
            <div className='md:col-span-2 space-y-6'>
              <h3 className='text-2xl font-bold text-slate-800 mb-4'>Available Modules</h3>
              
              {/* Navigate to Readiness Page Card */}
              <div 
                onClick={() => navigate('/readiness')}
                className='bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all border border-transparent hover:border-indigo-300 group'
              >
                <div>
                  <h4 className='text-xl font-bold text-indigo-900 group-hover:text-indigo-600 transition'>Internship Readiness</h4>
                  <p className='text-slate-500 mt-2 text-sm max-w-md'>Submit your CV, view academic feedback, and check your eligibility for the upcoming internship program.</p>
                </div>
                <div className='bg-indigo-50 p-4 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>

              {/* You can add more dashboard cards here in the future! */}

            </div>

            {/* Navigate to Job Board Card */}
              <div 
                onClick={() => navigate('/jobs')}
                className='bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all border border-transparent hover:border-purple-300 group'
              >
                <div>
                  <h4 className='text-xl font-bold text-purple-900 group-hover:text-purple-600 transition'>Internship Job Board</h4>
                  <p className='text-slate-500 mt-2 text-sm max-w-md'>Browse active internship postings and apply with one click once you are eligible.</p>
                </div>
                <div className='bg-purple-50 p-4 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                </div>
              </div>

              {/* Navigate to Portfolio Card */}
              <div 
                onClick={() => navigate('/portfolio')}
                className='bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all border border-transparent hover:border-blue-300 group'
              >
                <div>
                  <h4 className='text-xl font-bold text-blue-900 group-hover:text-blue-600 transition'>My Portfolio & Inbox</h4>
                  <p className='text-slate-500 mt-2 text-sm max-w-md'>Manage your skills and check messages from the admin team.</p>
                </div>
                <div className='bg-blue-50 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </div>

          </div>
        ) : (
          <div className='text-center text-slate-600 bg-white p-10 rounded-2xl shadow-sm'>
            <p className="text-xl font-medium">Loading your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerHome;