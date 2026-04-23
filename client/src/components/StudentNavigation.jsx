import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Briefcase, 
  FolderOpen,
  Calendar,
  LogOut, 
  ShieldAlert
} from 'lucide-react';
import Logo from '../assets/TalenTracerLogo2.png';

function StudentNavigation() {
  const { userData, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      localStorage.removeItem('customer');
      const { data } = await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }).then(res => res.json());

      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await fetch('http://localhost:4000/api/auth/send-verify-otp', {
        method: 'POST',
        credentials: 'include'
      }).then(res => res.json());
      if (data.success) {
        navigate('/email-verify');
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  if (!userData) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <a href="/customer-home" className="hover:opacity-80 transition-opacity">
            <img src={Logo} alt="TalentTracer" className="w-28 select-none" />
          </a>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Dashboard', path: '/customer-home', icon: LayoutDashboard },
              { label: 'Readiness', path: '/readiness', icon: ClipboardCheck },
              { label: 'Job Board', path: '/jobs', icon: Briefcase },
              { label: 'Portfolio', path: '/portfolio', icon: FolderOpen },
              { label: 'Viva & Report', path: '/viva-report', icon: Calendar },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === item.path 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <button 
              onClick={() => navigate('/my-profile')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 group-hover:border-indigo-200 transition-colors">
                {getInitials(userData.name)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[13px] font-bold leading-none">{userData.name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Student</p>
              </div>
            </button>
            
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavigation;
