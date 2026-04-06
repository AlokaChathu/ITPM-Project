import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';
import Logo from '../assets/TalenTracerLogo2.png';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  LogOut, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

function CompanyDashboard() {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('postings');
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper for the avatar
  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Fetch internships
  const fetchInternships = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:4000/api/jobs', {
        withCredentials: true
      });
      if (response.data.success) {
        setInternships(response.data.data.filter(job => job.company === userData.companyName));
      }
    } catch (error) {
      toast.error('Failed to fetch internships');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:4000/api/applications/company', {
        withCredentials: true
      });
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  // Accept application
  const acceptApplication = async (applicationId) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/applications/${applicationId}/accept`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Application accepted successfully!');
        fetchApplications();
      }
    } catch (error) {
      toast.error('Failed to accept application');
    }
  };

  // Reject application
  const rejectApplication = async (applicationId) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/applications/${applicationId}/reject`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Application rejected');
        fetchApplications();
      }
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post('http://localhost:4000/api/auth/logout', {}, {
        withCredentials: true
      });
      setUserData(null);
      setIsLoggedin(false);
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Navigation items
  const navigationItems = [
    {
      id: 'postings',
      label: 'Manage Internship Postings',
      icon: Briefcase,
      path: '/company-home'
    },
    {
      id: 'applications',
      label: 'Accept Internship Requests',
      icon: Users,
      path: '/company-home'
    }
  ];

  // Load data based on active tab
  React.useEffect(() => {
    if (activeTab === 'postings') {
      fetchInternships();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  if (isLoggingOut) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={Logo}
                alt="TalentTracer"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{userData?.companyName || 'Company'}</p>
                  <p className="text-xs text-slate-500">Company Account</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {getInitials(userData?.companyName)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <button
                onClick={() => navigate('/my-profile')}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <Settings size={18} className="mr-3" />
                Settings
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'postings' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Manage Internship Postings</h1>
                <p className="text-slate-600">Create and manage your internship opportunities</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Your Internship Postings</h2>
                  <button
                    onClick={() => navigate('/company/post-internship')}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Post New Internship
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : internships.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No internship postings yet</h3>
                    <p className="text-slate-600 mb-4">Start by posting your first internship opportunity</p>
                    <button
                      onClick={() => navigate('/company/post-internship')}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Post Your First Internship
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {internships.map((internship) => (
                      <div key={internship._id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">{internship.title}</h3>
                            <p className="text-sm text-slate-600 mb-2">{internship.company}</p>
                            <p className="text-sm text-slate-700 line-clamp-2">{internship.description}</p>
                            {internship.techStack && internship.techStack.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {internship.techStack.map((tech, index) => (
                                  <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="p-2 text-slate-600 hover:text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Accept Internship Requests</h1>
                <p className="text-slate-600">Review and manage applications to your internships</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                    <p className="text-slate-600">Applications to your internships will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application._id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">{application.studentName}</h3>
                              <span className={`ml-2 px-2 py-1 text-xs rounded ${
                                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">Applied for: {application.internshipTitle}</p>
                            <p className="text-sm text-slate-700 mb-2">{application.coverLetter}</p>
                            <p className="text-xs text-slate-500">Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {application.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => acceptApplication(application._id)}
                                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => rejectApplication(application._id)}
                                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                >
                                  <XCircle size={14} className="mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            {application.status === 'accepted' && (
                              <span className="flex items-center text-green-600 text-sm">
                                <CheckCircle size={14} className="mr-1" />
                                Accepted
                              </span>
                            )}
                            {application.status === 'rejected' && (
                              <span className="flex items-center text-red-600 text-sm">
                                <XCircle size={14} className="mr-1" />
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CompanyDashboard;
