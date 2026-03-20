import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { userData } = useContext(AppContent);

  const [id, setId] = useState("")
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
      })
      setIsLoading(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  }

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
      console.error(error.response?.data || error.message);
    }
  }

  return (
    isLoading ? <LoadingSpinner /> :
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Update your personal information.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-500/15 bg-slate-900/50 p-6 shadow-2xl backdrop-blur">
            <form className="space-y-6">

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-sm outline-none transition focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    ID
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-sm outline-none transition focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-sm outline-none transition focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 22"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-sm outline-none transition focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    pattern="[0-9+ ]{9,15}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-sm outline-none transition focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-4 py-3 text-slate-100 placeholder-slate-500 shadow-sm outline-none transition focus:border-sky-500/70 focus:ring-2 focus:ring-sky-500/30"
                />
                <p className="text-xs text-slate-500">
                  This will be used for profile and delivery details (if needed).
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  onClick={removeProfile}
                >
                  Remove Profile
                </button>

                <button
                  onClick={updateProfile}
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-xs text-slate-500">
            Tip: Keep your phone number and email updated for account recovery.
          </p>
        </div>
      </div>

  );
};

export default MyProfile;
