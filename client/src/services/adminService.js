import axios from "axios";
import { API_BASE } from "../config/api.js";

/** Auth + backup + notifications stay under /api/admin (module integration uses /api/*). */
const adminUrl = `${API_BASE}/api/admin`;
const apiUrl = `${API_BASE}/api`;

axios.defaults.withCredentials = true;

export const adminService = {
  registerAdmin: async (payload) => {
    const { data } = await axios.post(`${adminUrl}/register`, payload);
    return data;
  },
  getDashboard: async () => {
    const { data } = await axios.get(`${apiUrl}/dashboard`);
    return data;
  },
  getUsers: async () => {
    const { data } = await axios.get(`${apiUrl}/users`);
    return data;
  },
  createUser: async (payload) => {
    const { data } = await axios.post(`${apiUrl}/users`, payload);
    return data;
  },
  patchUser: async (userId, payload) => {
    const { data } = await axios.patch(`${apiUrl}/users/${userId}`, payload);
    return data;
  },
  deleteUser: async (userId) => {
    const { data } = await axios.delete(`${apiUrl}/users/${userId}`);
    return data;
  },
  seedDemoUsers: async () => {
    const { data } = await axios.post(`${apiUrl}/users/seed`);
    return data;
  },
  getRoles: async () => {
    const { data } = await axios.get(`${apiUrl}/roles`);
    return data;
  },
  updateRole: async (userId, role) => {
    const { data } = await axios.patch(`${apiUrl}/roles/${userId}`, { role });
    return data;
  },
  getConfig: async () => {
    const { data } = await axios.get(`${apiUrl}/config`);
    return data;
  },
  saveConfig: async (payload) => {
    const { data } = await axios.post(`${apiUrl}/config`, payload);
    return data;
  },
  getBackupStatus: async () => {
    const { data } = await axios.get(`${adminUrl}/backup`);
    return data;
  },
  createBackup: async () => {
    const { data } = await axios.post(`${adminUrl}/backup`);
    return data;
  },
  restoreBackup: async () => {
    const { data } = await axios.post(`${adminUrl}/backup/restore`);
    return data;
  },
  getNotifications: async (params) => {
    const { data } = await axios.get(`${adminUrl}/notifications`, { params });
    return data;
  },
  createNotification: async (payload) => {
    const { data } = await axios.post(`${adminUrl}/notifications`, payload);
    return data;
  },
  getInternships: async () => {
    const { data } = await axios.get(`${apiUrl}/internships`);
    return data;
  },
  patchInternshipStatus: async (id, status) => {
    const { data } = await axios.patch(`${apiUrl}/internships/${id}`, { status });
    return data;
  },
  seedInternships: async () => {
    const { data } = await axios.post(`${apiUrl}/internships/seed`);
    return data;
  },
  getAnalytics: async () => {
    const { data } = await axios.get(`${apiUrl}/analytics`);
    return data;
  },
  getReportsJson: async () => {
    const { data } = await axios.get(`${apiUrl}/reports`);
    return data;
  },
  downloadReportCsv: async (which) => {
    const path = which === "students" ? "students.csv" : "internships.csv";
    const res = await axios.get(`${apiUrl}/reports/${path}`, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = which === "students" ? "student-report.csv" : "internship-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  },
};
