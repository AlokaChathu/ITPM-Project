import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from '../assets/TalenTracerLogo2.png'

function NavbarAdmin() {
  const navigate = useNavigate();

    const logout = async () =>{
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        try {
          axios.defaults.withCredentials = true;
          await axios.get('http://localhost:4000/api/admin/logout');
          toast.success('Logout Successful');
          navigate('/admin/login');
        } catch (error) {
          console.error(error.response?.data || error.message);
          toast.error(`Error: ${error.message}`);
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
              className="cursor-pointer inline-flex items-center justify-center border-1  text-[18px] mr-3 font-semibold px-5 py-2 hover:bg-blue-100/20 rounded-xl  transition"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="cursor-pointer inline-flex items-center justify-center   text-[18px]  rounded-xl border   px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100/30 transition"
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
