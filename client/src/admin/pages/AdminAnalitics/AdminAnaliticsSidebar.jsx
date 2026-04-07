import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Database,
  Bell,
  ShieldCheck,
  Archive,
  BarChart3
} from "lucide-react";

const AdminAnaliticsSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin/analytics"
    },
    {
      title: "User Management",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/analytics/users"
    },
    {
      title: "Reports",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/analytics/reports"
    },
    {
      title: "System Configuration",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/analytics/config"
    },
    {
      title: "Backup & Restore",
      icon: <Archive className="h-5 w-5" />,
      path: "/admin/analytics/backup"
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      path: "/admin/analytics/notifications"
    },
    {
      title: "Role Management",
      icon: <ShieldCheck className="h-5 w-5" />,
      path: "/admin/analytics/roles"
    },
    {
      title: "Internship Approval",
      icon: <Database className="h-5 w-5" />,
      path: "/admin/analytics/internships"
    },
    {
      title: "Advanced Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin/analytics/analytics"
    }
  ];

  return (
    <aside className="w-full lg:w-64 rounded-xl border border-white/60 bg-white/90 p-4 shadow-md shadow-indigo-950/5 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-indigo-950 mb-2">Admin Analitics</h2>
        <p className="text-xs text-slate-600">System Administration</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminAnaliticsSidebar;
