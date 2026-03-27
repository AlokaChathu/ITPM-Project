import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar2 from '../components/Navbar2';

function StudentJobs() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      axios.defaults.withCredentials = true;
      
      // 1. Fetch active jobs
      const jobsRes = await axios.get('http://localhost:4000/api/jobs/all');
      if (jobsRes.data.success) setJobs(jobsRes.data.data);

      // 2. Fetch student's readiness status to see if they can apply
      const readinessRes = await axios.get('http://localhost:4000/api/readiness/my-status');
      if (readinessRes.data.success && readinessRes.data.data.isEligible) {
        setIsEligible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchData();
  }, [userData]);

  const handleApply = async (jobId) => {
    if (!isEligible) {
      return toast.error("You must be approved by an Admin in the Readiness Module before applying.");
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/jobs/apply', { jobId });
      
      if (data.success) {
        toast.success("Successfully applied!");
      } else {
        toast.info(data.message); // Will show "Already applied" message
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!userData || isLoading) return <div className='min-h-screen flex justify-center items-center bg-slate-50'>Page is Loading...</div>;

  return (
    <div className='min-h-screen p-8'>
      <Navbar2 />
      <div className='max-w-[1050px] mx-auto my-10'>
        <button 
          onClick={() => navigate('/customer-home')}
          className='mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 transition'
        >
          ← Back to Dashboard
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className='text-3xl font-bold text-slate-800'>Internship Job Board</h1>
            <p className='text-slate-600 mt-2'>Browse and apply for active internship opportunities.</p>
          </div>
          
          {/* Eligibility Badge */}
          <div className={`px-4 py-2 rounded-lg font-bold shadow-sm ${
            isEligible ? 'bg-blue-700/60 text-white border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
          }`}>
            {isEligible ? 'You are Eligible to Apply' : ' Pending Eligibility'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-indigo-400 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                <p className="text-indigo-600 font-semibold mb-3">{job.company}</p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.techStack.map((tech, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2 py-1 rounded font-medium">{tech}</span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleApply(job._id)}
                className={`w-full py-2.5 rounded-lg font-bold transition ${
                  isEligible 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-700 shadow-md cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isEligible ? 'Apply Now' : 'Locked'}
              </button>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="col-span-full bg-white p-10 rounded-2xl shadow-sm text-center">
              <p className="text-xl text-slate-500">No internships available at the moment. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentJobs;