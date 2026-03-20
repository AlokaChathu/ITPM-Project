import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; 

function AdminHome() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await axios.get(`http://localhost:4000/api/admin/logout`);
      navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center p-4">

      <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-md text-center border border-white/30">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 active:scale-95"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}

export default AdminHome;
