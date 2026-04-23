import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from '../components/StudentNavigation';

function StudentReadiness() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  // Readiness State
  const [readinessData, setReadinessData] = useState(null);
  const [isFetchingReadiness, setIsFetchingReadiness] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [cvUrl, setCvUrl] = useState('');
  const [academicPerformance, setAcademicPerformance] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [currentGpa, setCurrentGpa] = useState('');
  const [otherSkills, setOtherSkills] = useState('');
  const [academicAchievements, setAcademicAchievements] = useState('');

  // Fetch the student's evaluation status
  const fetchMyReadiness = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get('http://localhost:4000/api/readiness/my-status');

      if (data.success) {
        setReadinessData(data.data);
        setCvUrl(data.data.cvUrl || '');
        setAcademicPerformance(data.data.academicPerformance || '');
        setYear(data.data.year || '');
        setSemester(data.data.semester || '');
        setCurrentGpa(data.data.currentGpa || '');
        setOtherSkills(data.data.otherSkills?.join(', ') || '');
        setAcademicAchievements(data.data.academicAchievements?.join(', ') || '');
      } else {
        setReadinessData(null);
      }
    } catch (error) {
      console.error("Error fetching readiness:", error);
    } finally {
      setIsFetchingReadiness(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchMyReadiness();
    }
  }, [userData]);

  // Handle CV Submission
  const handleSubmitReadiness = async (e) => {
    e.preventDefault();

    // 1. Trim whitespace to prevent empty space submissions
    const trimmedCvUrl = cvUrl.trim();
    const trimmedAcademic = academicPerformance.trim();
    const trimmedGpa = currentGpa.trim();
    const trimmedSkills = otherSkills.trim();
    const trimmedAchievements = academicAchievements.trim();

    // 2. Empty check for required fields
    if (!trimmedCvUrl) {
      return toast.error("Please provide a CV link.");
    }

    // 3. Strict URL Format Validation (Regex)
    const urlPattern = /^(https?:\/\/)?([\w\d\-_]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(trimmedCvUrl)) {
      return toast.error("Please enter a valid web URL (e.g., https://drive.google.com/...).");
    }

    // 4. Strict GPA / Numeric Validation (Between 0 and 4)
    if (trimmedGpa) {
      const gpaValue = parseFloat(trimmedGpa);
      if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
        return toast.error("GPA must be a valid number between 0 and 4 (e.g., 3.5).");
      }
    }

    try {
      setIsSubmitting(true);
      axios.defaults.withCredentials = true;

      const payload = {
        cvUrl: trimmedCvUrl,
        academicPerformance: trimmedAcademic,
        year: year,
        semester: semester,
        currentGpa: trimmedGpa ? parseFloat(trimmedGpa) : 0,
        otherSkills: trimmedSkills ? trimmedSkills.split(',').map(s => s.trim()).filter(s => s) : [],
        academicAchievements: trimmedAchievements ? trimmedAchievements.split(',').map(s => s.trim()).filter(s => s) : [],
        studentId: userData.id,
        userId: userData.id
      };

      const { data } = await axios.post('http://localhost:4000/api/readiness/submit', payload);

      if (data.success) {
        toast.success(data.message);
        fetchMyReadiness(); // Refresh data to show "In Review" status
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        Page is Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      <StudentNavigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 ">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              onClick={() => navigate('/customer-home')}
              className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-semibold transition"
            >
              <span className="text-lg">←</span>
              Back to Dashboard
            </button>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Internship Readiness</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Submit your CV/portfolio and academic summary to be evaluated for internship eligibility.
            </p>
          </div>

          {readinessData && (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border shadow-sm ${readinessData.status === 'Ready'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : readinessData.status === 'In Review'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {readinessData.status}
            </span>
          )}
        </div>

        {readinessData && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Eligibility</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{readinessData.isEligible ? 'Approved' : 'Pending'}</p>
              <p className="mt-1 text-xs text-slate-500">Based on your latest evaluation</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Skill gaps</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{readinessData.skillGaps.length}</p>
              <p className="mt-1 text-xs text-slate-500">Areas to improve</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Suggested courses</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{readinessData.suggestedCourses.length}</p>
              <p className="mt-1 text-xs text-slate-500">Recommended actions</p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Your submission</h2>
                  <p className="mt-1 text-sm text-slate-600">Add a shareable link and keep it up to date.</p>
                </div>
                <div className="hidden sm:block text-xs text-slate-500">* Required fields</div>
              </div>

              <div className="mt-6">
                {isFetchingReadiness ? (
                  <div className="flex justify-center py-10">Page is Loading...</div>
                ) : (
                  <form onSubmit={handleSubmitReadiness} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">CV / Portfolio Link *</label>
                      <input
                        type="url"
                        value={cvUrl}
                        onChange={(e) => setCvUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                      <p className="mt-2 text-xs text-slate-500">Tip: Make sure your link permissions allow viewing.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">Academic Performance (GPA)</label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={academicPerformance}
                        onChange={(e) => setAcademicPerformance(e.target.value)}
                        placeholder="e.g., 3.5"
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">Year</label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        >
                          <option value="">Select Year</option>
                          <option value="1">Year 1</option>
                          <option value="2">Year 2</option>
                          <option value="3">Year 3</option>
                          <option value="4">Year 4</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">Semester</label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        >
                          <option value="">Select Semester</option>
                          <option value="1">Semester 1</option>
                          <option value="2">Semester 2</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">Current GPA</label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={currentGpa}
                        onChange={(e) => setCurrentGpa(e.target.value)}
                        placeholder="e.g., 3.5"
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">Other Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={otherSkills}
                        onChange={(e) => setOtherSkills(e.target.value)}
                        placeholder="e.g., JavaScript, Python, React"
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">Academic Achievements/Diplomas (comma-separated)</label>
                      <input
                        type="text"
                        value={academicAchievements}
                        onChange={(e) => setAcademicAchievements(e.target.value)}
                        placeholder="e.g., Dean's List, AWS Certification"
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-70"
                      >
                        {isSubmitting ? 'Submitting...' : readinessData ? 'Update Submission' : 'Submit for Review'}
                      </button>
                      <div className="inline-flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Saved to your profile
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {readinessData && (readinessData.skillGaps.length > 0 || readinessData.interviewNotes) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-lg font-bold text-slate-900">Evaluation Feedback</h4>
                  <span className="text-xs text-slate-500">From admin review</span>
                </div>

                <div className="mt-4 space-y-6">
                  {readinessData.skillGaps.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">Identified Skill Gaps</p>
                      <div className="flex flex-wrap gap-2">
                        {readinessData.skillGaps.map((gap, i) => (
                          <span key={i} className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg text-sm font-medium border border-rose-200">{gap}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {readinessData.suggestedCourses.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">Suggested Action Plan / Courses</p>
                      <div className="flex flex-wrap gap-2">
                        {readinessData.suggestedCourses.map((course, i) => (
                          <span key={i} className="bg-sky-50 text-sky-700 px-3 py-1 rounded-lg text-sm font-medium border border-sky-200">{course}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {readinessData.interviewNotes && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">Interview Notes</p>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 italic">
                        "{readinessData.interviewNotes}"
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-6 ${readinessData.isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                      }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">Internship Eligibility</p>
                      <p className="text-sm text-slate-600 mt-1">
                        {readinessData.isEligible
                          ? "Congratulations! You are approved to proceed to the internship phase."
                          : "You must complete the suggested actions above to gain eligibility."}
                      </p>
                    </div>
                    <div className="text-4xl">
                      {readinessData.isEligible ? '🎉' : '⏳'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <h3 className="text-base font-bold text-slate-900">Guidelines</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-inside">
                <li>Share a public CV/portfolio link (Drive, GitHub, Behance, etc.).</li>
                <li>Include latest academics and certifications.</li>
                <li>Keep updates concise; revise anytime before review.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-md">
              <h3 className="text-base font-bold text-slate-900">What happens next?</h3>
              <p className="mt-2 text-sm text-slate-700">
                Once submitted, your status will change to <span className="font-semibold text-slate-900">In Review</span>. You’ll see feedback and eligibility updates here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentReadiness;