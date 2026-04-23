import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Briefcase, Users, MessageSquare, Plus, Edit, Trash2, Check, X, LogOut, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';
import axios from 'axios';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContent);
  const [activeTab, setActiveTab] = useState('internships');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch internships from database
  const [internships, setInternships] = useState([]);

  // Student requests fetched from database
  const [studentRequests, setStudentRequests] = useState([]);

  // Process students (accepted students with internship status)
  const [processStudents, setProcessStudents] = useState([]);

  // Student details modal state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);

  // Sample data for student feedback
  const [studentFeedback, setStudentFeedback] = useState([]);
  const [feedbackForms, setFeedbackForms] = useState({});

  // New internship form state
  const [newInternship, setNewInternship] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    company: ''
  });

  // Fetch company jobs on mount
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get('http://localhost:4000/api/jobs/company/jobs');
        if (data.success) {
          setInternships(data.data);
        }
      } catch (error) {
        console.error('Error fetching company jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      setNewInternship(prev => ({ ...prev, company: userData.companyName || userData.name }));
      fetchCompanyJobs();
    }
  }, [userData]);

  // Fetch company applications when Requests tab is active
  useEffect(() => {
    const fetchCompanyApplications = async () => {
      if (activeTab === 'requests' && userData) {
        try {
          axios.defaults.withCredentials = true;
          const { data } = await axios.get('http://localhost:4000/api/jobs/company/applications');
          if (data.success) {
            const formattedApplications = data.data.map(app => ({
              _id: app._id,
              studentName: app.studentId?.name || 'Unknown',
              email: app.studentId?.email || '',
              internship: app.jobId?.title || 'Unknown Position',
              status: app.status,
              appliedDate: new Date(app.createdAt).toLocaleDateString()
            }));
            setStudentRequests(formattedApplications);
          }
        } catch (error) {
          console.error('Error fetching company applications:', error);
        }
      }
    };

    const fetchProcessStudents = async () => {
      if (activeTab === 'process' && userData) {
        try {
          axios.defaults.withCredentials = true;
          const { data } = await axios.get('http://localhost:4000/api/jobs/company/applications');
          if (data.success) {
            const acceptedStudents = data.data.filter(app => app.status === 'Accepted');
            const formattedStudents = acceptedStudents.map(app => ({
              _id: app._id,
              studentName: app.studentId?.name || 'Unknown',
              email: app.studentId?.email || '',
              internship: app.jobId?.title || 'Unknown Position',
              internshipStatus: app.internshipStatus || 'ongoing'
            }));
            setProcessStudents(formattedStudents);
          }
        } catch (error) {
          console.error('Error fetching process students:', error);
        }
      }
    };

    const fetchCompletedStudents = async () => {
      if (activeTab === 'feedback' && userData) {
        try {
          axios.defaults.withCredentials = true;
          const { data } = await axios.get('http://localhost:4000/api/jobs/company/applications');
          if (data.success) {
            const completedStudents = data.data.filter(app => app.internshipStatus === 'completed');
            const formattedStudents = completedStudents.map(app => ({
              _id: app._id,
              studentName: app.studentId?.name || 'Unknown',
              email: app.studentId?.email || '',
              internship: app.jobId?.title || 'Unknown Position'
            }));
            setStudentFeedback(formattedStudents);
          }
        } catch (error) {
          console.error('Error fetching completed students:', error);
        }
      }
    };

    fetchCompanyApplications();
    fetchProcessStudents();
    fetchCompletedStudents();
  }, [activeTab, userData]);

  const handleAddInternship = async () => {
    if (!newInternship.title || !newInternship.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const payload = {
        title: newInternship.title,
        company: newInternship.company,
        description: newInternship.description,
        location: newInternship.location,
        type: newInternship.type,
        techStack: []
      };

      const { data } = await axios.post('http://localhost:4000/api/jobs/company/create', payload);

      if (data.success) {
        setInternships([...internships, data.data]);
        setNewInternship({ title: '', description: '', location: '', type: 'Full-time', company: userData.companyName || userData.name });
        setShowAddModal(false);
        toast.success('Internship posted successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post internship');
    }
  };

  const handleDeleteInternship = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`http://localhost:4000/api/jobs/company/delete/${id}`);

      if (data.success) {
        setInternships(internships.filter(internship => internship._id !== id));
        toast.success('Internship deleted successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete internship');
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/jobs/company/application/${id}`, { status: 'Accepted' });

      if (data.success) {
        setStudentRequests(studentRequests.map(req =>
          req._id === id ? { ...req, status: 'Accepted' } : req
        ));
        toast.success('Request accepted');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/jobs/company/application/${id}`, { status: 'Rejected' });

      if (data.success) {
        setStudentRequests(studentRequests.filter(req => req._id !== id));
        toast.success('Request rejected');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleUpdateInternshipStatus = async (applicationId, internshipStatus) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/jobs/company/internship-status/${applicationId}`, { internshipStatus });

      if (data.success) {
        setProcessStudents(processStudents.map(student =>
          student._id === applicationId ? { ...student, internshipStatus } : student
        ));
        toast.success(`Internship status updated to ${internshipStatus}`);
        
        // If completed, refresh feedback section
        if (internshipStatus === 'completed') {
          // This will be handled when we update the feedback section
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update internship status');
    }
  };

  const handleViewStudent = async (studentId) => {
    try {
      setIsLoadingStudent(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`http://localhost:4000/api/readiness/student-details/${studentId}`);

      if (data.success) {
        setSelectedStudent(data.data);
        setShowStudentModal(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch student details');
    } finally {
      setIsLoadingStudent(false);
    }
  };

  const handleSubmitFeedback = async (applicationId) => {
    const { feedback, rating } = feedbackForms[applicationId] || {};
    
    if (!feedback || !rating) {
      toast.error('Please provide both feedback and rating');
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/feedback/submit', {
        applicationId,
        feedback,
        rating: parseInt(rating)
      });

      if (data.success) {
        toast.success('Feedback submitted successfully');
        // Remove the student from feedback list after submission
        setStudentFeedback(studentFeedback.filter(s => s._id !== applicationId));
        setFeedbackForms(prev => {
          const newForms = { ...prev };
          delete newForms[applicationId];
          return newForms;
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const handleSaveFeedback = (studentId, feedback) => {
    setStudentFeedback(studentFeedback.map(student =>
      student.id === studentId ? { ...student, feedback } : student
    ));
    toast.success('Feedback saved');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FEF9C3] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Building size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">TalentTracer</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mt-1">Company Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-rose-600 font-bold text-xs uppercase tracking-widest transition-all"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Tabs - Modern Minimalist Style */}
        <div className="flex flex-wrap gap-2 mb-12 bg-white/50 p-1.5 rounded-2xl w-fit border border-indigo-50/50 backdrop-blur-sm">
          {[
            { id: 'internships', label: 'Internships', icon: Briefcase },
            { id: 'requests', label: 'Requests', icon: Users },
            { id: 'process', label: 'Process', icon: Clock },
            { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.05)] border border-indigo-50 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
          
          <div className="relative">
            {activeTab === 'internships' && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Active Opportunities</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your posted internship positions.</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all shrink-0"
                  >
                    <Plus size={18} strokeWidth={3} />
                    Create New
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading internships...</p>
                  </div>
                ) : internships.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                      <Briefcase size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active internships</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {internships.map((internship) => (
                      <div key={internship._id} className="group bg-white border border-indigo-50 p-8 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Briefcase size={24} strokeWidth={2} />
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteInternship(internship._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{internship.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{internship.description}</p>
                        <div className="flex flex-wrap gap-3 mt-auto">
                          <span className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Building size={12} /> {internship.location}
                          </span>
                          <span className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                            {internship.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'requests' && (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">Student Applications</h2>
                  <p className="text-slate-500 font-medium mt-1">Review and process incoming internship requests.</p>
                </div>

                {studentRequests.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                      <Users size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentRequests.map((request) => (
                      <div key={request._id} className="bg-white border border-indigo-50 p-8 rounded-[2rem] hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer" onClick={() => handleViewStudent(request.studentId)}>
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl">
                            {request.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 leading-none mb-2">{request.studentName}</h3>
                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">{request.internship}</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{request.appliedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          {request.status === 'Applied' ? (
                            <>
                              <button
                                onClick={() => handleRejectRequest(request._id)}
                                className="px-6 py-3 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 font-black text-xs uppercase tracking-widest transition-all"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleAcceptRequest(request._id)}
                                className="px-6 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all font-black text-xs uppercase tracking-widest"
                              >
                                Accept
                              </button>
                            </>
                          ) : (
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                              request.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {request.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'process' && (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">Internship Progress</h2>
                  <p className="text-slate-500 font-medium mt-1">Track and manage the progress of accepted students.</p>
                </div>

                {processStudents.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                      <Clock size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No students in progress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {processStudents.map((student) => (
                      <div key={student._id} className="bg-white border border-indigo-50 p-8 rounded-[2rem] hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-black text-xl">
                            {student.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 leading-none mb-2">{student.studentName}</h3>
                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">{student.internship}</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={student.internshipStatus}
                            onChange={(e) => handleUpdateInternshipStatus(student._id, e.target.value)}
                            className="px-6 py-3 rounded-xl border border-indigo-100 bg-white text-slate-900 font-black text-xs uppercase tracking-widest focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
                          >
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'feedback' && (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">Talent Evaluation</h2>
                  <p className="text-slate-500 font-medium mt-1">Provide feedback for students who completed their internship.</p>
                </div>

                {studentFeedback.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No feedback pending</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {studentFeedback.map((student) => (
                      <div key={student._id} className="bg-white border border-indigo-50 p-10 rounded-[2.5rem] hover:shadow-xl transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8 pb-8 border-b border-indigo-50">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-slate-900 mb-1">{student.studentName}</h3>
                              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                Role: <span className="text-indigo-600">{student.internship}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                              Completed
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block">Rating (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={feedbackForms[student._id]?.rating || ''}
                            onChange={(e) => setFeedbackForms(prev => ({
                              ...prev,
                              [student._id]: { ...prev[student._id], rating: e.target.value }
                            }))}
                            placeholder="Rate from 1 to 5"
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all text-slate-700 font-medium placeholder:text-slate-300 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                          />
                          <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block">Evaluation Summary</label>
                          <textarea
                            value={feedbackForms[student._id]?.feedback || ''}
                            onChange={(e) => setFeedbackForms(prev => ({
                              ...prev,
                              [student._id]: { ...prev[student._id], feedback: e.target.value }
                            }))}
                            placeholder="Describe the student's performance, strengths, and areas for growth..."
                            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-0 transition-all min-h-[160px] text-slate-700 font-medium placeholder:text-slate-300 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSubmitFeedback(student._id)}
                              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                            >
                              Submit Evaluation
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Internship Modal - Redesigned */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg border border-indigo-50 animate-in fade-in zoom-in duration-300">
            <div className="mb-8">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">New Role</h3>
              <p className="text-slate-500 font-medium mt-1 text-sm uppercase tracking-widest">Opportunity details</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Title *</label>
                <input
                  type="text"
                  value={newInternship.title}
                  onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all"
                  placeholder="e.g., Software Engineer Intern"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Description *</label>
                <textarea
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all min-h-[120px]"
                  placeholder="Summarize the responsibilities and requirements..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Location</label>
                  <input
                    type="text"
                    value={newInternship.location}
                    onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all"
                    placeholder="Remote/Office"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Type</label>
                  <select
                    value={newInternship.type}
                    onChange={(e) => setNewInternship({ ...newInternship, type: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all appearance-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10 pt-8 border-t border-slate-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-4 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInternship}
                className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
              >
                Publish Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900">Student Details</h2>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {isLoadingStudent ? (
                <div className="text-center py-10 text-slate-500">Loading student details...</div>
              ) : selectedStudent ? (
                <div className="space-y-6">
                  {/* Personal Details */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.studentId?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.studentId?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Age</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.studentId?.age || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">CV Link</p>
                        {selectedStudent.cvUrl ? (
                          <a
                            href={selectedStudent.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-bold text-indigo-600 hover:text-indigo-800 underline"
                          >
                            View CV
                          </a>
                        ) : (
                          <p className="text-lg font-bold text-slate-400">Not provided</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">Academic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Year</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.year ? `Year ${selectedStudent.year}` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Semester</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.semester ? `Semester ${selectedStudent.semester}` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Current GPA</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.currentGpa || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Academic Performance</p>
                        <p className="text-lg font-bold text-slate-900">{selectedStudent.academicPerformance || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {selectedStudent.otherSkills && selectedStudent.otherSkills.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-6">
                      <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.otherSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {selectedStudent.academicAchievements && selectedStudent.academicAchievements.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-6">
                      <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">Academic Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.academicAchievements.map((achievement, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">No student details available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
