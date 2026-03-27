import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form States
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', description: '', techStack: '' });
  
  // Edit State
  const [editingJob, setEditingJob] = useState(null);

  // Applications State
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const [isAppsLoading, setIsAppsLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/jobs/all');
      if (data.success) setJobs(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle Create
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const payload = {
        ...newJob,
        techStack: newJob.techStack.split(',').map(item => item.trim()).filter(Boolean)
      };
      const { data } = await axios.post('http://localhost:4000/api/jobs/create', payload);
      if (data.success) {
        toast.success(data.message);
        setShowCreateForm(false);
        setNewJob({ title: '', company: '', description: '', techStack: '' });
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Update
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const payload = {
        ...editingJob,
        techStack: typeof editingJob.techStack === 'string' 
          ? editingJob.techStack.split(',').map(item => item.trim()).filter(Boolean) 
          : editingJob.techStack
      };
      
      const { data } = await axios.put(`http://localhost:4000/api/jobs/update/${editingJob._id}`, payload);
      if (data.success) {
        toast.success(data.message);
        setEditingJob(null);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this internship? This will also delete all applications associated with it.")) return;
    
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`http://localhost:4000/api/jobs/delete/${jobId}`);
      if (data.success) {
        toast.success(data.message);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewApplications = async (job) => {
    try {
      setIsAppsLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`http://localhost:4000/api/jobs/applications/${job._id}`);
      if (data.success) setSelectedJobApps({ jobTitle: job.title, apps: data.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAppsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Internships</h1>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md"
          >
            {showCreateForm ? 'Cancel' : '+ Post New Internship'}
          </button>
        </div>

        {/* Create Job Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateJob} className="bg-white p-6 rounded-2xl shadow-md mb-8 border-t-4 border-indigo-600">
            <h2 className="text-xl font-bold mb-4">Create New Posting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Job Title</label>
                <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full border p-2.5 rounded-lg" placeholder="e.g. Frontend Developer Intern" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Company Name</label>
                <input type="text" required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full border p-2.5 rounded-lg" placeholder="e.g. TechCorp Solutions" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Tech Stack (comma separated)</label>
              <input type="text" value={newJob.techStack} onChange={e => setNewJob({...newJob, techStack: e.target.value})} className="w-full border p-2.5 rounded-lg" placeholder="e.g. React, Node.js, MongoDB" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Job Description</label>
              <textarea required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full border p-2.5 rounded-lg min-h-[100px]" placeholder="Describe the role..."></textarea>
            </div>
            <button type="submit" className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-green-700 transition">Post Internship</button>
          </form>
        )}

        {/* Active Jobs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col relative group">
              
              {/* Edit and Delete Buttons (Top Right) */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setEditingJob({...job, techStack: job.techStack.join(', ')})} className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded transition">
                  ✏️
                </button>
                <button onClick={() => handleDeleteJob(job._id)} className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded transition">
                  🗑️
                </button>
              </div>

              <div className="flex-grow pr-16">
                <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                <p className="text-indigo-600 font-semibold mb-3">{job.company}</p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.techStack.map((tech, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">{tech}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => viewApplications(job)}
                className="w-full mt-4 bg-slate-800 text-white py-2 rounded-lg font-semibold hover:bg-slate-900 transition"
              >
                View Applicants
              </button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-slate-500 col-span-full">No active job postings.</p>}
        </div>

        {/* Edit Job Modal */}
        {editingJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Edit Internship</h2>
                <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
              </div>
              <form onSubmit={handleUpdateJob}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Job Title</label>
                    <input type="text" required value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} className="w-full border p-2.5 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Company Name</label>
                    <input type="text" required value={editingJob.company} onChange={e => setEditingJob({...editingJob, company: e.target.value})} className="w-full border p-2.5 rounded-lg" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Tech Stack (comma separated)</label>
                  <input type="text" value={editingJob.techStack} onChange={e => setEditingJob({...editingJob, techStack: e.target.value})} className="w-full border p-2.5 rounded-lg" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-1">Job Description</label>
                  <textarea required value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})} className="w-full border p-2.5 rounded-lg min-h-[100px]"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">Save Changes</button>
              </form>
            </div>
          </div>
        )}

        {/* View Applications Modal */}
        {selectedJobApps && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Applicants: {selectedJobApps.jobTitle}</h2>
                <button onClick={() => setSelectedJobApps(null)} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
              </div>
              {isAppsLoading ? <div className="py-8"><LoadingSpinner /></div> : (
                <div className="space-y-4">
                  {selectedJobApps.apps.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No applications received yet.</p>
                  ) : (
                    selectedJobApps.apps.map(app => (
                      <div key={app._id} className="bg-slate-50 border p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{app.studentId?.name}</p>
                          <p className="text-sm text-slate-500">{app.studentId?.email} • {app.studentId?.phone}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {app.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminJobs;