import React from 'react'

import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin section

import AdminLogin from './admin/AdminLogin'
import AdminHome from './admin/AdminHome'
import LectureDashboard from './admin/LectureDashboard'
import MyProfile from './pages/MyProfile'
import CustomerHome from './pages/CustomerHome'
import AdminReadiness from './admin/AdminReadiness';
import StudentReadiness from './pages/StudentReadiness';
import AdminJobs from './admin/AdminJobs';
import StudentJobs from './pages/StudentJobs';
import StudentPortfolio from './pages/StudentPortfolio';
import AdminStudents from './admin/AdminStudents';

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/customer-home' element={<CustomerHome/>}/>
        <Route path='/admin/readiness' element={<AdminReadiness/>}/>

        {/* admin */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/admin/lecture-dashboard' element={<LectureDashboard/>}/>
        <Route path='/readiness' element={<StudentReadiness/>}/>
        <Route path='/admin/jobs' element={<AdminJobs/>}/>
        <Route path='/jobs' element={<StudentJobs/>}/>
        <Route path='/portfolio' element={<StudentPortfolio/>}/>
        <Route path='/admin/students' element={<AdminStudents/>}/>

      </Routes>
    </div>
  )
}

export default App
