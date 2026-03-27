import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

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
    try {
      setIsLoading(true);
      
      // Convert comma-separated strings back to arrays
      const payload = {
        ...formData,
        skillGaps: formData.skillGaps.split(',').map(item => item.trim()).filter(Boolean),
        suggestedCourses: formData.suggestedCourses.split(',').map(item => item.trim()).filter(Boolean),
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Internship Readiness Evaluations</h1>

        {/* List of Students */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-4">Student Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Eligible?</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((val) => (
                <tr key={val._id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{val.studentId?.name || 'Unknown'}</td>
                  <td className="p-4 text-slate-500">{val.studentId?.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      val.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {val.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {val.isEligible ? '✅ Yes' : '❌ No'}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleEditClick(val)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}
              {evaluations.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No student submissions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Evaluation Modal Form */}
        {selectedEval && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Evaluate {selectedEval.studentId?.name}</h2>
                <button onClick={() => setSelectedEval(null)} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
              </div>

              {/* Read-only Student Data */}
              <div className="bg-slate-100 p-4 rounded-lg mb-6 text-sm">
                <p><strong>CV Link:</strong> <a href={selectedEval.cvUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">View CV</a></p>
                <p className="mt-2"><strong>Academic Performance:</strong> {selectedEval.academicPerformance}</p>
              </div>

              {/* Admin Input Form */}
              <form onSubmit={handleEvaluateSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Skill Gaps (comma separated)</label>
                  <input type="text" value={formData.skillGaps} onChange={(e) => setFormData({...formData, skillGaps: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:border-indigo-500" placeholder="e.g. React Hooks, API Design" />
                </div>
                
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Suggested Certifications/Courses (comma separated)</label>
                  <input type="text" value={formData.suggestedCourses} onChange={(e) => setFormData({...formData, suggestedCourses: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Advanced JavaScript Course" />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mock Interview Notes</label>
                  <textarea value={formData.interviewNotes} onChange={(e) => setFormData({...formData, interviewNotes: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:border-indigo-500 min-h-[100px]" placeholder="Enter interview feedback here..."></textarea>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-medium text-slate-700 mb-1">Progress Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border rounded-lg p-2.5 outline-none focus:border-indigo-500">
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Ready">Ready</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 border rounded-lg hover:bg-slate-50">
                      <input type="checkbox" checked={formData.isEligible} onChange={(e) => setFormData({...formData, isEligible: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                      <span className="font-medium text-slate-700">Approve Internship Eligibility</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition mt-4">
                  Save Evaluation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReadiness;