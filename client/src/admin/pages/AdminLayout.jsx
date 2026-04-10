import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { AdminProvider } from "../../context/AdminContext";
import { API_BASE } from "../../config/api.js";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get(`${API_BASE}/api/admin/logout`, { withCredentials: true });
      toast.success("Logout successful");
      navigate("/admin/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  return (
    <AdminProvider>
      <div className="relative min-h-screen overflow-hidden">
        {/* Analytics-style backdrop: cool slate + indigo depth */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-200 via-indigo-100/80 to-sky-100/90"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_100%_0%,rgba(79,70,229,0.12),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(14,165,233,0.08),transparent_50%)]"
          aria-hidden
        />

        <div className="relative z-10 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200/60 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-md md:px-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-indigo-950 md:text-2xl">
                  System administration &amp; analytics
                </h1>
                <p className="mt-0.5 text-xs font-medium text-slate-600 md:text-sm">
                  University Student Internship Management System
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
              <AdminSidebar />
              <main className="flex-1 rounded-xl border border-white/60 bg-white/90 p-4 shadow-md shadow-indigo-950/5 backdrop-blur-sm md:p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
