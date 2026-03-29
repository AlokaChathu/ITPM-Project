import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBarAdmin from '../components/NavbarAdmin';

function AdminReadiness() {
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the evaluation form modal
  const [selectedEval, setSelectedEval] = useState(null);
  const [formData, setFormData] = useState({
    skillGaps: '',
    suggestedCourses: '',
    interviewNotes: '',
    status: 'Pending',
    isEligible: false
  });

  // Fetch all students' readiness data
  const fetchEvaluations = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/readiness/all');

      if (data.success) {
        setEvaluations(data.data);
      } else {
        toast.error(data.message);
        console.log("Backend Error Message:", data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Axios Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  // Open the evaluation modal and pre-fill existing data
  const handleEditClick = (evaluation) => {
    setSelectedEval(evaluation);
    setFormData({
      skillGaps: evaluation.skillGaps.join(', '),
      suggestedCourses: evaluation.suggestedCourses.join(', '),
      interviewNotes: evaluation.interviewNotes || '',
      status: evaluation.status || 'Pending',
      isEligible: evaluation.isEligible || false
    });
  };

  // Submit the admin's evaluation
  const handleEvaluateSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDATION START ---

    // 1. Logical Contradiction Check
    if (formData.isEligible && formData.status === 'Pending') {
      return toast.error("A student cannot be 'Eligible' while the status is 'Pending'. Please change the status to 'Ready'.");
    }
    if (!formData.isEligible && formData.status === 'Ready') {
      return toast.warning("Warning: You marked the status as 'Ready' but didn't approve eligibility. Make sure this is intentional.");
    }

    // 2. Meaningful Notes Length Check
    const trimmedNotes = formData.interviewNotes.trim();
    if (trimmedNotes.length > 0 && trimmedNotes.length < 10) {
      return toast.error("Interview notes are too short. Please provide meaningful feedback or leave it blank.");
    }
    if (trimmedNotes.length > 1000) {
      return toast.error("Interview notes are too long (Max 1000 characters).");
    }

    // 3. Parse the arrays
    const parsedGaps = formData.skillGaps.split(',').map(item => item.trim()).filter(Boolean);
    const parsedCourses = formData.suggestedCourses.split(',').map(item => item.trim()).filter(Boolean);

    // 4. "Forgot the Comma" Check (Prevents saving massive single strings)
    if (parsedGaps.some(item => item.length > 35)) {
      return toast.error("One of your Skill Gaps is very long. Did you forget to separate them with commas?");
    }
    if (parsedCourses.some(item => item.length > 50)) {
      return toast.error("One of your Suggested Courses is very long. Did you forget to separate them with commas?");
    }

    // --- VALIDATION END ---

    try {
      setIsLoading(true);

      const payload = {
        ...formData,
        interviewNotes: trimmedNotes,
        skillGaps: parsedGaps,
        suggestedCourses: parsedCourses,
      };

      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/readiness/evaluate/${selectedEval.studentId._id}`, payload);

      if (data.success) {
        toast.success("Student evaluated successfully!");
        setSelectedEval(null); // Close modal
        fetchEvaluations(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen e to-indigo-50 pb-12 ">
      <NavBarAdmin />

      <div className="max-w-7xl mx-auto px-4 lg:px-28 py-10">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Internship Readiness
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Review student submissions, provide feedback, and approve internship eligibility.
          </p>
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-5">Student Details</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Eligibility</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluations.map((val) => (
                  <tr key={val._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{val.studentId?.name || 'Unknown Student'}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{val.studentId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${val.status === 'Ready'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : val.status === 'In Review'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${val.status === 'Ready' ? 'bg-emerald-500' : val.status === 'In Review' ? 'bg-blue-500' : 'bg-amber-500'
                          }`}></span>
                        {val.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {val.isEligible ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditClick(val)}
                        className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border border-indigo-100 hover:border-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))}
                {evaluations.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-slate-900">No submissions yet</p>
                        <p className="text-sm mt-1">Students haven't submitted their readiness details.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluation Modal Form */}
        {selectedEval && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl ring-1 ring-slate-900/5 flex flex-col">

              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Evaluate <span className="text-indigo-600">{selectedEval.studentId?.name}</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Review documents and provide constructive feedback.</p>
                </div>
                <button
                  onClick={() => setSelectedEval(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8">
                {/* Read-only Student Data Card */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Performance</p>
                    <p className="text-lg font-bold text-slate-800">{selectedEval.academicPerformance || 'Not provided'}</p>
                  </div>
                  <a
                    href={selectedEval.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Attached CV
                  </a>
                </div>

                {/* Admin Input Form */}
                <form onSubmit={handleEvaluateSubmit} className="space-y-6">

                  {/* Skill Gaps */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Identified Skill Gaps</label>
                    <input
                      type="text"
                      value={formData.skillGaps}
                      onChange={(e) => setFormData({ ...formData, skillGaps: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                      placeholder="e.g. React Hooks, REST API Design (comma separated)"
                    />
                  </div>

                  {/* Suggested Courses */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Suggested Action Plan / Courses</label>
                    <input
                      type="text"
                      value={formData.suggestedCourses}
                      onChange={(e) => setFormData({ ...formData, suggestedCourses: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                      placeholder="e.g. Complete Advanced JS Course on Coursera"
                    />
                  </div>

                  {/* Interview Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Mock Interview Feedback</label>
                    <textarea
                      value={formData.interviewNotes}
                      onChange={(e) => setFormData({ ...formData, interviewNotes: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 min-h-[120px] resize-y"
                      placeholder="Document communication skills, technical proficiency, etc."
                    ></textarea>
                  </div>

                  {/* Status & Eligibility Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Progress Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Ready">Ready</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className={`flex items-center justify-between gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors shadow-sm ${formData.isEligible ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}>
                        <div>
                          <p className={`font-bold text-sm ${formData.isEligible ? 'text-emerald-800' : 'text-slate-700'}`}>Approve Eligibility</p>
                          <p className={`text-xs mt-0.5 ${formData.isEligible ? 'text-emerald-600' : 'text-slate-500'}`}>Allows job applications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.isEligible}
                          onChange={(e) => setFormData({ ...formData, isEligible: e.target.checked })}
                          className="w-5 h-5 accent-emerald-600 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 transition-all"
                    >
                      Save Evaluation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReadiness;