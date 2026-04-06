import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
} from "recharts";
import { adminService } from "../../services/adminService";

const PIE_COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#a855f7"];

const empty = {
  summary: {},
  placementTrend: [],
  studentPerformance: [],
  internshipDistribution: [],
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnalytics();
      if (res.success && res.data) {
        setData({
          summary: res.data.summary || {},
          placementTrend: Array.isArray(res.data.placementTrend) ? res.data.placementTrend : [],
          studentPerformance: Array.isArray(res.data.studentPerformance) ? res.data.studentPerformance : [],
          internshipDistribution: Array.isArray(res.data.internshipDistribution)
            ? res.data.internshipDistribution
            : [],
        });
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { summary, placementTrend, studentPerformance, internshipDistribution } = data;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Analytics</h2>
        {loading && <p className="text-sm font-medium text-slate-500">Loading…</p>}
      </div>

      <p className="mb-4 text-sm text-slate-600">
        Placement rate (current):{" "}
        <span className="font-semibold text-indigo-700">{summary.placementRate ?? "—"}%</span>
        {summary.totalStudents != null && (
          <span className="ml-2 text-slate-500">· Students in system: {summary.totalStudents}</span>
        )}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Placement rate trend</h3>
          <div className="mt-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={placementTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, "Rate"]} />
                <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Student performance (GPA bands)</h3>
          <div className="mt-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentPerformance} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="band" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Internship categories</h3>
        <p className="mb-2 text-xs text-slate-500">Distribution by category (from submissions)</p>
        <div className="mx-auto h-72 max-w-md">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={internshipDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
              >
                {internshipDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
