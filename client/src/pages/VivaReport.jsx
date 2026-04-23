import React, { useContext, useState, useEffect } from 'react';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentNavigation from '../components/StudentNavigation';

function VivaReport() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [vivaSchedule, setVivaSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch viva schedule
  useEffect(() => {
    const fetchVivaSchedule = async () => {
      try {
        setIsLoading(true);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get('http://localhost:4000/api/viva-schedule/student');
        if (data.success && data.data) {
          setVivaSchedule(data.data);
        }
      } catch (error) {
        console.error('Error fetching viva schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchVivaSchedule();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 font-sans selection:bg-purple-100 selection:text-purple-900 text-slate-900">
      
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
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

      </main>
    </div>
  );
}

export default VivaReport;
