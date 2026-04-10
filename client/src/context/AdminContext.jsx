/* eslint-disable react-refresh/only-export-components -- AdminContext is consumed only by useAdmin.js */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { adminService } from "../services/adminService";

const defaultConfig = {
  minGpaRequirement: 2.5,
  internshipDurationMonths: 6,
  evalWeightTechnical: 40,
  evalWeightCommunication: 35,
  evalWeightAttendance: 25,
};

const emptySummary = {
  totalUsers: 0,
  totalStudents: 0,
  totalCompanies: 0,
  activeInternships: 0,
  placementRate: 0,
};

const emptyDashboard = {
  summary: { ...emptySummary },
  recentActivities: [],
  chartData: [],
  placementTrend: [],
};

export const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({ ...emptyDashboard });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [config, setConfig] = useState(defaultConfig);
  const [backupStatus, setBackupStatus] = useState({ hasBackup: false, lastBackupAt: null });
  const [loading, setLoading] = useState(false);

  const withLoader = async (task) => {
    setLoading(true);
    try {
      return await task();
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = useCallback(async () => {
    return withLoader(async () => {
      try {
        const response = await adminService.getDashboard();
        if (response.success && response.data) {
          const d = response.data;
          setDashboardData({
            summary: { ...emptySummary, ...(d.summary || {}) },
            recentActivities: Array.isArray(d.recentActivities) ? d.recentActivities : [],
            chartData: Array.isArray(d.chartData) ? d.chartData : [],
            placementTrend: Array.isArray(d.placementTrend) ? d.placementTrend : [],
          });
        }
        return response;
      } catch {
        return { success: false };
      }
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    return withLoader(async () => {
      try {
        const response = await adminService.getUsers();
        if (response.success) setUsers(response.data);
        return response;
      } catch {
        return { success: false };
      }
    });
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await adminService.getRoles();
      if (response.success) setRoles(response.data);
      return response;
    } catch {
      return { success: false };
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const response = await adminService.getConfig();
      if (response.success && response.data) {
        const d = response.data;
        setConfig({
          minGpaRequirement:
            typeof d.minGpaRequirement === "number" ? d.minGpaRequirement : defaultConfig.minGpaRequirement,
          internshipDurationMonths:
            typeof d.internshipDurationMonths === "number"
              ? d.internshipDurationMonths
              : defaultConfig.internshipDurationMonths,
          evalWeightTechnical:
            typeof d.evalWeightTechnical === "number" ? d.evalWeightTechnical : defaultConfig.evalWeightTechnical,
          evalWeightCommunication:
            typeof d.evalWeightCommunication === "number"
              ? d.evalWeightCommunication
              : defaultConfig.evalWeightCommunication,
          evalWeightAttendance:
            typeof d.evalWeightAttendance === "number"
              ? d.evalWeightAttendance
              : defaultConfig.evalWeightAttendance,
        });
      }
      return response;
    } catch {
      return { success: false };
    }
  }, []);

  const fetchBackupStatus = useCallback(async () => {
    try {
      const response = await adminService.getBackupStatus();
      if (response.success) setBackupStatus(response.data);
      return response;
    } catch {
      return { success: false };
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchRoles();
    fetchConfig();
    fetchBackupStatus();
  }, [fetchBackupStatus, fetchConfig, fetchDashboard, fetchRoles, fetchUsers]);

  const contextValue = useMemo(
    () => ({
      dashboardData,
      users,
      roles,
      config,
      backupStatus,
      loading,
      setUsers,
      setConfig,
      setBackupStatus,
      fetchDashboard,
      fetchUsers,
      fetchRoles,
      fetchConfig,
      fetchBackupStatus,
    }),
    [
      backupStatus,
      config,
      dashboardData,
      fetchBackupStatus,
      fetchConfig,
      fetchDashboard,
      fetchRoles,
      fetchUsers,
      loading,
      roles,
      users,
    ]
  );

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
};
