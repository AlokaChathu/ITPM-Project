import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, FileText, Activity, Calendar } from "lucide-react";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    internshipStats: [],
    activityData: [],
    performanceMetrics: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    // Mock analytics data loading
    setTimeout(() => {
      setAnalyticsData({
        userGrowth: [
          { date: '2024-01-01', users: 850, newUsers: 25 },
          { date: '2024-01-08', users: 875, newUsers: 30 },
          { date: '2024-01-15', users: 910, newUsers: 35 },
          { date: '2024-01-22', users: 950, newUsers: 40 },
          { date: '2024-01-29', users: 1000, newUsers: 50 }
        ],
        internshipStats: [
          { status: 'Pending', count: 15, percentage: 12 },
          { status: 'Approved', count: 85, percentage: 68 },
          { status: 'Rejected', count: 25, percentage: 20 }
        ],
        activityData: [
          { day: 'Mon', logins: 120, applications: 45 },
          { day: 'Tue', logins: 150, applications: 52 },
          { day: 'Wed', logins: 180, applications: 58 },
          { day: 'Thu', logins: 165, applications: 48 },
          { day: 'Fri', logins: 140, applications: 42 },
          { day: 'Sat', logins: 80, applications: 25 },
          { day: 'Sun', logins: 60, applications: 20 }
        ],
        performanceMetrics: {
          avgResponseTime: "2.3s",
          systemUptime: "99.8%",
          errorRate: "0.2%",
          userSatisfaction: "4.6/5.0"
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="h-4 w-4" />
            Analytics Overview
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,250</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">320</p>
          <p className="text-sm text-gray-600">Active Internships</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+15%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">890</p>
          <p className="text-sm text-gray-600">Daily Active Users</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+22%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">245</p>
          <p className="text-sm text-gray-600">Applications/Week</p>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
        <div className="space-y-4">
          {analyticsData.userGrowth.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {new Date(data.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-medium text-gray-900">{data.users}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">New:</span>
                  <span className="font-medium text-green-600">+{data.newUsers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internship Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Status</h3>
          <div className="space-y-3">
            {analyticsData.internshipStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    stat.status === 'Approved' ? 'bg-green-500' :
                    stat.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{stat.status}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">{stat.count}</span>
                  <span className="text-sm text-gray-600">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {analyticsData.activityData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{data.day}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{data.logins} logins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{data.applications} apps</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{analyticsData.performanceMetrics.avgResponseTime}</p>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{analyticsData.performanceMetrics.systemUptime}</p>
            <p className="text-sm text-gray-600">System Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{analyticsData.performanceMetrics.errorRate}</p>
            <p className="text-sm text-gray-600">Error Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{analyticsData.performanceMetrics.userSatisfaction}</p>
            <p className="text-sm text-gray-600">User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Analytics</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <FileText className="h-4 w-4" />
            Export as PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <BarChart3 className="h-4 w-4" />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
