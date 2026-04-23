import React, { useContext, useState, useEffect } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, FileText, Upload, Trash2, Download, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentNavigation from '../components/StudentNavigation';

function VivaReport() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [vivaSchedule, setVivaSchedule] = useState(null);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [internshipTitle, setInternshipTitle] = useState('');
  const [company, setCompany] = useState('');

  // Fetch viva schedule and report
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        axios.defaults.withCredentials = true;
        
        // Fetch viva schedule
        const vivaResponse = await axios.get('http://localhost:4000/api/viva-schedule/student');
        if (vivaResponse.data.success && vivaResponse.data.data) {
          setVivaSchedule(vivaResponse.data.data);
        }

        // Fetch student report
        const reportResponse = await axios.get('http://localhost:4000/api/report/student');
        console.log('Student report response:', reportResponse.data);
        if (reportResponse.data.success) {
          setReport(reportResponse.data.data);
          if (reportResponse.data.data) {
            setInternshipTitle(reportResponse.data.data.internshipTitle || '');
            setCompany(reportResponse.data.data.company || '');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchData();
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <LoadingSpinner />
        <p className="text-slate-400 font-light mt-4 tracking-widest uppercase text-xs">Loading Viva Schedule</p>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    if (!internshipTitle.trim()) {
      toast.error('Please enter internship title');
      return;
    }
    if (!company.trim()) {
      toast.error('Please enter company name');
      return;
    }

    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('studentId', userData.id);
    formData.append('studentName', userData.name);
    formData.append('studentEmail', userData.email);
    formData.append('internshipTitle', internshipTitle);
    formData.append('company', company);

    try {
      setIsUploading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/report/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success('Report uploaded successfully');
        setReport(data.data);
        setSelectedFile(null);
      } else {
        toast.error(data.message || 'Failed to upload report');
      }
    } catch (error) {
      console.error('Error uploading report:', error);
      toast.error('Failed to upload report');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('report', selectedFile);

    try {
      setIsUploading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`http://localhost:4000/api/report/update/${report._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success('Report updated successfully');
        setReport(data.data);
        setSelectedFile(null);
      } else {
        toast.error(data.message || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`http://localhost:4000/api/report/${report._id}`);

      if (data.success) {
        toast.success('Report deleted successfully');
        setReport(null);
        setInternshipTitle('');
        setCompany('');
      } else {
        toast.error(data.message || 'Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const handleDownload = () => {
    window.open(`http://localhost:4000/api/report/download/${report._id}`, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 font-sans selection:bg-purple-100 selection:text-purple-900 text-slate-900">
      
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        
        {/* Viva Schedule Section */}
        {vivaSchedule ? (
          <div className="bg-white rounded-[2rem] p-10 border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-start gap-8 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Calendar size={40} strokeWidth={1.5} className="text-white" />
              </div>
              <div>
                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-black uppercase tracking-wider rounded-full mb-3">
                  Viva Has Scheduled
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your viva has been scheduled</h2>
                <p className="text-slate-500 mt-1">Please review the details below and prepare accordingly.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar size={20} className="text-purple-600" />
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Date</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{vivaSchedule.date}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={20} className="text-purple-600" />
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Time</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{vivaSchedule.time}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={20} className="text-purple-600" />
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Venue</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{vivaSchedule.venue}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={20} className="text-purple-600" />
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Status</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{vivaSchedule.status}</p>
              </div>
            </div>

            {vivaSchedule.notes && (
              <div className="mt-6 bg-slate-50 rounded-xl p-6 border border-slate-100">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">Notes</span>
                <p className="text-slate-700 leading-relaxed">{vivaSchedule.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} strokeWidth={1.5} className="text-slate-400" />
            </div>
            <div className="inline-block px-4 py-2 bg-slate-100 text-slate-500 text-sm font-black uppercase tracking-wider rounded-full mb-4">
              No Viva Has Scheduled
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No viva scheduled yet</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Your viva schedule will appear here once it's scheduled by the lecture. Please check back later.
            </p>
          </div>
        )}

        {/* Report Upload Section */}
        <div className="bg-white rounded-[2rem] p-10 border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileText size={40} strokeWidth={1.5} className="text-white" />
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-black uppercase tracking-wider rounded-full mb-3">
                Internship Report
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Submit your internship report</h2>
              <p className="text-slate-500 mt-1">Upload your PDF report (max 10MB). You can update or delete it anytime before grading.</p>
            </div>
          </div>

          {report ? (
            /* Report Already Uploaded */
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{report.fileName}</h3>
                  <p className="text-sm text-slate-500">
                    {formatFileSize(report.fileSize)} • Submitted: {new Date(report.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report.status === 'Approved' 
                    ? 'bg-green-100 text-green-800'
                    : report.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>

              {report.mark !== null && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-green-800">Mark: {report.mark}%</p>
                  {report.feedback && <p className="text-sm text-green-700 mt-1">{report.feedback}</p>}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer">
                  <Upload size={16} />
                  Update
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={handleUpdate}
                      disabled={isUploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? 'Updating...' : 'Confirm Update'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Upload Form */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Internship Title</label>
                  <input
                    type="text"
                    value={internshipTitle}
                    onChange={(e) => setInternshipTitle(e.target.value)}
                    placeholder="Enter internship title"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-slate-400 text-sm">PDF files only (max 10MB)</p>
                </label>
              </div>

              {selectedFile && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{selectedFile.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Report'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default VivaReport;
