import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function StudentReadiness() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  
  // Readiness State
  const [readinessData, setReadinessData] = useState(null);
  const [isFetchingReadiness, setIsFetchingReadiness] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [cvUrl, setCvUrl] = useState('');
  const [academicPerformance, setAcademicPerformance] = useState('');

  // Fetch the student's evaluation status
  const fetchMyReadiness = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/readiness/my-status');
      
      if (data.success) {
        setReadinessData(data.data);
        setCvUrl(data.data.cvUrl || '');
        setAcademicPerformance(data.data.academicPerformance || '');
      } else {
        setReadinessData(null);
      }
    } catch (error) {
      console.error("Error fetching readiness:", error);
    } finally {
      setIsFetchingReadiness(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchMyReadiness();
    }
  }, [userData]);

  // Handle CV Submission
  const handleSubmitReadiness = async (e) => {
    e.preventDefault();
    if (!cvUrl) {
      return toast.error("Please provide a CV link.");
    }

    try {
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;
      
      // ✅ Added studentId and userId from Context exactly as requested
      const payload = {
        cvUrl,
        academicPerformance,
        studentId: userData.id, 
        userId: userData.id
      };

      const { data } = await axios.post('http://localhost:4000/api/readiness/submit', payload);

      if (data.success) {
        toast.success(data.message);
        fetchMyReadiness(); // Refresh data to show "In Review" status
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
      <div className='max-w-3xl mx-auto'>
        <button 
          onClick={() => navigate('/customer-home')}
          className='mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 transition'
        >
          ← Back to Dashboard
        </button>

        <div className='bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-600'>
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-slate-800 mb-2'>Internship Readiness</h1>
              <p className='text-slate-500 text-sm'>Submit your details to be evaluated for internship eligibility.</p>
            </div>
            {readinessData && (
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                readinessData.status === 'Ready' ? 'bg-green-100 text-green-700' : 
                readinessData.status === 'In Review' ? 'bg-blue-100 text-blue-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {readinessData.status}
              </span>
            )}
          </div>

          {isFetchingReadiness ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : (
            <>
              {/* Submission Form */}
              <form onSubmit={handleSubmitReadiness} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">CV / Portfolio Link *</label>
                  <input 
                    type="url" 
                    value={cvUrl} 
                    onChange={(e) => setCvUrl(e.target.value)} 
                    placeholder="https://drive.google.com/..." 
                    className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Academic Performance summary</label>
                  <input 
                    type="text" 
                    value={academicPerformance} 
                    onChange={(e) => setAcademicPerformance(e.target.value)} 
                    placeholder="e.g., CGPA: 3.5, Expected Graduation: 2025" 
                    className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition bg-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 shadow-md cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : readinessData ? 'Update Submission' : 'Submit for Review'}
                </button>
              </form>

              {/* Admin Feedback Section */}
              {readinessData && (readinessData.skillGaps.length > 0 || readinessData.interviewNotes) && (
                <div className="mt-8 space-y-6">
                  <h4 className="text-xl font-bold text-slate-800 border-b pb-2">Evaluation Feedback</h4>
                  
                  {readinessData.skillGaps.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-2">Identified Skill Gaps:</p>
                      <div className="flex flex-wrap gap-2">
                        {readinessData.skillGaps.map((gap, i) => (
                          <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-medium border border-red-100">{gap}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {readinessData.suggestedCourses.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-2">Suggested Action Plan / Courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {readinessData.suggestedCourses.map((course, i) => (
                          <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium border border-blue-100">{course}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {readinessData.interviewNotes && (
                    <div>
                      <p className="text-sm font-semibold text-slate-600 mb-2">Interview Notes:</p>
                      <div className="bg-slate-50 p-4 rounded-lg border text-sm text-slate-700 italic shadow-inner">
                        "{readinessData.interviewNotes}"
                      </div>
                    </div>
                  )}

                  <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                    readinessData.isEligible ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className="font-bold text-slate-800">Internship Eligibility</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {readinessData.isEligible 
                          ? "Congratulations! You are approved to proceed to the internship phase." 
                          : "You must complete the suggested actions above to gain eligibility."}
                      </p>
                    </div>
                    <div className="text-4xl">
                      {readinessData.isEligible ? '🎉' : '⏳'}
                    </div>
                  </div>

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentReadiness;