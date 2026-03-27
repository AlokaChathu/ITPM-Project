import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from '../assets/TalenTracerLogo2.png'

function NavbarAdmin() {
  const navigate = useNavigate();

    const logout = async () =>{
        try {
            navigate('/');

        } catch (error) {
            toast.error(error.message)
        }
    };

    const viewDashboard = () => {

      navigate('/admin/home');

    };

  return (
    <header className="w-full bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="shrink-0" aria-label="Go to home">
            <img src={Logo} alt="TalentTracer" className="w-28 sm:w-32 select-none" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={viewDashboard}
              className="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    
  );
}

export default NavbarAdmin;
