import React, { useCallback, useEffect, useState } from "react";
import NotificationForm from "../../components/NotificationForm";
import NotificationTable from "../../components/NotificationTable";
import { adminService } from "../../services/adminService";

/**
 * USIMS Admin — Notification Management (compose + history table).
 * List loads in the background so the page renders immediately.
 */
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadNotifications = useCallback(async () => {
    setListLoading(true);
    setLoadError(null);
    try {
      const res = await adminService.getNotifications();
      if (res.success) {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } else {
        const msg = res.message || "Could not load notifications";
        setLoadError(msg);
        setNotifications([]);
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Could not load notifications";
      setLoadError(msg);
      setNotifications([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-bold text-indigo-950 md:text-2xl">Notification management</h1>
        <p className="mt-1 text-sm text-slate-600">
          Send announcements to user groups and review past notifications.
        </p>
      </header>

      <NotificationForm onSent={loadNotifications} />

      {loadError && (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="alert"
        >
          <p className="font-semibold">Could not refresh the list</p>
          <p className="mt-1 text-amber-800">{loadError}</p>
          <button
            type="button"
            onClick={() => loadNotifications()}
            className="mt-2 text-sm font-semibold text-indigo-700 underline hover:text-indigo-900"
          >
            Try again
          </button>
        </div>
      )}

      <NotificationTable notifications={notifications} loading={listLoading} />
    </div>
  );
};

export default NotificationPage;
