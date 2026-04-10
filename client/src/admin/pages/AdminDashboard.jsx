import React from "react";
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
} from "recharts";
import { useAdmin } from "../../context/useAdmin";
import SummaryCard from "../../components/admin/SummaryCard";

const AdminDashboard = () => {
  const { dashboardData, loading } = useAdmin();
  const { summary, recentActivities, chartData, placementTrend = [] } = dashboardData;
  const placementRate = summary.placementRate ?? 0;

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Admin dashboard</h2>
        {loading && <p className="text-sm font-medium text-slate-500">Loading data…</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total students" value={summary.totalStudents} accent="bg-emerald-500" />
        <SummaryCard label="Total companies" value={summary.totalCompanies} accent="bg-indigo-500" />
        <SummaryCard label="Active internships" value={summary.activeInternships ?? 0} accent="bg-amber-500" />
        <SummaryCard label="Placement rate" value={`${placementRate}%`} accent="bg-violet-500" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Placement rate trend</h3>
          <p className="mb-3 text-xs font-medium text-slate-500">Six-month overview</p>
          <div className="h-56 w-full">
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
          <h3 className="text-lg font-semibold text-slate-800">User growth (system)</h3>
          <p className="mb-3 text-xs font-medium text-slate-500">Registered users by period</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Recent activities</h3>
        <ul className="mt-4 space-y-3">
          {recentActivities.length === 0 && (
            <li className="text-sm font-medium text-slate-500">No recent activities yet.</li>
          )}
          {recentActivities.map((item) => (
            <li key={item._id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-800">{item.action}</p>
              <p className="text-xs font-medium text-slate-500">{item.target}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AdminDashboard;
