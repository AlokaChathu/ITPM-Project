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
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentNavigation from '../components/StudentNavigation';
import StudentBg from '../assets/Student BG.jpg';

function FinalResults() {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

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
    </div>
  );
}

export default FinalResults;
