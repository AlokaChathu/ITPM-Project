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