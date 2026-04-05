import React from "react";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";
import AdminHome from "./admin/AdminHome";
import LectureDashboard from "./admin/LectureDashboard";
import MyProfile from "./pages/MyProfile";
import CustomerHome from "./pages/CustomerHome";
import AdminReadiness from "./admin/AdminReadiness";
import StudentReadiness from "./pages/StudentReadiness";
import AdminJobs from "./admin/AdminJobs";
import StudentJobs from "./pages/StudentJobs";
import StudentPortfolio from "./pages/StudentPortfolio";
import AdminStudents from "./admin/AdminStudents";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import InternshipApproval from "./pages/admin/InternshipApproval";
import SystemConfiguration from "./pages/admin/SystemConfiguration";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import ReportsPage from "./pages/admin/ReportsPage";
import BackupRestore from "./pages/admin/BackupRestore";
import NotificationPage from "./pages/admin/NotificationPage";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/admin/readiness" element={<AdminReadiness />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/lecture-dashboard" element={<LectureDashboard />} />
        <Route path="/readiness" element={<StudentReadiness />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/jobs" element={<StudentJobs />} />
        <Route path="/portfolio" element={<StudentPortfolio />} />
        <Route path="/admin/students" element={<AdminStudents />} />

        {/* System administration & analytics (separate from /admin/home) */}
        <Route
          path="/admin/system"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="internships" element={<InternshipApproval />} />
          <Route path="config" element={<SystemConfiguration />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="backup" element={<BackupRestore />} />
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
