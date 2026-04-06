import React from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/useAdmin";
import { adminService } from "../../services/adminService";

const BackupRestore = () => {
  const { backupStatus, fetchBackupStatus } = useAdmin();

  const onBackup = async () => {
    try {
      const response = await adminService.createBackup();
      if (response.success) {
        toast.success("Backup completed");
        fetchBackupStatus();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Backup failed");
    }
  };

  const onRestore = async () => {
    // @validation — Restore disabled when no backup; confirm dialog before restore
    if (!backupStatus.hasBackup) return;
    const confirmed = window.confirm("Are you sure you want to restore the latest backup?");
    if (!confirmed) return;

    try {
      const response = await adminService.restoreBackup();
      if (response.success) {
        toast.success("Restore completed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Restore failed");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900">Backup & Restore</h2>
      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <p className="text-sm text-slate-700">
          Last Backup Date:{" "}
          <span className="font-semibold">
            {backupStatus.lastBackupAt ? new Date(backupStatus.lastBackupAt).toLocaleString() : "No backup available"}
          </span>
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBackup}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Run Backup
          </button>
          <button
            type="button"
            onClick={onRestore}
            disabled={!backupStatus.hasBackup}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              backupStatus.hasBackup ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Restore Backup
          </button>
        </div>
      </div>
    </section>
  );
};

export default BackupRestore;
