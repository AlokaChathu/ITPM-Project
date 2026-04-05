import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";

const MyProfile = () => {
  const { userData } = useContext(AppContent);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.id) setId(userData.id);
    if (userData?.name) setName(userData.name);
    if (userData?.email) setEmail(userData.email);
    if (userData?.age) setAge(userData.age);
    if (userData?.phone) setPhone(userData.phone);
    if (userData?.address) setAddress(userData.address);
  }, [userData]);

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      await axios.put(`http://localhost:4000/api/user/customer/${id}`, {
        name,
        email,
        age,
        phone,
        address,
      });
      setIsLoading(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      setIsLoading(false);
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const removeProfile = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:4000/api/user/customer/${id}`);
      setIsLoading(false);
      navigate("/login");
      toast.success("Profile removed successfully");
    } catch (error) {
      setIsLoading(false);
      console.error(error.response?.data || error.message);
      toast.error("Failed to remove profile");
    }
  };

  // Helper for the avatar
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar2 />
      
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              My Profile
            </h1>
            <p className="mt-2 text-slate-600">
              Update your personal information and manage your account.
            </p>
          </div>
          <button 
            onClick={() => navigate('/customer-home')}
            className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden relative">
          
          {/* Accent Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

          <div className="px-6 sm:px-10 pb-10 relative">
            
            {/* Avatar Float */}
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 absolute -top-12 shadow-lg border border-slate-100">
              <div className="w-full h-full bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-3xl font-bold">
                {getInitials(name)}
              </div>
            </div>

            <form className="pt-16 space-y-8">
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                {/* ID Field */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Account ID</label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Account ID"
                    readOnly // Generally ID shouldn't be edited manually to prevent DB errors!
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 shadow-sm outline-none cursor-not-allowed"
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    pattern="[0-9+ ]{9,15}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* Address (Full Width) */}
              <div className="space-y-2 border-t border-slate-100 pt-6">
                <label className="text-sm font-bold text-slate-700">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Tip: Keep your phone number and address updated for formal university documentation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100">
                
                {/* Delete Button */}
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  onClick={removeProfile}
                >
                  Delete Account
                </button>

                {/* Save Button */}
                <button
                  onClick={updateProfile}
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MyProfile;