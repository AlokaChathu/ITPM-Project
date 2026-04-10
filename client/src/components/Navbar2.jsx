import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from '../assets/TalenTracerLogo2.png'

function Navbar2() {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

    const sendVerificationOtp = async () =>{

        try {
            
            axios.defaults.withCredentials = true;

            const {data} = await axios.post('http://localhost:4000/api/auth/send-verify-otp');

            if(data.success){

                navigate('/email-verify');
                toast.success(data.message);

            }else{

                 toast.error(data.message);

            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    const logout = async () =>{
        try {

            localStorage.removeItem('customer');
            
            axios.defaults.withCredentials = true;

            const {data} = await axios.post('http://localhost:4000/api/auth/logout');

            data.success && setIsLoggedin(false);
            data.success && setUserData(false);
            navigate('/');

        } catch (error) {
            toast.error(error.message)
        }
    };

    const viewProfile = () => {

      navigate('/my-profile');

    };

    const viewDashboard = () => {

      navigate('/customer-home');

    };

    const viewHome = () => {

      navigate('/customer-home');

    };

  return (
    <header className="w-full">
      <div className="w-full flex justify-between items-center px-4 py-4 sm:px-6 lg:px-48">
        <button onClick={() => navigate('/')} className="shrink-0" aria-label="Go to home">
          <img src={Logo} alt="TalentTracer" className="w-28 sm:w-32 select-none" />
        </button>

        <div className="flex items-center gap-3">
          {!userData && (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-6 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
            >
              Login
            </button>
          )}

          {userData && (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-black text-white font-bold shadow-sm ring-2 ring-indigo-100"
                aria-label="Open user menu"
                aria-expanded={menuOpen}
              >
                {userData.name[0].toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-10 pt-2 text-black">
                  <ul className="list-none m-0 min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white text-sm shadow-lg">
                    {!userData.isAccountVerified && (
                      <li onClick={sendVerificationOtp} className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
                        Verify email
                      </li>
                    )}
                    {userData.isAccountVerified && (
                      <li onClick={viewHome} className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
                        Home
                      </li>
                    )}
                    {userData.isAccountVerified && (
                      <li onClick={viewDashboard} className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
                        Dashboard
                      </li>
                    )}
                    {userData.isAccountVerified && (
                      <li onClick={viewProfile} className="px-4 py-2 hover:bg-slate-50 cursor-pointer">
                        My Profile
                      </li>
                    )}
                    <li onClick={logout} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-rose-600">
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setMobileOpen((v) => !v);
              setMenuOpen(false);
            }}
            className="inline-flex sm:hidden items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {userData ? (
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex justify-center items-center rounded-full bg-indigo-600 text-white font-bold ring-2 ring-indigo-100">
                    {userData.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{userData.name}</p>
                    <p className="text-xs text-slate-500">Account</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-200">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                >
                  Login
                </button>
              </div>
            )}

            <div className="p-2 text-sm">
              {!userData ? null : (
                <>
                  {!userData.isAccountVerified && (
                    <button onClick={sendVerificationOtp} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50">
                      Verify email
                    </button>
                  )}
                  {userData.isAccountVerified && (
                    <button onClick={viewHome} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50">
                      Home
                    </button>
                  )}
                  {userData.isAccountVerified && (
                    <button onClick={viewDashboard} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50">
                      Dashboard
                    </button>
                  )}
                  {userData.isAccountVerified && (
                    <button onClick={viewProfile} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50">
                      My Profile
                    </button>
                  )}
                  <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-rose-600">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>

    
  );
}

export default Navbar2;
