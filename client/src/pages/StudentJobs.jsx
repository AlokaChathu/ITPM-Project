import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentNavigation from '../components/StudentNavigation';

function StudentJobs() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myApplications, setMyApplications] = useState([]);
  const [previousStatuses, setPreviousStatuses] = useState({});

  const fetchData = async () => {
    try {
      axios.defaults.withCredentials = true;
      
      // Fetch active jobs
      const jobsRes = await axios.get('http://localhost:4000/api/jobs/all');
      if (jobsRes.data.success) setJobs(jobsRes.data.data);

      // Fetch student applications
      const appsRes = await axios.get('http://localhost:4000/api/jobs/my-applications');
      if (appsRes.data.success) {
        const newApplications = appsRes.data.data;
        
        // Check for status changes and show notifications
        newApplications.forEach(app => {
          const jobId = app.jobId._id;
          const previousStatus = previousStatuses[jobId];
          
          if (previousStatus && previousStatus !== app.status) {
            const jobTitle = app.jobId.title;
            if (app.status === 'Accepted') {
              toast.success(`Congratulations! Your application for ${jobTitle} has been Accepted!`);
            } else if (app.status === 'Rejected') {
              toast.error(`Your application for ${jobTitle} has been Rejected.`);
            } else if (app.status === 'Interviewing') {
              toast.info(`Your application for ${jobTitle} is now in the Interviewing stage.`);
            }
          }
          
          // Update previous statuses
          setPreviousStatuses(prev => ({
            ...prev,
            [jobId]: app.status
          }));
        });

        setMyApplications(newApplications);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchData();
      // Poll every 10 seconds for status updates
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [userData]);

  const handleApply = async (jobId) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/jobs/apply', { jobId });
      
      if (data.success) {
        toast.success("Successfully applied!");
        fetchData(); // Refresh to show applied status
      } else {
        toast.info(data.message); // Will show "Already applied" message
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getApplicationStatus = (jobId) => {
    const app = myApplications.find(a => a.jobId._id === jobId);
    return app ? app.status : null;
  };

  const getStatusBadge = (status) => {
    const styles = {
      Applied: 'bg-blue-100 text-blue-700 border-blue-200',
      Interviewing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Rejected: 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return styles[status] || '';
  };

  const getButtonText = (status) => {
    const texts = {
      Applied: 'Applied',
      Interviewing: 'Interviewing',
      Accepted: 'Accepted ✓',
      Rejected: 'Rejected'
    };
    return texts[status] || 'Apply Now';
  };

  const getButtonStyle = (status) => {
    if (!status) return 'bg-indigo-500 text-white hover:bg-indigo-700';
    if (status === 'Accepted') return 'bg-emerald-500 text-white cursor-default';
    if (status === 'Rejected') return 'bg-rose-500 text-white cursor-default';
    return 'bg-slate-400 text-white cursor-default';
  };

  if (!userData || isLoading) return <div className='min-h-screen flex justify-center items-center bg-slate-50'>Page is Loading...</div>;

  return (
    <div className='min-h-screen bg-slate-50'>
      <StudentNavigation />
      <div className='max-w-[1050px] mx-auto px-6 py-12'>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => {
            const status = getApplicationStatus(job._id);
            return (
              <div key={job._id} className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-indigo-400 flex flex-col hover:-translate-y-1 transition-transform relative">
                {status && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(status)}`}>
                    {status}
                  </div>
                )}
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
                  onClick={() => !status && handleApply(job._id)}
                  disabled={!!status}
                  className={`w-full py-2.5 rounded-lg font-bold transition shadow-md ${getButtonStyle(status)}`}
                >
                  {getButtonText(status)}
                </button>
              </div>
            );
          })}
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