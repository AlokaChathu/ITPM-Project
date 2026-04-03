import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, BookOpen, Calendar, Award, 
  Clock, Edit, Trash2, Plus, Search, Filter,
  ChevronRight, CheckCircle, XCircle, AlertCircle,
  FileText, Building, Star, TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function LectureDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [lecturerData, setLecturerData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [vivaSchedules, setVivaSchedules] = useState([]);
  const [internshipReports, setInternshipReports] = useState([]);
  const [companyFeedbacks, setCompanyFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  // Color scheme: 60% Primary (Blue), 30% Secondary (Teal), 10% Accent (Orange)
  const colors = {
    primary: '#1e40af',      // Blue-800
    primaryLight: '#3b82f6',  // Blue-500
    secondary: '#0f766e',     // Teal-700
    secondaryLight: '#14b8a6', // Teal-500
    accent: '#f97316',        // Orange-500
    accentLight: '#fb923c',   // Orange-400
    background: '#f8fafc',    // Slate-50
    cardBg: '#ffffff',        // White
    text: '#1e293b',         // Slate-800
    textLight: '#64748b'      // Slate-500
  };

  useEffect(() => {
    fetchLecturerData();
    fetchDashboardData();
  }, []);

  const fetchLecturerData = async () => {
    try {
      console.log('Fetching lecturer data...');
      const res = await axios.get('http://localhost:4000/api/admin/verify', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Response:', res.data);
      if (res.data.success) {
        setLecturerData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching lecturer data:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const fetchDashboardData = async () => {
    // Mock data - replace with actual API calls
    setStudents([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', status: 'Active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-123-4567', status: 'Pending' }
    ]);
    
    setVivaSchedules([
      { id: 1, studentId: 1, studentName: 'John Doe', date: '2025-04-05', time: '10:00 AM', status: 'Scheduled' },
      { id: 2, studentId: 2, studentName: 'Jane Smith', date: '2025-04-06', time: '2:00 PM', status: 'Completed' }
    ]);
    
    setInternshipReports([
      { id: 1, studentId: 1, studentName: 'John Doe', title: 'Web Development Internship', submittedDate: '2025-04-01', status: 'Pending Review' },
      { id: 2, studentId: 2, studentName: 'Jane Smith', title: 'Mobile App Development', submittedDate: '2025-04-02', status: 'Approved' }
    ]);
    
    setCompanyFeedbacks([
      { id: 1, studentId: 1, studentName: 'John Doe', company: 'Tech Corp', rating: 4.5, feedback: 'Excellent performance', date: '2025-04-01' },
      { id: 2, studentId: 2, studentName: 'Jane Smith', company: 'Digital Solutions', rating: 4.8, feedback: 'Outstanding work', date: '2025-04-02' }
    ]);
  };

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await axios.get(`http://localhost:4000/api/admin/logout`, {
        withCredentials: true
      });
      navigate("/admin/login");
      toast.success("Logout Successful");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleViva = (student) => {
    setSelectedStudent(student);
    setShowScheduleModal(true);
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this viva schedule?')) {
      setVivaSchedules(vivaSchedules.filter(s => s.id !== scheduleId));
      toast.success('Viva schedule deleted successfully');
    }
  };

  const handleEditSchedule = (schedule) => {
    // Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <Users size={32} />
          <span className="text-3xl font-bold">{students.length}</span>
        </div>
        <h3 className="text-lg font-semibold">Total Students</h3>
        <p className="text-blue-100 text-sm">Active interns</p>
      </div>

      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <Calendar size={32} />
          <span className="text-3xl font-bold">{vivaSchedules.length}</span>
        </div>
        <h3 className="text-lg font-semibold">Viva Schedules</h3>
        <p className="text-teal-100 text-sm">Pending & completed</p>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <FileText size={32} />
          <span className="text-3xl font-bold">{internshipReports.length}</span>
        </div>
        <h3 className="text-lg font-semibold">Reports</h3>
        <p className="text-orange-100 text-sm">To review</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <Star size={32} />
          <span className="text-3xl font-bold">{companyFeedbacks.length}</span>
        </div>
        <h3 className="text-lg font-semibold">Feedbacks</h3>
        <p className="text-purple-100 text-sm">Company reviews</p>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                <td className="py-3 px-4 text-gray-600">{student.email}</td>
                <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleScheduleViva(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Schedule Viva"
                    >
                      <Calendar size={16} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVivaSchedules = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Viva Schedules</h2>
        <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Schedule Viva
        </button>
      </div>
      
      <div className="space-y-4">
        {vivaSchedules.map((schedule) => (
          <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{schedule.studentName}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {schedule.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {schedule.time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  schedule.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {schedule.status}
                </span>
                <button
                  onClick={() => handleEditSchedule(schedule)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Schedule"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Schedule"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInternshipReports = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Internship Reports</h2>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pending Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {internshipReports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600 mt-1">by {report.studentName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>Submitted: {report.submittedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report.status === 'Approved' 
                    ? 'bg-green-100 text-green-800'
                    : report.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                  Review
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <FileText size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompanyFeedbacks = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Company Feedbacks</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {companyFeedbacks.map((feedback) => (
          <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{feedback.studentName}</h3>
                  <span className="text-sm text-gray-600">{feedback.company}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{feedback.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{feedback.feedback}</p>
                <p className="text-xs text-gray-500 mt-2">Date: {feedback.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinalGrading = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Final Grading</h2>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Award size={18} />
          Grade Student
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {student.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Viva Score:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Report Score:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Company Rating:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                <span>Final Grade:</span>
                <span className="text-orange-600">-</span>
              </div>
            </div>
            
            <button className="w-full mt-3 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
              Assign Grade
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lecture Dashboard</h1>
                {lecturerData && (
                  <span className="text-sm text-gray-600">
                    Welcome back, {lecturerData.fullName}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'viva', label: 'Viva Schedule', icon: Calendar },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'feedbacks', label: 'Company Feedback', icon: Building },
              { id: 'grading', label: 'Final Grading', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'viva' && renderVivaSchedules()}
        {activeTab === 'reports' && renderInternshipReports()}
        {activeTab === 'feedbacks' && renderCompanyFeedbacks()}
        {activeTab === 'grading' && renderFinalGrading()}
      </div>

      {/* Schedule Viva Modal */}
      {showScheduleModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Schedule Viva for {selectedStudent.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle schedule creation
                    setShowScheduleModal(false);
                    toast.success('Viva scheduled successfully');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LectureDashboard;
