import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/company/dashboard",
        { withCredentials: true }
      );

      if (data.success) {
        setCompany(data.company);
        setError("");
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/company-auth/logout",
        {},
        { withCredentials: true }
      );

      alert("Logged out successfully");
      navigate("/company-login");
    } catch (error) {
      alert("Logout failed");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-red-600 text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 flex justify-between items-center">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
              {company.companyName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Welcome, {company.companyName}
              </h2>
              <p className="text-gray-500 text-sm">
                Manage your internships efficiently
              </p>
              
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="mb-8">
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-[1px] shadow-xl">
    <div className="rounded-3xl bg-white px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 mb-2">
        Company Description
      </p>

      <p className="text-gray-700 text-base leading-7 font-medium">
        {company.description}
      </p>
    </div>
  </div>
</div>

        {/* Feature Buttons */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Management Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button
              onClick={() => navigate("/internship-post")}
              className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition"
            >
              📌 Internship Post
            </button>

            <button
              onClick={() => navigate("/internship-tracking")}
              className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition"
            >
              📊 Internship Tracking
            </button>

            <button
              onClick={() => navigate("/reports")}
              className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition"
            >
              📝 Reports
            </button>

            <button
              onClick={() => navigate("/issues")}
              className="bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 transition"
            >
              ⚠️ Issues
            </button>

            <button
              onClick={() => navigate("/progress-dashboard")}
              className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition"
            >
              📈 Progress Dashboard
            </button>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Company Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            

            <div className="bg-gray-50 p-5 rounded-xl">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{company.companyEmail}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl">
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{company.companyPhone}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{company.companyAddress}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CompanyDashboard;