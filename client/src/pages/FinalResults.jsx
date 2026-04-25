import React, { useContext, useState, useEffect } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Award,
  TrendingUp,
  FileText,
  Building,
  CheckCircle,
  XCircle,
  Printer
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentNavigation from '../components/StudentNavigation';
import StudentBg from '../assets/Student BG.jpg';

function FinalResults() {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [internshipData, setInternshipData] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/user/data');
      
      console.log('Student data response:', data);
      
      if (data.success) {
        setStudentData(data.userData);
        
        // Fetch internship data if student is graded
        if (data.userData.status === 'Graded') {
          fetchInternshipData();
        }
      } else {
        toast.error('Failed to load student data');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const fetchInternshipData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/user/internship-details');
      
      if (data.success) {
        setInternshipData(data.internshipData);
      }
    } catch (error) {
      console.error('Error fetching internship data:', error);
      // Don't show error toast - internship data is optional
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade === 'A+') return 'bg-emerald-100 text-emerald-800';
    if (grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'A-') return 'bg-lime-100 text-lime-800';
    if (grade === 'B+') return 'bg-teal-100 text-teal-800';
    if (grade === 'B') return 'bg-cyan-100 text-cyan-800';
    if (grade === 'B-') return 'bg-sky-100 text-sky-800';
    if (grade === 'C+') return 'bg-blue-100 text-blue-800';
    if (grade === 'C') return 'bg-indigo-100 text-indigo-800';
    return 'bg-rose-100 text-rose-800';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 55) return 'text-blue-600';
    if (score >= 45) return 'text-indigo-600';
    return 'text-rose-600';
  };

  const handlePrint = () => {
    setShowReport(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <LoadingSpinner />
        <p className="text-slate-400 font-light mt-4 tracking-widest uppercase text-xs">Loading Results</p>
      </div>
    );
  }

  const isGraded = studentData?.finalGrade && studentData?.status === 'Graded';

  return (
    <div className="relative min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 text-slate-900">
      
      {/* Background Image with Blur and Transparency */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${StudentBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(1px)',
          opacity: '0.6',
          zIndex: 0
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <StudentNavigation />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Academic Performance
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
            Final Results
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed">
            {isGraded 
              ? 'Your internship performance has been evaluated. View your detailed results below.'
              : 'Your final results will appear here once your internship has been graded by your lecturer.'}
          </p>
          {isGraded && (
            <button
              onClick={handlePrint}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-indigo-600/20"
            >
              <Printer size={18} />
              Generate Report
            </button>
          )}
        </header>

        {!isGraded ? (
          /* Not Graded State */
          <div className="bg-white rounded-[2rem] p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Not Graded Yet</h2>
            <p className="text-slate-500 font-light max-w-md mx-auto">
              Your final results will be available once your lecturer completes the grading process. Please check back later.
            </p>
          </div>
        ) : (
          /* Graded Results */
          <div className="space-y-8">
            
            {/* Final Grade Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-12 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Final Grade</p>
                  <div className={`inline-block px-8 py-4 rounded-2xl text-5xl font-black ${getGradeColor(studentData.finalGrade)} text-white`}>
                    {studentData.finalGrade}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Final Score</p>
                  <p className={`text-6xl font-black ${getScoreColor(studentData.finalScore)}`}>
                    {studentData.finalScore?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Viva Score */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Award size={24} strokeWidth={1.5} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Viva Score</p>
                <p className="text-4xl font-black text-slate-900 mb-1">
                  {studentData.vivaScore?.toFixed(1)}%
                </p>
                <p className="text-slate-400 text-sm font-light">Weight: 40%</p>
              </div>

              {/* Report Mark */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <FileText size={24} strokeWidth={1.5} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Report Mark</p>
                <p className="text-4xl font-black text-slate-900 mb-1">
                  {studentData.reportMark?.toFixed(1)}%
                </p>
                <p className="text-slate-400 text-sm font-light">Weight: 40%</p>
              </div>

              {/* Company Rating */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Building size={24} strokeWidth={1.5} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Company Rating</p>
                <p className="text-4xl font-black text-slate-900 mb-1">
                  {(studentData.companyRating * 20)?.toFixed(1)}%
                </p>
                <p className="text-slate-400 text-sm font-light">Weight: 20%</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xl font-bold text-slate-900">Graded</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Internship</p>
                <p className="text-xl font-bold text-slate-900">Completed</p>
              </div>
            </div>

          </div>
        )}
      </main>
      </div>

      {/* Printable Report */}
      {showReport && (
        <div className="print-only fixed inset-0 bg-white z-50 overflow-auto p-8" style={{ display: 'none' }}>
          <style>{`
            @media print {
              .print-only { display: block !important; }
              body * { visibility: hidden; }
              .print-only, .print-only * { visibility: visible; }
              .print-only { position: absolute; left: 0; top: 0; width: 100%; }
              @page {
                size: A4;
                margin: 2.54cm;
              }
            }
          `}</style>
          
          <div className="max-w-[210mm] mx-auto bg-white" style={{ minHeight: '297mm' }}>
            {/* Report Header */}
            <div className="text-center mb-8 border-b-2 border-black pb-6">
              <h1 className="text-2xl font-bold text-black mb-2">Internship Performance Report</h1>
              <p className="text-sm text-gray-600">Academic Assessment Document</p>
              <p className="text-xs text-gray-500 mt-2">
                Generated on: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Student Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4 border-b border-gray-300 pb-2">Student Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Student Name</p>
                  <p className="text-sm font-medium text-black">{studentData?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Student ID</p>
                  <p className="text-sm font-medium text-black">{studentData?._id?.slice(-8) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-medium text-black">{studentData?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                  <p className="text-sm font-medium text-black">{studentData?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Age</p>
                  <p className="text-sm font-medium text-black">{studentData?.age || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Address</p>
                  <p className="text-sm font-medium text-black">{studentData?.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Internship Details Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4 border-b border-gray-300 pb-2">Internship Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Company Name</p>
                  <p className="text-sm font-medium text-black">{internshipData?.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Position/Role</p>
                  <p className="text-sm font-medium text-black">{internshipData?.position || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Duration</p>
                  <p className="text-sm font-medium text-black">
                    {internshipData?.startDate && internshipData?.endDate 
                      ? `${new Date(internshipData.startDate).toLocaleDateString()} - ${new Date(internshipData.endDate).toLocaleDateString()}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <p className="text-sm font-medium text-black">{studentData?.status || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown Table */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4 border-b border-gray-300 pb-2">Score Breakdown</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-2 border-black bg-gray-100">
                    <th className="border border-black px-4 py-2 text-left font-bold text-black">Component</th>
                    <th className="border border-black px-4 py-2 text-center font-bold text-black">Score</th>
                    <th className="border border-black px-4 py-2 text-center font-bold text-black">Weight</th>
                    <th className="border border-black px-4 py-2 text-center font-bold text-black">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-4 py-2 text-black">Viva Presentation</td>
                    <td className="border border-black px-4 py-2 text-center text-black">{studentData?.vivaScore?.toFixed(1) || 'N/A'}%</td>
                    <td className="border border-black px-4 py-2 text-center text-black">40%</td>
                    <td className="border border-black px-4 py-2 text-center text-black">{((studentData?.vivaScore || 0) * 0.4).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-4 py-2 text-black">Internship Report</td>
                    <td className="border border-black px-4 py-2 text-center text-black">{studentData?.reportMark?.toFixed(1) || 'N/A'}%</td>
                    <td className="border border-black px-4 py-2 text-center text-black">40%</td>
                    <td className="border border-black px-4 py-2 text-center text-black">{((studentData?.reportMark || 0) * 0.4).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-4 py-2 text-black">Company Feedback</td>
                    <td className="border border-black px-4 py-2 text-center text-black">{((studentData?.companyRating || 0) * 20).toFixed(1)}%</td>
                    <td className="border border-black px-4 py-2 text-center text-black">20%</td>
                    <td className="border border-black px-4 py-2 text-center text-black">{((studentData?.companyRating || 0) * 20 * 0.2).toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border-2 border-black px-4 py-2 text-black">Total</td>
                    <td className="border-2 border-black px-4 py-2 text-center text-black">-</td>
                    <td className="border-2 border-black px-4 py-2 text-center text-black">100%</td>
                    <td className="border-2 border-black px-4 py-2 text-center text-black">{studentData?.finalScore?.toFixed(1) || 'N/A'}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Final Grade Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4 border-b border-gray-300 pb-2">Final Assessment</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-2 border-black p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Final Score</p>
                  <p className="text-3xl font-bold text-black">{studentData?.finalScore?.toFixed(1) || 'N/A'}%</p>
                </div>
                <div className="border-2 border-black p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Final Grade</p>
                  <p className="text-3xl font-bold text-black">{studentData?.finalGrade || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Grade Calculation Formula */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4 border-b border-gray-300 pb-2">Grade Calculation</h2>
              <div className="bg-gray-50 p-4 border border-gray-300">
                <p className="text-sm font-semibold text-black mb-2">Formula:</p>
                <p className="text-sm text-black mb-4">
                  Final Score = (Viva Score × 40%) + (Report Mark × 40%) + (Company Rating × 20%)
                </p>
                <p className="text-sm font-semibold text-black mb-2">Calculation:</p>
                <p className="text-sm text-black">
                  ({studentData?.vivaScore?.toFixed(1) || 0} × 0.4) + ({studentData?.reportMark?.toFixed(1) || 0} × 0.4) + ({((studentData?.companyRating || 0) * 20).toFixed(1)} × 0.2) = {studentData?.finalScore?.toFixed(1) || 'N/A'}%
                </p>
              </div>
            </div>

            {/* Grade Range Reference */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-black mb-4 border-b border-gray-300 pb-2">Grade Range Reference</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border border-black bg-gray-100">
                    <th className="border border-black px-4 py-2 text-left font-bold text-black">Grade</th>
                    <th className="border border-black px-4 py-2 text-left font-bold text-black">Score Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-black px-4 py-2 text-black">A</td><td className="border border-black px-4 py-2 text-black">80 - 100</td></tr>
                  <tr><td className="border border-black px-4 py-2 text-black">B</td><td className="border border-black px-4 py-2 text-black">70 - 79</td></tr>
                  <tr><td className="border border-black px-4 py-2 text-black">C</td><td className="border border-black px-4 py-2 text-black">60 - 69</td></tr>
                  <tr><td className="border border-black px-4 py-2 text-black">D</td><td className="border border-black px-4 py-2 text-black">50 - 59</td></tr>
                  <tr><td className="border border-black px-4 py-2 text-black">F</td><td className="border border-black px-4 py-2 text-black">0 - 49</td></tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-300 text-center">
              <p className="text-xs text-gray-500 mb-2">
                This document is an official record of academic performance.
              </p>
              <p className="text-xs text-gray-400">
                Generated by TalentTracer Internship Management System
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalResults;
