import React, { useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";

const ReportsPage = () => {
  const [busy, setBusy] = useState(false);

  const downloadCsv = async (which) => {
    setBusy(true);
    try {
      await adminService.downloadReportCsv(which);
      toast.success("Download started");
    } catch {
      toast.error("Export failed");
    } finally {
      setBusy(false);
    }
  };

  const printPdf = async () => {
    setBusy(true);
    try {
      const res = await adminService.getReportsJson();
      if (!res.success || !res.data) {
        toast.error("Could not load report data");
        return;
      }
      const { generatedAt, students, internships } = res.data;
      const w = window.open("", "_blank");
      if (!w) {
        toast.error("Allow pop-ups to print PDF");
        return;
      }
      w.document.write(`<!DOCTYPE html><html><head><title>USIMS report</title>
        <style>
          body{font-family:system-ui,sans-serif;padding:24px;color:#1e293b}
          h1{font-size:20px} h2{font-size:16px;margin-top:20px}
          table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}
          th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}
          th{background:#f1f5f9}
        </style></head><body>
        <h1>University internship management — report</h1>
        <p style="font-size:12px;color:#64748b">Generated: ${generatedAt}</p>
        <h2>Students</h2>
        <table><thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead><tbody>
        ${(students || [])
          .map(
            (s) =>
              `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.email)}</td><td>${escapeHtml(s.status)}</td></tr>`
          )
          .join("")}
        </tbody></table>
        <h2>Internships</h2>
        <table><thead><tr><th>Company</th><th>Position</th><th>Status</th></tr></thead><tbody>
        ${(internships || [])
          .map(
            (i) =>
              `<tr><td>${escapeHtml(i.companyName)}</td><td>${escapeHtml(i.position)}</td><td>${escapeHtml(i.status)}</td></tr>`
          )
          .join("")}
        </tbody></table>
        <script>window.onload=function(){window.print();}</script>
        </body></html>`);
      w.document.close();
    } catch {
      toast.error("Could not build print view");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Reports</h2>
      <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
        Export student and internship data as CSV for spreadsheets. Use print to save as PDF from your browser.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Student report</h3>
          <p className="mt-1 text-xs text-slate-500">CSV includes name, email, role, registration date.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => downloadCsv("students")}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Internship report</h3>
          <p className="mt-1 text-xs text-slate-500">CSV includes company, position, status, submitted date.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => downloadCsv("internships")}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-semibold text-slate-800">Combined printable report (PDF)</h3>
        <p className="mt-1 text-sm text-slate-600">
          Opens a print-friendly page — choose &quot;Save as PDF&quot; in the print dialog.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={printPdf}
          className="mt-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
        >
          Open print / PDF
        </button>
      </div>
    </section>
  );
};

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default ReportsPage;
