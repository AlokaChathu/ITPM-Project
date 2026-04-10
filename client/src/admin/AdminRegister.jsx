import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import BgImg from "../assets/backgroundImage.png";
import LoadingSpinner from "../components/LoadingSpinner";
import NewLogo from "../assets/TalenTracerLogo.png";
import { adminService } from "../services/adminService";

const initialForm = {
  admin_id: "",
  fullName: "",
  email: "",
  role: "Admin",
  phoneNumber: "",
  password: "",
};

/**
 * First-time admin account creation — calls POST /api/admin/register (no JWT required).
 */
function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // @validation — All fields required; email format; password min 6
  const validate = () => {
    const next = {};
    if (!form.admin_id?.trim()) next.admin_id = "Admin ID is required";
    if (!form.fullName?.trim() || form.fullName.trim().length < 2) {
      next.fullName = "Full name must be at least 2 characters";
    }
    if (!/\S+@\S+\.\S+/.test(form.email || "")) next.email = "Enter a valid email";
    if (!form.role?.trim()) next.role = "Role is required";
    if (!form.phoneNumber?.trim()) next.phoneNumber = "Phone number is required";
    if (!form.password || form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const data = await adminService.registerAdmin({
        admin_id: form.admin_id.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
      });
      setIsLoading(false);
      if (data.success) {
        toast.success("Admin account created. You can sign in now.");
        navigate("/admin/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      setIsLoading(false);
      const unreachable =
        err.code === "ERR_NETWORK" ||
        err.message === "Network Error" ||
        !err.response;
      if (unreachable) {
        toast.error(
          "Cannot reach the API. Start the Express server (server folder, npm run dev) and confirm MongoDB is connected."
        );
      } else {
        toast.error(err.response?.data?.message || err.message || "Registration failed");
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-blue-900 to-blue-100/30 backdrop-blur-md" />

      <img
        src={NewLogo}
        alt="logo"
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 z-10 w-28 cursor-pointer"
      />

      <div
        className="relative z-10 mt-16 mb-10 w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-8 text-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <h2 className="mb-2 text-center text-3xl font-bold text-white/90">Create Admin Account</h2>
        <p className="mb-6 text-center text-sm text-gray-300">
          Register once, then use Admin Login to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Admin ID</label>
            <input
              value={form.admin_id}
              onChange={(e) => setForm((p) => ({ ...p, admin_id: e.target.value }))}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. ADM001"
            />
            {errors.admin_id && <p className="mt-1 text-xs text-red-300">{errors.admin_id}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your full name"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@university.edu"
            />
            {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Admin" className="bg-slate-800">
                Admin
              </option>
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-300">{errors.role}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Phone Number</label>
            <input
              value={form.phoneNumber}
              onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="07xxxxxxxx"
            />
            {errors.phoneNumber && <p className="mt-1 text-xs text-red-300">{errors.phoneNumber}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="At least 6 characters"
            />
            {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-900 py-3 font-semibold text-white transition hover:scale-[1.01]"
          >
            Create admin account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/admin/login" className="font-medium text-indigo-300 underline hover:text-indigo-200">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
