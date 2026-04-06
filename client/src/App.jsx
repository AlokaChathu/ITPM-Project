import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// existing pages
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import MyProfile from './pages/MyProfile'
import CustomerHome from './pages/CustomerHome'
<<<<<<< Updated upstream

// 🔥 your module pages
=======
import AdminReadiness from './admin/AdminReadiness';
import StudentReadiness from './pages/StudentReadiness';
import AdminJobs from './admin/AdminJobs';
import StudentJobs from './pages/StudentJobs';
import StudentPortfolio from './pages/StudentPortfolio';
import AdminStudents from './admin/AdminStudents';
>>>>>>> Stashed changes
import InternshipTracking from './pages/InternshipTracking'
import WeeklyMonthlyReports from './pages/WeeklyMonthlyReports'
import IssueReporting from './pages/IssueReporting'
import ProgressDashboard from './pages/ProgressDashboard'
import CompanyDashboard from './company/CompanyDashboard'
import CompanyRegister from './company/CompanyRegister';
import CompanyLogin from './company/CompanyLogin';
import InternshipPost from "./company/InternshipPost";
<<<<<<< Updated upstream

// admin
import AdminLogin from './admin/AdminLogin'
import AdminHome from './admin/AdminHome'

// toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
>>>>>>> Stashed changes

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        {/* main */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/customer-home' element={<CustomerHome />} />

        {/* 🔥 YOUR MODULE */}
        <Route path='/internship-tracking' element={<InternshipTracking />} />
        <Route path='/reports' element={<WeeklyMonthlyReports />} />
        <Route path='/issues' element={<IssueReporting />} />
        <Route path='/progress-dashboard' element={<ProgressDashboard />} />
        <Route path='/company-dashboard' element={<CompanyDashboard />} />
        <Route path='/company-register' element={<CompanyRegister />} />
        <Route path='/company-login' element={<CompanyLogin />} />
        <Route path="/internship-post" element={<InternshipPost />} />
        <Route path="/company/register" element={<CompanyRegister />} />
      


        {/* admin */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/home' element={<AdminHome />} />

        <Route path='/internship-tracking' element={<InternshipTracking />} />
        <Route path='/reports' element={<WeeklyMonthlyReports />} />
        <Route path='/issues' element={<IssueReporting />} />
        <Route path='/progress-dashboard' element={<ProgressDashboard />} />
        <Route path='/company-dashboard' element={<CompanyDashboard />} />
        <Route path='/company-register' element={<CompanyRegister />} />
        <Route path='/company-login' element={<CompanyLogin />} />
        <Route path="/internship-post" element={<InternshipPost />} />


      </Routes>
    </div>
  )
}

export default App