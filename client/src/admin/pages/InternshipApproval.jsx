import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";

const InternshipApproval = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getInternships();
      if (res.success) setRows(res.data || []);
    } catch {
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    try {
      const res = await adminService.patchInternshipStatus(id, status);
      if (res.success) {
        toast.success(`Internship ${status.toLowerCase()}`);
        load();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  const seed = async () => {
    try {
      const res = await adminService.seedInternships();
      if (res.success) {
        toast.success(res.message || "Sample data ready");
        load();
      }
    } catch {
      toast.error("Could not add sample data");
    }
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Internship approval</h2>
        <button
          type="button"
          onClick={seed}
          className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
        >
          Load sample internships
        </button>
      </div>
      <p className="mb-4 text-sm font-medium text-slate-600">
        Review submitted postings. Approve or reject each internship before it is visible to students.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full bg-white">
          <thead className="bg-slate-50">
            <tr>
              {["Company name", "Position", "Status", "Submitted", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((r) => (
                <tr key={r._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.companyName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.position}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {r.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                            onClick={() => setStatus(r._id, "Approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                            onClick={() => setStatus(r._id, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.status !== "Pending" && (
                        <span className="text-xs text-slate-400">No action</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No internship submissions yet. Use &quot;Load sample internships&quot; for a demo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InternshipApproval;
