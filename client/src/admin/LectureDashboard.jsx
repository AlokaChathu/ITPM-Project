import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, BookOpen, Calendar, Award, 
  Clock, Edit, Trash2, Plus, Search, Filter,
  ChevronRight, CheckCircle, XCircle, AlertCircle,
  FileText, Building, Star, TrendingUp, Download
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE } from '../config/api.js';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

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
  const [, setSelectedStudent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedGradingStudent, setSelectedGradingStudent] = useState(null);
  const [gradingTab, setGradingTab] = useState('to-be-graded');
  const [studentStatusFilter, setStudentStatusFilter] = useState('All');
  
  // Chart data states
  const [monthlyData, setMonthlyData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [companyRatings, setCompanyRatings] = useState([]);
  const [internshipProgress, setInternshipProgress] = useState([]);
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

  // Get today's date in YYYY-MM-DD format for min date attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get current time in HH:MM format for min time attribute
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  const [reviewForm, setReviewForm] = useState({
    mark: '',
    feedback: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLecturerData();
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
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
    try {
      // Fetch all users from existing endpoint
      const { data } = await axios.get(`${API_BASE}/api/admin/users`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (data.success && data.data) {
        // Filter for students only
        const students = data.data.filter(user => user.role === 'Student');
        setStudents(students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // If error, set empty arrays
      setStudents([]);
    }

    // Fetch company feedbacks
    try {
      const { data } = await axios.get('http://localhost:4000/api/feedback/all', {
        withCredentials: true
      });
      
      if (data.success && data.data) {
        const formattedFeedbacks = data.data.map(feedback => ({
          id: feedback._id,
          studentName: feedback.studentId?.name || 'Unknown',
          company: feedback.companyId?.name || 'Unknown Company',
          rating: feedback.rating,
          feedback: feedback.feedback,
          date: new Date(feedback.createdAt).toLocaleDateString()
        }));
        setCompanyFeedbacks(formattedFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching company feedbacks:', error);
      setCompanyFeedbacks([]);
    }

    // Fetch viva schedules
    try {
      const { data } = await axios.get('http://localhost:4000/api/viva-schedule/all', {
        withCredentials: true
      });
      
      if (data.success && data.data) {
        const formattedSchedules = data.data.map(schedule => ({
          id: schedule._id,
          studentId: schedule.studentId?._id,
          studentName: schedule.studentName,
          date: schedule.date,
          time: schedule.time,
          venue: schedule.venue,
          notes: schedule.notes,
          status: schedule.status
        }));
        setVivaSchedules(formattedSchedules);
      }
    } catch (error) {
      console.error('Error fetching viva schedules:', error);
      setVivaSchedules([]);
    }

    // Fetch internship reports
    let formattedReports = [];
    try {
      const { data } = await axios.get('http://localhost:4000/api/report/all', {
        withCredentials: true
      });
      
      if (data.success && data.data) {
        formattedReports = data.data.map(report => ({
          id: report._id,
          studentName: report.studentName,
          studentEmail: report.studentEmail,
          internshipTitle: report.internshipTitle,
          company: report.company,
          fileName: report.fileName,
          fileSize: report.fileSize,
          status: report.status,
          mark: report.mark,
          feedback: report.feedback,
          submittedDate: new Date(report.submittedDate).toLocaleDateString()
        }));
        setInternshipReports(formattedReports);
      }
    } catch (error) {
      console.error('Error fetching internship reports:', error);
      setInternshipReports([]);
    }

    // Process chart data using local variables (not state which is async)
    processMonthlyData(formattedReports);
    processGradeDistribution(formattedReports);
    processCompanyRatings(companyFeedbacks);
    processInternshipProgress(students, vivaSchedules, formattedReports);
  };

  // Process monthly performance data
  const processMonthlyData = (reports) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = {};
    
    // Initialize all months
    monthNames.forEach(month => {
      monthlyStats[month] = { submissions: 0, completed: 0 };
    });
    
    // Process reports
    reports.forEach(report => {
      const date = new Date(report.submittedDate);
      const month = monthNames[date.getMonth()];
      if (monthlyStats[month]) {
        monthlyStats[month].submissions++;
        if (report.status === 'Approved') {
          monthlyStats[month].completed++;
        }
      }
    });
    
    // Convert to array
    const data = monthNames.map(month => ({
      month,
      submissions: monthlyStats[month].submissions,
      completed: monthlyStats[month].completed
    }));
    
    setMonthlyData(data);
  };

  // Process grade distribution data
  const processGradeDistribution = (reports) => {
    const gradeRanges = {
      'A': { min: 80, max: 100, count: 0 },
      'B': { min: 70, max: 79, count: 0 },
      'C': { min: 60, max: 69, count: 0 },
      'D': { min: 50, max: 59, count: 0 },
      'F': { min: 0, max: 49, count: 0 }
    };
    
    let totalGraded = 0;
    
    reports.forEach(report => {
      if (report.mark !== null && report.mark !== undefined) {
        totalGraded++;
        const mark = report.mark;
        for (const [grade, range] of Object.entries(gradeRanges)) {
          if (mark >= range.min && mark <= range.max) {
            gradeRanges[grade].count++;
            break;
          }
        }
      }
    });
    
    // Calculate percentages
    const data = Object.entries(gradeRanges).map(([grade, range]) => ({
      grade,
      count: range.count,
      percentage: totalGraded > 0 ? Math.round((range.count / totalGraded) * 100) : 0
    })).filter(item => item.count > 0); // Only show grades with data
    
    setGradeDistribution(data.length > 0 ? data : [{ grade: 'No Data', count: 0, percentage: 0 }]);
  };

  // Process company ratings data
  const processCompanyRatings = (feedbacks) => {
    const companyRatingsMap = {};
    
    feedbacks.forEach(feedback => {
      const company = feedback.company;
      if (!companyRatingsMap[company]) {
        companyRatingsMap[company] = { total: 0, count: 0 };
      }
      companyRatingsMap[company].total += feedback.rating;
      companyRatingsMap[company].count++;
    });
    
    const data = Object.entries(companyRatingsMap).map(([company, stats]) => ({
      company,
      rating: Math.round((stats.total / stats.count) * 10) / 10
    })).sort((a, b) => b.rating - a.rating);
    
    setCompanyRatings(data.length > 0 ? data : [{ company: 'No Data', rating: 0 }]);
  };

  // Process internship progress data
  const processInternshipProgress = (students, schedules, reports) => {
    const stages = [
      { name: 'Applied', total: 0, completed: 0 },
      { name: 'Interview', total: 0, completed: 0 },
      { name: 'Viva', total: 0, completed: 0 },
      { name: 'Report', total: 0, completed: 0 },
      { name: 'Completed', total: 0, completed: 0 }
    ];
    
    // Count students at each stage based on reports and schedules
    students.forEach(student => {
      const studentReport = reports.find(r => r.studentEmail === student.email);
      const studentSchedule = schedules.find(s => s.studentId === student._id);
      
      // Applied stage - all students
      stages[0].total++;
      stages[0].completed++;
      
      // Interview stage - students with reports
      if (studentReport) {
        stages[1].total++;
        stages[1].completed++;
      }
      
      // Viva stage - students with schedules
      if (studentSchedule) {
        stages[2].total++;
        if (studentSchedule.status === 'Completed') {
          stages[2].completed++;
        }
      }
      
      // Report stage - students with approved reports
      if (studentReport && studentReport.status === 'Approved') {
        stages[3].total++;
        stages[3].completed++;
      }
      
      // Completed stage - students with marks
      if (studentReport && studentReport.mark !== null && studentReport.mark !== undefined) {
        stages[4].total++;
        stages[4].completed++;
      }
    });
    
    const data = stages.map(stage => ({
      stage: stage.name,
      count: stage.total,
      completed: stage.completed
    }));
    
    setInternshipProgress(data);
  };

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await axios.get(`${API_BASE}/api/admin/logout`, {
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
      studentId: student._id,
      date: '',
      time: '',
      venue: '',
      notes: '',
      status: 'Scheduled'
    });
    setSelectedSchedule(null);
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

  const handleSaveSchedule = async () => {
    // Form validation
    if (!scheduleForm.studentId) {
      toast.error('Please select a student');
      return;
    }
    if (!scheduleForm.date) {
      toast.error('Please select a date');
      return;
    }
    if (!scheduleForm.time) {
      toast.error('Please select a time');
      return;
    }
    if (!scheduleForm.venue) {
      toast.error('Please enter a venue');
      return;
    }

    // Date validation - prevent past dates
    const selectedDate = new Date(scheduleForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for comparison
    
    if (selectedDate < today) {
      toast.error('Cannot schedule viva in the past');
      return;
    }

    // Time validation for today
    if (selectedDate.toDateString() === today.toDateString()) {
      const currentTime = new Date();
      const [hours, minutes] = scheduleForm.time.split(':');
      const selectedTime = new Date();
      selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (selectedTime <= currentTime) {
        toast.error('Cannot schedule viva in the past. Please select a future time.');
        return;
      }
    }

    // Venue validation
    if (scheduleForm.venue.trim().length < 3) {
      toast.error('Venue must be at least 3 characters long');
      return;
    }

    const student = students.find(s => s._id === scheduleForm.studentId);
    
    try {
      if (selectedSchedule) {
        // Update existing schedule
        const { data } = await axios.put(`http://localhost:4000/api/viva-schedule/${selectedSchedule.id}`, {
          studentId: scheduleForm.studentId,
          studentName: student.name,
          date: scheduleForm.date,
          time: scheduleForm.time,
          venue: scheduleForm.venue,
          notes: scheduleForm.notes,
          status: scheduleForm.status
        }, { withCredentials: true });
        
        if (data.success) {
          setVivaSchedules(vivaSchedules.map(s => 
            s.id === selectedSchedule.id 
              ? { ...s, ...data.data }
              : s
          ));
          toast.success('Viva schedule updated successfully');
        } else {
          toast.error(data.message);
        }
      } else {
        // Create new schedule
        const { data } = await axios.post('http://localhost:4000/api/viva-schedule/create', {
          studentId: scheduleForm.studentId,
          studentName: student.name,
          date: scheduleForm.date,
          time: scheduleForm.time,
          venue: scheduleForm.venue,
          notes: scheduleForm.notes,
          status: scheduleForm.status
        }, { withCredentials: true });
        
        if (data.success) {
          setVivaSchedules([...vivaSchedules, {
            id: data.data._id,
            studentId: data.data.studentId,
            studentName: data.data.studentName,
            date: data.data.date,
            time: data.data.time,
            venue: data.data.venue,
            notes: data.data.notes,
            status: data.data.status
          }]);
          toast.success('Viva scheduled successfully');
        } else {
          toast.error(data.message);
        }
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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save viva schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this viva schedule?')) {
      try {
        const { data } = await axios.delete(`http://localhost:4000/api/viva-schedule/${scheduleId}`, {
          withCredentials: true
        });
        
        if (data.success) {
          setVivaSchedules(vivaSchedules.filter(s => s.id !== scheduleId));
          toast.success('Viva schedule deleted successfully');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete viva schedule');
      }
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

  const handleSaveReview = async () => {
    // Form validation
    if (!reviewForm.mark) {
      toast.error('Please enter a mark');
      return;
    }

    const mark = parseFloat(reviewForm.mark);
    
    // Mark range validation
    if (isNaN(mark)) {
      toast.error('Please enter a valid number for the mark');
      return;
    }
    
    if (mark < 0) {
      toast.error('Mark cannot be negative');
      return;
    }
    
    if (mark > 100) {
      toast.error('Mark cannot exceed 100');
      return;
    }

    // Feedback validation for approval
    if (mark < 50 && !reviewForm.feedback.trim()) {
      toast.error('Please provide feedback for marks below 50%');
      return;
    }

    // Feedback length validation
    if (reviewForm.feedback && reviewForm.feedback.trim().length > 500) {
      toast.error('Feedback cannot exceed 500 characters');
      return;
    }

    try {
      // Save to database
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/report/grade/${selectedReport.id}`, {
        mark: mark,
        feedback: reviewForm.feedback,
        status: 'Approved'
      });

      if (data.success) {
        // Update local state
        setInternshipReports(internshipReports.map(report => 
          report.id === selectedReport.id 
            ? {
                ...report,
                mark: mark,
                status: 'Approved',
                feedback: reviewForm.feedback
              }
            : report
        ));

        toast.success(`Report reviewed and marked: ${mark}%`);
        setShowReviewModal(false);
        setSelectedReport(null);
        setReviewForm({ mark: '', feedback: '' });
      } else {
        toast.error(data.message || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error saving report grade:', error);
      toast.error('Failed to update report grade');
    }
  };

  const handleRejectReport = async () => {
    // Form validation for rejection
    if (!reviewForm.feedback || !reviewForm.feedback.trim()) {
      toast.error('Please provide feedback for rejection');
      return;
    }

    if (reviewForm.feedback.trim().length < 10) {
      toast.error('Feedback must be at least 10 characters long');
      return;
    }

    if (reviewForm.feedback.trim().length > 500) {
      toast.error('Feedback cannot exceed 500 characters');
      return;
    }

    try {
      // Save to database
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/report/grade/${selectedReport.id}`, {
        mark: null,
        feedback: reviewForm.feedback,
        status: 'Rejected'
      });

      if (data.success) {
        // Update local state
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
      } else {
        toast.error(data.message || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      toast.error('Failed to reject report');
    }
  };

  const handleAssignGrade = (student) => {
    // Verify viva schedule is completed
    const vivaSchedule = vivaSchedules.find(vs => vs.studentId === student._id);
    if (!vivaSchedule || vivaSchedule.status !== 'Completed') {
      toast.error('Student must have a completed viva schedule to be graded');
      return;
    }

    setSelectedGradingStudent(student);
    
    // Auto-fill company rating (convert 5-point to 100-point scale)
    const feedback = companyFeedbacks.find(f => f.studentName?.toLowerCase() === student.name?.toLowerCase());
    
    // Auto-fill report mark from internshipReports if report has been approved and marked
    const report = internshipReports.find(r => r.studentName?.toLowerCase() === student.name?.toLowerCase() && r.status === 'Approved');
    
    setGradingForm({
      vivaScore: student.vivaScore || '',
      reportMark: report && report.mark ? report.mark : (student.reportMark || ''),
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
    if (score >= 85) return 'A+';
    if (score >= 76) return 'A';
    if (score >= 70) return 'A-';
    if (score >= 65) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 55) return 'B-';
    if (score >= 50) return 'C+';
    if (score >= 45) return 'C';
    return 'F';
  };

  const handleSaveGrade = async () => {
    // Form validation
    if (!gradingForm.vivaScore || (typeof gradingForm.vivaScore === 'string' && gradingForm.vivaScore.trim() === '')) {
      toast.error('Please enter viva score');
      return;
    }
    if (!gradingForm.reportMark || (typeof gradingForm.reportMark === 'string' && gradingForm.reportMark.trim() === '')) {
      toast.error('Please enter report score');
      return;
    }
    if (!gradingForm.companyRating || (typeof gradingForm.companyRating === 'string' && gradingForm.companyRating.trim() === '')) {
      toast.error('Please enter company rating');
      return;
    }

    // Viva score validation
    const vivaScore = parseFloat(gradingForm.vivaScore);
    if (isNaN(vivaScore)) {
      toast.error('Please enter a valid number for viva score');
      return;
    }
    if (vivaScore < 0) {
      toast.error('Viva score cannot be negative');
      return;
    }
    if (vivaScore > 100) {
      toast.error('Viva score cannot exceed 100');
      return;
    }
    // Check decimal places (max 1 decimal place)
    if (gradingForm.vivaScore.toString().includes('.') && gradingForm.vivaScore.toString().split('.')[1]?.length > 1) {
      toast.error('Viva score can have maximum 1 decimal place');
      return;
    }

    // Report score validation
    const reportMark = parseFloat(gradingForm.reportMark);
    if (isNaN(reportMark)) {
      toast.error('Please enter a valid number for report score');
      return;
    }
    if (reportMark < 0) {
      toast.error('Report score cannot be negative');
      return;
    }
    if (reportMark > 100) {
      toast.error('Report score cannot exceed 100');
      return;
    }
    // Check decimal places (max 1 decimal place)
    if (gradingForm.reportMark.toString().includes('.') && gradingForm.reportMark.toString().split('.')[1]?.length > 1) {
      toast.error('Report score can have maximum 1 decimal place');
      return;
    }

    // Company rating validation
    const companyRating = parseFloat(gradingForm.companyRating);
    if (isNaN(companyRating)) {
      toast.error('Please enter a valid number for company rating');
      return;
    }
    if (companyRating < 0) {
      toast.error('Company rating cannot be negative');
      return;
    }
    if (companyRating > 100) {
      toast.error('Company rating cannot exceed 100');
      return;
    }
    // Check decimal places (max 1 decimal place)
    if (gradingForm.companyRating.toString().includes('.') && gradingForm.companyRating.toString().split('.')[1]?.length > 1) {
      toast.error('Company rating can have maximum 1 decimal place');
      return;
    }

    // Additional validation: Check if all scores are reasonable
    if (vivaScore < 30) {
      const confirmLowScore = window.confirm('Viva score is quite low (below 30%). Are you sure you want to continue?');
      if (!confirmLowScore) return;
    }

    if (reportMark < 30) {
      const confirmLowReport = window.confirm('Report score is quite low (below 30%). Are you sure you want to continue?');
      if (!confirmLowReport) return;
    }

    const finalScore = calculateFinalScore(vivaScore, reportMark, companyRating);
    const finalGrade = calculateGrade(finalScore);

    // Confirm before saving
    const confirmSave = window.confirm(
      `Save grade for ${selectedGradingStudent.name}?\n\n` +
      `Viva Score: ${vivaScore}\n` +
      `Report Score: ${reportMark}\n` +
      `Company Rating: ${companyRating}\n\n` +
      `Final Score: ${finalScore.toFixed(1)}%\n` +
      `Final Grade: ${finalGrade}`
    );
    if (!confirmSave) return;

    // Save to backend
    try {
      console.log('Saving grade for student:', selectedGradingStudent._id);
      const { data } = await axios.put(`http://localhost:4000/api/user/update-grade/${selectedGradingStudent._id}`, {
        vivaScore,
        reportMark,
        companyRating: companyRating / 20, // Convert back to 5-point scale
        finalScore,
        finalGrade
      }, {
        withCredentials: true
      });

      console.log('API response:', data);

      if (data.success) {
        // Update local state after successful API call
        setStudents(students.map(student => 
          student._id === selectedGradingStudent._id 
            ? {
                ...student,
                vivaScore: vivaScore,
                reportMark: reportMark,
                companyRating: companyRating / 20,
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
      } else {
        console.error('API returned failure:', data);
        toast.error(data.message || 'Failed to save grade');
      }
    } catch (error) {
      console.error('Error saving grade:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save grade. Please try again.');
    }
  };

  const renderOverview = () => {
    const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#a855f7'];
    
    return (
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{students.length}</p>
                <p className="text-xs text-slate-400 mt-1">Active interns</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Users size={22} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Viva Schedules</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{vivaSchedules.length}</p>
                <p className="text-xs text-slate-400 mt-1">Pending & completed</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Calendar size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Reports</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{internshipReports.length}</p>
                <p className="text-xs text-slate-400 mt-1">To review</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <FileText size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Feedbacks</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{companyFeedbacks.length}</p>
                <p className="text-xs text-slate-400 mt-1">Company reviews</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Star size={22} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance Chart */}
          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Monthly Performance</h3>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Submissions vs Completed</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="submissions" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} name="Submissions" />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution Chart */}
          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Grade Distribution</h3>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">By Grade Range</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                  strokeWidth={2}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Company Ratings Chart */}
          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Company Ratings</h3>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Average Rating (0-5)</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={companyRatings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="company" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="rating" fill="#f59e0b" name="Average Rating" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Internship Progress Chart */}
          <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Internship Progress</h3>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Stage Completion</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={internshipProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} name="Total" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderStudents = () => {
    // Filter students based on search term match and status filter
    let filteredStudents = students;
    
    // Apply status filter
    if (studentStatusFilter !== 'All') {
      filteredStudents = filteredStudents.filter(student => {
        const status = student.status || 'In Progress';
        if (studentStatusFilter === 'Graded') {
          return status === 'Graded';
        } else if (studentStatusFilter === 'In Progress') {
          return status === 'In Progress';
        }
        return true;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.status || 'In Progress').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return (
      <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm">
        <div className="px-6 py-5 border-b border-white/30 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">Students</h2>
          <div className="flex items-center gap-3">
            <select 
              value={studentStatusFilter}
              onChange={(e) => setStudentStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white"
            >
              <option value="All">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Graded">Graded</option>
            </select>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-56"
              />
            </div>
          </div>
        </div>
        
        {searchTerm && filteredStudents.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Search size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No students found matching "{searchTerm}"</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/20 backdrop-blur-sm">
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/20 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-sm text-slate-500">{student.email}</td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'Graded' 
                        ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20' 
                        : 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                    }`}>
                      {student.status || 'In Progress'}
                    </span>
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
    <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm">
      <div className="px-6 py-5 border-b border-white/30 flex justify-between items-center">
        <h2 className="text-base font-semibold text-slate-900">Viva Schedules</h2>
        <button 
          onClick={handleOpenScheduleModal}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          Schedule Viva
        </button>
      </div>
      
      <div className="p-6">
        {/* Students who completed internship */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            Students Ready for Viva
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students
              .filter(student => student.status === 'Internship Completed')
              .filter(student => !vivaSchedules.some(schedule => schedule.studentId === student._id))
              .map((student) => (
                <div key={student._id} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">{student.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full ring-1 ring-emerald-600/20">
                        {student.status || 'In Progress'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleScheduleViva(student)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" />
            Scheduled Vivas
          </h3>
          <div className="space-y-3">
            {vivaSchedules.length > 0 ? (
              vivaSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">{schedule.studentName}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          {schedule.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" />
                          {schedule.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Building size={12} className="text-slate-400" />
                          {schedule.venue}
                        </span>
                        {schedule.notes && (
                          <span className="flex items-center gap-1.5">
                            <FileText size={12} className="text-slate-400" />
                            {schedule.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ring-1 ${
                        schedule.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                          : schedule.status === 'Cancelled'
                          ? 'bg-red-50 text-red-700 ring-red-600/20'
                          : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                      }`}>
                        {schedule.status}
                      </span>
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Calendar size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm">No viva schedules yet. Schedule your first viva to get started.</p>
              </div>
            )}
          </div>
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
      <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm">
        <div className="px-6 py-5 border-b border-white/30 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">Internship Reports</h2>
          <div className="flex gap-2">
            <select 
              value={reportStatusFilter}
              onChange={(e) => setReportStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white"
            >
              <option>All Status</option>
              <option>Pending Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          {reportStatusFilter !== 'All Status' && filteredReports.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FileText size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No reports found with status "{reportStatusFilter}"</p>
            </div>
          )}
          
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">{report.studentName}</h3>
                    <div className="space-y-0.5 mt-2">
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Internship:</span> {report.internshipTitle}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Company:</span> {report.company}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">File:</span> {report.fileName} ({(report.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Submitted:</span> {report.submittedDate}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-600">Email:</span> {report.studentEmail}
                      </p>
                    </div>
                    {report.mark !== null && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                          <Award size={12} className="mr-1" />
                          Mark: {report.mark}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ring-1 ${
                      report.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : report.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 ring-red-600/20'
                        : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}>
                      {report.status}
                    </span>
                    <button 
                      onClick={() => window.open(`http://localhost:4000/api/report/download/${report.id}`, '_blank')}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Download Report"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={() => handleReviewReport(report)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Review Report"
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCompanyFeedbacks = () => (
    <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm">
      <div className="px-6 py-5 border-b border-white/30 flex justify-between items-center">
        <h2 className="text-base font-semibold text-slate-900">Company Feedbacks</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-600">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {companyFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-sm font-semibold text-slate-900">{feedback.studentName}</h3>
                    <span className="text-xs text-slate-500">{feedback.company}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-500 fill-current" />
                      <span className="text-xs font-medium text-slate-700">{feedback.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{feedback.feedback}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5">{feedback.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinalGrading = () => {
    // Filter students who have completed viva (regardless of internship status)
    const completedStudents = students.filter(student => {
      // Check if student has a completed viva schedule
      const vivaSchedule = vivaSchedules.find(vs => vs.studentId === student._id);
      return vivaSchedule && vivaSchedule.status === 'Completed';
    });

    // Split into graded and to-be-graded
    const toBeGraded = completedStudents.filter(student => student.status !== 'Graded');
    const graded = completedStudents.filter(student => student.status === 'Graded');

    const studentsToShow = gradingTab === 'to-be-graded' ? toBeGraded : graded;
    
    return (
      <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm">
        <div className="px-6 py-5 border-b border-white/30 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">Final Grading</h2>
          
          {/* Tab Switcher */}
          <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-0.5">
            <button
              onClick={() => setGradingTab('to-be-graded')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                gradingTab === 'to-be-graded'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              To be Graded ({toBeGraded.length})
            </button>
            <button
              onClick={() => setGradingTab('graded')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                gradingTab === 'graded'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Graded ({graded.length})
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentsToShow.map((student) => {
              const vivaSchedule = vivaSchedules.find(vs => vs.studentId === student._id);
              return (
                <div key={student._id} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{student.name}</h3>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ${
                        student.status === 'Graded' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                      }`}>
                        {student.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                        Viva Done
                      </span>
                    </div>
                  </div>
              
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Viva Score:</span>
                      <span className="font-medium text-slate-700">{student.vivaScore || '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Report Score:</span>
                      <span className="font-medium text-slate-700">{student.reportMark || '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Company Rating:</span>
                      <span className="font-medium text-slate-700">{student.companyRating ? `${student.companyRating}/5` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold pt-2 border-t border-white/20">
                      <span className="text-slate-600">Final Score:</span>
                      <span className="text-indigo-600">{student.finalScore ? `${student.finalScore.toFixed(1)}%` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Final Grade:</span>
                      <span className="text-indigo-600">{student.finalGrade || '-'}</span>
                    </div>
                  </div>
              
                  <button 
                    onClick={() => handleAssignGrade(student)}
                    className="w-full mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                  >
                    {student.status === 'Graded' ? 'Edit Grade' : 'Assign Grade'}
                  </button>
                </div>
              );
            })}
            
            {studentsToShow.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400">
                <Award size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm">
                  {gradingTab === 'to-be-graded' 
                    ? 'No students available for grading.' 
                    : 'No students have been graded yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'viva', label: 'Viva Schedule', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'feedbacks', label: 'Feedback', icon: Building },
    { id: 'grading', label: 'Final Grading', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Lecture Panel</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Internship Mgmt</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === link.id
                  ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="px-4 py-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 text-sm font-bold">
              {lecturerData?.fullName ? lecturerData.fullName.split(' ').map(n => n[0]).join('') : 'L'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{lecturerData?.fullName || 'Lecturer'}</p>
              <p className="text-[11px] text-slate-500">Lecturer</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md border-b border-white/30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {sidebarLinks.find(l => l.id === activeTab)?.label || 'Overview'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {activeTab === 'overview' && 'Dashboard analytics & performance insights'}
                {activeTab === 'students' && 'Manage & monitor student internships'}
                {activeTab === 'viva' && 'Schedule & track viva presentations'}
                {activeTab === 'reports' && 'Review & evaluate internship reports'}
                {activeTab === 'feedbacks' && 'Company feedback & ratings overview'}
                {activeTab === 'grading' && 'Assign & manage final grades'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'viva' && renderVivaSchedules()}
          {activeTab === 'reports' && renderInternshipReports()}
          {activeTab === 'feedbacks' && renderCompanyFeedbacks()}
          {activeTab === 'grading' && renderFinalGrading()}
        </div>
      </div>

      {/* Schedule Viva Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {selectedSchedule ? 'Edit Viva Schedule' : 'Schedule New Viva'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select
                  value={scheduleForm.studentId}
                  onChange={(e) => setScheduleForm({...scheduleForm, studentId: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white"
                  required
                >
                  <option value="">Select a student</option>
                  {students
                    .filter(student => 
                      companyFeedbacks.some(feedback => 
                        feedback.studentName?.toLowerCase() === student.name?.toLowerCase()
                      )
                    )
                    .map((student) => (
                      <option key={student._id} value={student._id}>
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
                  min={getTodayDate()}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                  min={scheduleForm.date === getTodayDate() ? getCurrentTime() : ''}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Venue *</label>
                <input
                  type="text"
                  placeholder="e.g., Room 101, Main Building"
                  value={scheduleForm.venue}
                  onChange={(e) => setScheduleForm({...scheduleForm, venue: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  minLength="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={scheduleForm.status}
                  onChange={(e) => setScheduleForm({...scheduleForm, status: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white"
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
                  maxLength="200"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
                  className="flex-1 px-4 py-2 border border-slate-200 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Review Internship Report</h3>
              
              {/* Student Information */}
              <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Student Name</p>
                    <p className="text-sm font-medium text-slate-900">{selectedReport.studentName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-slate-900">{selectedReport.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Internship</p>
                    <p className="text-sm font-medium text-slate-900">{selectedReport.internshipTitle}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Company</p>
                    <p className="text-sm font-medium text-slate-900">{selectedReport.company}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Submitted Date</p>
                    <p className="text-sm font-medium text-slate-900">{selectedReport.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Current Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ring-1 ${
                      selectedReport.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : selectedReport.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 ring-red-600/20'
                        : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Report Content</h4>
                <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedReport.reportContent}</p>
                </div>
              </div>

              {/* Review Form */}
              <div className="border-t border-white/20 pt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Evaluation</h4>
                
                <div className="space-y-4">
                  {/* Mark Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mark (out of 100%) *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={reviewForm.mark}
                        onChange={(e) => setReviewForm({...reviewForm, mark: e.target.value})}
                        placeholder="Enter mark (0-100)"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        required
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={reviewForm.mark || 0}
                          onChange={(e) => setReviewForm({...reviewForm, mark: e.target.value})}
                          className="w-32 accent-indigo-600"
                        />
                        <span className="text-sm font-medium text-slate-600 w-12">{reviewForm.mark || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Feedback (optional)
                    </label>
                    <textarea
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})}
                      placeholder="Provide feedback for the student..."
                      rows={4}
                      maxLength="500"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {reviewForm.feedback ? reviewForm.feedback.length : 0}/500 characters
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReport(null);
                        setReviewForm({ mark: '', feedback: '' });
                      }}
                      className="flex-1 px-4 py-2 border border-slate-200 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectReport}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Report
                    </button>
                    <button
                      onClick={handleSaveReview}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {selectedGradingStudent.finalGrade ? 'Edit Grade' : 'Assign Grade'} - {selectedGradingStudent.name}
            </h3>
            
            {/* Student Information */}
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Student Name</p>
                  <p className="text-sm font-medium text-slate-900">{selectedGradingStudent.name}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-slate-900">{selectedGradingStudent.email}</p>
                </div>
              </div>
            </div>

            {/* Grading Form */}
            <div className="space-y-6">
              {/* Report Mark (Manual Entry) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Report Score (out of 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={gradingForm.reportMark}
                  onChange={(e) => {
                    let reportMark = e.target.value;
                    // Validate and clamp to 0-100
                    const numValue = parseFloat(reportMark);
                    if (!isNaN(numValue)) {
                      if (numValue < 0) reportMark = '0';
                      if (numValue > 100) reportMark = '100';
                    }
                    
                    const finalScore = calculateFinalScore(
                      parseFloat(gradingForm.vivaScore || 0),
                      parseFloat(reportMark || 0),
                      parseFloat(gradingForm.companyRating || 0)
                    );
                    const finalGrade = calculateGrade(finalScore);
                    
                    setGradingForm({
                      ...gradingForm,
                      reportMark,
                      finalScore,
                      finalGrade
                    });
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Enter report score manually"
                  required
                />
              </div>

              {/* Company Rating (Auto-filled from feedback, editable) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Rating (out of 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={gradingForm.companyRating}
                  onChange={(e) => {
                    let companyRating = e.target.value;
                    // Validate and clamp to 0-100
                    const numValue = parseFloat(companyRating);
                    if (!isNaN(numValue)) {
                      if (numValue < 0) companyRating = '0';
                      if (numValue > 100) companyRating = '100';
                    }
                    
                    const finalScore = calculateFinalScore(
                      parseFloat(gradingForm.vivaScore || 0),
                      parseFloat(gradingForm.reportMark || 0),
                      parseFloat(companyRating || 0)
                    );
                    const finalGrade = calculateGrade(finalScore);
                    
                    setGradingForm({
                      ...gradingForm,
                      companyRating,
                      finalScore,
                      finalGrade
                    });
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Auto-filled from Company Feedback (rating * 20)"
                  required
                />
              </div>

              {/* Viva Score (Manual Entry) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Viva Score (out of 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={gradingForm.vivaScore}
                  onChange={(e) => {
                    let vivaScore = e.target.value;
                    // Validate and clamp to 0-100
                    const numValue = parseFloat(vivaScore);
                    if (!isNaN(numValue)) {
                      if (numValue < 0) vivaScore = '0';
                      if (numValue > 100) vivaScore = '100';
                    }
                    
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
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              {/* Auto-calculated Results */}
              {(gradingForm.vivaScore && gradingForm.reportMark && gradingForm.companyRating) && (
                <div className="bg-indigo-500/10 backdrop-blur-sm rounded-lg p-4 border border-indigo-200/30">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Calculated Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Final Score</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {gradingForm.finalScore.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Final Grade</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {gradingForm.finalGrade}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
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
                  className="flex-1 px-4 py-2 border border-slate-200 text-sm text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
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
