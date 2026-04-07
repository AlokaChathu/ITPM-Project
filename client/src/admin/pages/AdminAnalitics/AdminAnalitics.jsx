import React, { useEffect, useState } from "react";
import { BarChart3, Users, FileText, TrendingUp, Database, ShieldCheck, Activity } from "lucide-react";

const AdminAnalitics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInternships: 0,
    activeInternships: 0,
    pendingApprovals: 0,
    systemHealth: "Good",
    lastBackup: "2024-01-15"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - replace with actual API calls
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        activeUsers: 890,
        totalInternships: 450,
        activeInternships: 320,
        pendingApprovals: 15,
        systemHealth: "Excellent",
        lastBackup: new Date().toISOString().split('T')[0]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <Activity className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Total Internships",
      value: stats.totalInternships,
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Active Internships",
      value: stats.activeInternships,
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: <ShieldCheck className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "System Health",
      value: stats.systemHealth,
      icon: <Database className="h-8 w-8 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Analitics Dashboard</h1>
        <p className="text-gray-600">University Internship Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl border ${stat.color} bg-white shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-gray-400">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">System backup completed</p>
              <p className="text-xs text-gray-500">{stats.lastBackup}</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Success
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">New user registration</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="text-sm text-blue-600">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Info
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Internship approved</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
            <div className="text-sm text-green-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Success
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalitics;
