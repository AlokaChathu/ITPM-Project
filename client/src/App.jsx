import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";
import MyProfile from "./pages/MyProfile";
import CustomerHome from "./pages/CustomerHome";
import AdminLayout from "./pages/admin/AdminLayout";
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

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/home"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route
            index
            element={<p className="text-slate-600">Admin panel shell — add dashboard page next.</p>}
          />
        </Route>
        <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
