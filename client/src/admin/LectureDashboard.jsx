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
  const [reportStatusFilter, setReportStatusFilter] = useState('All Status');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedGradingStudent, setSelectedGradingStudent] = useState(null);
  const [gradingForm, setGradingForm] = useState({
    vivaScore: '',
    finalScore: 0,
    finalGrade: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    studentId: '',
    date: '',
    time: '',
    venue: '',
    notes: '',
    status: 'Scheduled'
  });
  const [reviewForm, setReviewForm] = useState({
    mark: '',
    feedback: ''
  });
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
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Internship Completed', reportMark: 85, companyRating: 4.5, vivaScore: 88, finalScore: 87.3, finalGrade: 'A' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', status: 'Internship Completed', reportMark: 92, companyRating: 4.8, vivaScore: 90, finalScore: 90.8, finalGrade: 'A+' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-123-4567', status: 'Internship Completed', reportMark: null, companyRating: 4.2, vivaScore: null, finalScore: null, finalGrade: null },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '777-888-9999', status: 'In Progress', reportMark: null, companyRating: null, vivaScore: null, finalScore: null, finalGrade: null }
    ]);
    
    setVivaSchedules([
      { 
        id: 1, 
        studentId: 1, 
        studentName: 'John Doe', 
        date: '2025-04-05', 
        time: '10:00 AM', 
        venue: 'Room 101, Main Building',
        notes: 'Bring project documentation',
        status: 'Scheduled' 
      },
      { 
        id: 2, 
        studentId: 2, 
        studentName: 'Jane Smith', 
        date: '2025-04-06', 
        time: '2:00 PM', 
        venue: 'Conference Hall A',
        notes: 'Final presentation',
        status: 'Completed' 
      }
    ]);
    
    setInternshipReports([
      { 
        id: 1, 
        studentId: 1, 
        studentName: 'John Doe', 
        studentEmail: 'john@example.com',
        internshipTitle: 'Web Development Internship', 
        company: 'Tech Corp',
        submittedDate: '2025-04-01', 
        status: 'Pending Review',
        reportContent: 'During my internship at Tech Corp, I worked on developing responsive web applications using React and Node.js. I contributed to three major projects and learned about agile development methodologies. The experience helped me improve my technical skills and understand professional work environments.',
        mark: null
      },
      { 
        id: 2, 
        studentId: 2, 
        studentName: 'Jane Smith', 
        studentEmail: 'jane@example.com',
        internshipTitle: 'Mobile App Development', 
        company: 'Digital Solutions',
        submittedDate: '2025-04-02', 
        status: 'Approved',
        reportContent: 'My internship at Digital Solutions focused on mobile app development using React Native. I developed two mobile applications and participated in the complete software development lifecycle. I gained valuable experience in mobile UI/UX design and app deployment.',
        mark: 85
      },
      { 
        id: 3, 
        studentId: 3, 
        studentName: 'Mike Johnson', 
        studentEmail: 'mike@example.com',
        internshipTitle: 'Data Science Internship', 
        company: 'Analytics Pro',
        submittedDate: '2025-04-03', 
        status: 'Pending Review',
        reportContent: 'At Analytics Pro, I worked on machine learning projects and data analysis tasks. I developed predictive models and created data visualizations. This internship enhanced my skills in Python, TensorFlow, and statistical analysis.',
        mark: null
      }
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
    setScheduleForm({
      studentId: student.id,
      date: '',
      time: '',
      venue: '',
      notes: '',
      status: 'Scheduled'
    });
    setShowScheduleModal(true);
  };

  const handleOpenScheduleModal = () => {
    setScheduleForm({
      studentId: '',
      date: '',
      time: '',
      venue: '',
      notes: '',
      status: 'Scheduled'
    });
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setScheduleForm({
      studentId: schedule.studentId.toString(),
      date: schedule.date,
      time: schedule.time,
      venue: schedule.venue || '',
      notes: schedule.notes || '',
      status: schedule.status
    });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.studentId || !scheduleForm.date || !scheduleForm.time || !scheduleForm.venue) {
      toast.error('Please fill all required fields');
      return;
    }

    const student = students.find(s => s.id === parseInt(scheduleForm.studentId));
    
    if (selectedSchedule) {
      // Update existing schedule
      setVivaSchedules(vivaSchedules.map(s => 
        s.id === selectedSchedule.id 
          ? {
              ...s,
              studentId: parseInt(scheduleForm.studentId),
              studentName: student.name,
              date: scheduleForm.date,
              time: scheduleForm.time,
              venue: scheduleForm.venue,
              notes: scheduleForm.notes,
              status: scheduleForm.status
            }
          : s
      ));
      toast.success('Viva schedule updated successfully');
    } else {
      // Create new schedule
      const newSchedule = {
        id: vivaSchedules.length + 1,
        studentId: parseInt(scheduleForm.studentId),
        studentName: student.name,
        date: scheduleForm.date,
        time: scheduleForm.time,
        venue: scheduleForm.venue,
        notes: scheduleForm.notes,
        status: scheduleForm.status
      };
      setVivaSchedules([...vivaSchedules, newSchedule]);
      toast.success('Viva scheduled successfully');
    }
    
    // Reset form and close modal
    setShowScheduleModal(false);
    setSelectedSchedule(null);
    setScheduleForm({
      studentId: '',
      date: '',
      time: '',
      venue: '',
      notes: '',
      status: 'Scheduled'
    });
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this viva schedule?')) {
      setVivaSchedules(vivaSchedules.filter(s => s.id !== scheduleId));
      toast.success('Viva schedule deleted successfully');
    }
  };

  const handleReviewReport = (report) => {
    setSelectedReport(report);
    setReviewForm({
      mark: report.mark || '',
      feedback: ''
    });
    setShowReviewModal(true);
  };

  const handleSaveReview = () => {
    if (!reviewForm.mark || reviewForm.mark < 0 || reviewForm.mark > 100) {
      toast.error('Please enter a valid mark between 0 and 100');
      return;
    }

    // Update the report with mark and status
    setInternshipReports(internshipReports.map(report => 
      report.id === selectedReport.id 
        ? {
            ...report,
            mark: parseInt(reviewForm.mark),
            status: 'Approved',
            feedback: reviewForm.feedback
          }
        : report
    ));

    toast.success(`Report reviewed and marked: ${reviewForm.mark}%`);
    setShowReviewModal(false);
    setSelectedReport(null);
    setReviewForm({ mark: '', feedback: '' });
  };

  const handleRejectReport = () => {
    if (!reviewForm.feedback) {
      toast.error('Please provide feedback for rejection');
      return;
    }

    // Update the report with rejected status
    setInternshipReports(internshipReports.map(report => 
      report.id === selectedReport.id 
        ? {
            ...report,
            status: 'Rejected',
            feedback: reviewForm.feedback,
            mark: null
          }
        : report
    ));

    toast.success('Report rejected with feedback');
    setShowReviewModal(false);
    setSelectedReport(null);
    setReviewForm({ mark: '', feedback: '' });
  };

  const handleAssignGrade = (student) => {
    setSelectedGradingStudent(student);
    
    // Auto-fill report mark and company rating
    const report = internshipReports.find(r => r.studentId === student.id && r.mark !== null);
    const feedback = companyFeedbacks.find(f => f.studentId === student.id);
    
    setGradingForm({
      vivaScore: student.vivaScore || '',
      reportMark: report ? report.mark : '',
      companyRating: feedback ? feedback.rating * 20 : '', // Convert 5-point to 100-point scale
      finalScore: student.finalScore || 0,
      finalGrade: student.finalGrade || ''
    });
    setShowGradingModal(true);
  };

  const calculateFinalScore = (vivaScore, reportMark, companyRating) => {
    // Weightage: Viva 40%, Report 40%, Company 20%
    const vivaWeight = 0.4;
    const reportWeight = 0.4;
    const companyWeight = 0.2;
    
    return (vivaScore * vivaWeight) + (reportMark * reportWeight) + (companyRating * companyWeight);
  };

  const calculateGrade = (score) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 65) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  };

  const handleSaveGrade = () => {
    if (!gradingForm.vivaScore || !gradingForm.reportMark || !gradingForm.companyRating) {
      toast.error('Please fill all required fields');
      return;
    }

    const finalScore = calculateFinalScore(
      parseFloat(gradingForm.vivaScore),
      parseFloat(gradingForm.reportMark),
      parseFloat(gradingForm.companyRating)
    );

    const finalGrade = calculateGrade(finalScore);

    // Update student with grading information
    setStudents(students.map(student => 
      student.id === selectedGradingStudent.id 
        ? {
            ...student,
            vivaScore: parseFloat(gradingForm.vivaScore),
            reportMark: parseFloat(gradingForm.reportMark),
            companyRating: parseFloat(gradingForm.companyRating) / 20, // Convert back to 5-point scale
            finalScore: finalScore,
            finalGrade: finalGrade,
            status: 'Graded'
          }
        : student
    ));

    toast.success(`Grade assigned: ${finalGrade} (${finalScore.toFixed(1)}%)`);
    setShowGradingModal(false);
    setSelectedGradingStudent(null);
    setGradingForm({ vivaScore: '', finalScore: 0, finalGrade: '' });
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

  const renderStudents = () => {
    // Filter students based on search term match
    const filteredStudents = searchTerm 
      ? students.filter(student => 
          student.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone.includes(searchTerm)
        )
      : students;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </div>
        
        {searchTerm && filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No students found matching "{searchTerm}"</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{student.email}</td>
                  <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      student.status === 'Internship Completed' ? 'bg-blue-100 text-blue-800' :
                      student.status === 'Graded' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
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
  };

  const renderVivaSchedules = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Viva Schedules</h2>
        <button 
          onClick={handleOpenScheduleModal}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Schedule Viva
        </button>
      </div>
      
      {/* Students who completed internship */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Students Ready for Viva</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students
            .filter(student => student.status === 'Internship Completed')
            .filter(student => !vivaSchedules.some(schedule => schedule.studentId === student.id))
            .map((student) => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-600">{student.phone}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      {student.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleScheduleViva(student)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Schedule Viva"
                  >
                    <Calendar size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Scheduled Vivas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Scheduled Vivas</h3>
        <div className="space-y-4">
          {vivaSchedules.length > 0 ? (
            vivaSchedules.map((schedule) => (
              <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{schedule.studentName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {schedule.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {schedule.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building size={14} />
                        {schedule.venue}
                      </span>
                      {schedule.notes && (
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {schedule.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      schedule.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : schedule.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No viva schedules yet. Schedule your first viva to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInternshipReports = () => {
    // Filter reports based on status
    const filteredReports = reportStatusFilter === 'All Status' 
      ? internshipReports 
      : internshipReports.filter(report => report.status === reportStatusFilter);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Internship Reports</h2>
          <div className="flex gap-2">
            <select 
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>Pending Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        
        {reportStatusFilter !== 'All Status' && filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No reports found with status "{reportStatusFilter}"</p>
          </div>
        )}
        
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Student Name as Primary Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{report.studentName}</h3>
                  
                  {/* Internship Details */}
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Internship:</span> {report.internshipTitle}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Company:</span> {report.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Submitted:</span> {report.submittedDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {report.studentEmail}
                    </p>
                  </div>

                  {/* Show mark if already graded */}
                  {report.mark !== null && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Award size={14} className="mr-1" />
                        Mark: {report.mark}%
                      </span>
                    </div>
                  )}
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
                  
                  {/* Review Button */}
                  <button 
                    onClick={() => handleReviewReport(report)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <FileText size={14} />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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

  const renderFinalGrading = () => {
    // Filter students who completed internship
    const completedStudents = students.filter(student => student.status === 'Internship Completed' || student.status === 'Graded');
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Final Grading</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedStudents.map((student) => (
            <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  student.status === 'Graded' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {student.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Viva Score:</span>
                  <span className="font-medium">{student.vivaScore || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Report Score:</span>
                  <span className="font-medium">{student.reportMark || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Company Rating:</span>
                  <span className="font-medium">{student.companyRating ? `${student.companyRating}/5` : '-'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                  <span>Final Score:</span>
                  <span className="text-orange-600">{student.finalScore ? `${student.finalScore.toFixed(1)}%` : '-'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Final Grade:</span>
                  <span className="text-orange-600">{student.finalGrade || '-'}</span>
                </div>
              </div>
              
              <button 
                onClick={() => student.status === 'Graded' ? handleAssignGrade(student) : handleAssignGrade(student)}
                className="w-full mt-3 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                {student.status === 'Graded' ? 'Edit Grade' : 'Assign Grade'}
              </button>
            </div>
          ))}
          
          {completedStudents.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Award size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No students have completed their internship yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-gray-900 to-purple-800 shadow-lg border-b border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Lecture Dashboard</h1>
                {lecturerData && (
                  <span className="text-sm text-purple-200">
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
      <div className="bg-gradient-to-r from-purple-800 to-gray-800 border-b border-purple-700">
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
                    ? 'border-purple-400 text-white'
                    : 'border-transparent text-purple-200 hover:text-white hover:border-purple-500'
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
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {selectedSchedule ? 'Edit Viva Schedule' : 'Schedule New Viva'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select
                  value={scheduleForm.studentId}
                  onChange={(e) => setScheduleForm({...scheduleForm, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a student</option>
                  {students
                    .filter(student => student.status === 'Internship Completed')
                    .map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.email}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                <input
                  type="text"
                  placeholder="e.g., Room 101, Main Building"
                  value={scheduleForm.venue}
                  onChange={(e) => setScheduleForm({...scheduleForm, venue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={scheduleForm.status}
                  onChange={(e) => setScheduleForm({...scheduleForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  placeholder="Additional notes or instructions"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedSchedule(null);
                    setScheduleForm({
                      studentId: '',
                      date: '',
                      time: '',
                      venue: '',
                      notes: '',
                      status: 'Scheduled'
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {selectedSchedule ? 'Update' : 'Schedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Review Modal */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Internship Report</h3>
              
              {/* Student Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-medium text-gray-900">{selectedReport.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedReport.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Internship</p>
                    <p className="font-medium text-gray-900">{selectedReport.internshipTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{selectedReport.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted Date</p>
                    <p className="font-medium text-gray-900">{selectedReport.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedReport.status === 'Approved' 
                        ? 'bg-green-100 text-green-800'
                        : selectedReport.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Report Content</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.reportContent}</p>
                </div>
              </div>

              {/* Review Form */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Evaluation</h4>
                
                <div className="space-y-4">
                  {/* Mark Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mark (out of 100%) *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={reviewForm.mark}
                        onChange={(e) => setReviewForm({...reviewForm, mark: e.target.value})}
                        placeholder="Enter mark (0-100)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={reviewForm.mark || 0}
                          onChange={(e) => setReviewForm({...reviewForm, mark: e.target.value})}
                          className="w-32"
                        />
                        <span className="text-sm font-medium text-gray-700 w-12">{reviewForm.mark || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback (optional)
                    </label>
                    <textarea
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})}
                      placeholder="Provide feedback for the student..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReport(null);
                        setReviewForm({ mark: '', feedback: '' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectReport}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Reject Report
                    </button>
                    <button
                      onClick={handleSaveReview}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Approve & Mark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedGradingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {selectedGradingStudent.finalGrade ? 'Edit Grade' : 'Assign Grade'} - {selectedGradingStudent.name}
            </h3>
            
            {/* Student Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-medium text-gray-900">{selectedGradingStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedGradingStudent.email}</p>
                </div>
              </div>
            </div>

            {/* Grading Form */}
            <div className="space-y-6">
              {/* Report Mark (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Score (out of 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradingForm.reportMark}
                  onChange={(e) => setGradingForm({...gradingForm, reportMark: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-filled from Reports section"
                />
              </div>

              {/* Company Rating (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Rating (out of 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradingForm.companyRating}
                  onChange={(e) => setGradingForm({...gradingForm, companyRating: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-filled from Company Feedback"
                />
              </div>

              {/* Viva Score (Manual Entry) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Viva Score (out of 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradingForm.vivaScore}
                  onChange={(e) => {
                    const vivaScore = e.target.value;
                    const finalScore = calculateFinalScore(
                      parseFloat(vivaScore || 0),
                      parseFloat(gradingForm.reportMark || 0),
                      parseFloat(gradingForm.companyRating || 0)
                    );
                    const finalGrade = calculateGrade(finalScore);
                    
                    setGradingForm({
                      ...gradingForm,
                      vivaScore,
                      finalScore,
                      finalGrade
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>

              {/* Auto-calculated Results */}
              {(gradingForm.vivaScore && gradingForm.reportMark && gradingForm.companyRating) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Calculated Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Final Score</p>
                      <p className="text-lg font-bold text-blue-600">
                        {gradingForm.finalScore.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Final Grade</p>
                      <p className="text-lg font-bold text-blue-600">
                        {gradingForm.finalGrade}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Weightage: Viva 40% + Report 40% + Company 20%
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowGradingModal(false);
                    setSelectedGradingStudent(null);
                    setGradingForm({ vivaScore: '', finalScore: 0, finalGrade: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {selectedGradingStudent.finalGrade ? 'Update Grade' : 'Assign Grade'}
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
