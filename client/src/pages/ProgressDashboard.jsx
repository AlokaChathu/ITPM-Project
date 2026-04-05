import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function ProgressDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await axios.get("http://localhost:4000/api/dashboard/student", {
        withCredentials: true,
      });
      setDashboard(data.dashboard);
    };

    fetchDashboard();
  }, []);

  if (!dashboard) return <p className="p-6">Loading...</p>;
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Progress Dashboard</h1>
      <BackButton/>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 shadow rounded bg-white">Total Internships: {dashboard.totalInternships}</div>
        <div className="p-4 shadow rounded bg-white">Active Internships: {dashboard.activeInternships}</div>
        <div className="p-4 shadow rounded bg-white">Completed Internships: {dashboard.completedInternships}</div>
        <div className="p-4 shadow rounded bg-white">Total Reports: {dashboard.totalReports}</div>
        <div className="p-4 shadow rounded bg-white">Open Issues: {dashboard.openIssues}</div>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Alerts</h2>
      {dashboard.alerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        dashboard.alerts.map((alert) => (
          <div key={alert.internshipId} className="border p-4 rounded mb-3 bg-yellow-50">
            <p><strong>{alert.title}</strong></p>
            <p>Missing Reports: {alert.missingReports}</p>
            <p>Inactivity Alert: {alert.inactivityAlert ? "Yes" : "No"}</p>
          </div>
        ))
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-3">Notifications</h2>
      {dashboard.notifications.map((n) => (
        <div key={n._id} className="border p-3 rounded mb-2 bg-white">
          <p><strong>{n.type}</strong></p>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export default ProgressDashboard;