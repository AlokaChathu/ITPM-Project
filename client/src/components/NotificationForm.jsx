import React, { useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../services/adminService";

const initialForm = {
  title: "",
  message: "",
  recipientType: "",
  priority: "",
};

const recipientOptions = [
  { value: "", label: "Select recipient type" },
  { value: "All", label: "All Users" },
  { value: "Student", label: "Students" },
  { value: "Company", label: "Companies" },
  { value: "Supervisor", label: "Supervisors" },
];

const priorityOptions = [
  { value: "", label: "Select priority" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

/**
 * Admin notification compose form with client-side validation.
 */
const NotificationForm = ({ onSent }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // @validation — title ≥5, message ≥10, recipient & priority required
  const validate = () => {
    const next = {};
    const titleTrim = form.title.trim();
    const msgTrim = form.message.trim();

    if (!titleTrim) next.title = "Notification title is required";
    else if (titleTrim.length < 5) next.title = "Title must be at least 5 characters";

    if (!msgTrim) next.message = "Message is required";
    else if (msgTrim.length < 10) next.message = "Message must be at least 10 characters";

    if (!form.recipientType) next.recipientType = "Please select a recipient type";
    if (!form.priority) next.priority = "Please select a priority";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClear = () => {
    setForm(initialForm);
    setErrors({});
  };

  const fillDummy = () => {
    setForm({
      title: "Internship intake reminder",
      message:
        "All eligible students are reminded to complete internship applications before the published deadline. Contact the coordinator for support.",
      recipientType: "Student",
      priority: "Medium",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const confirmed = window.confirm(
      "Send this notification? It will be stored and listed for administrators."
    );
    if (!confirmed) return;

    setSubmitting(true);
    try {
      const res = await adminService.createNotification({
        title: form.title.trim(),
        message: form.message.trim(),
        recipientType: form.recipientType,
        priority: form.priority,
      });
      if (res.success) {
        toast.success(res.message || "Notification sent successfully");
        handleClear();
        onSent?.();
      } else {
        toast.error(res.message || "Failed to send");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send notification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-indigo-200/60 bg-white/95 p-5 shadow-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-indigo-950">Compose notification</h2>
        <button
          type="button"
          onClick={fillDummy}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Fill sample data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="notif-title" className="mb-1 block text-sm font-medium text-slate-700">
            Notification Title
          </label>
          <input
            id="notif-title"
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Placement workshop announcement"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="notif-message" className="mb-1 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="notif-message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter the full notification text for recipients..."
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="notif-recipient" className="mb-1 block text-sm font-medium text-slate-700">
              Recipient Type
            </label>
            <select
              id="notif-recipient"
              value={form.recipientType}
              onChange={(e) => setForm((p) => ({ ...p, recipientType: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {recipientOptions.map((o) => (
                <option key={o.value || "recipient-placeholder"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.recipientType && (
              <p className="mt-1 text-xs text-red-600">{errors.recipientType}</p>
            )}
          </div>

          <div>
            <label htmlFor="notif-priority" className="mb-1 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              id="notif-priority"
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {priorityOptions.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Notification"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Clear Form
          </button>
        </div>
      </form>
    </section>
  );
};

export default NotificationForm;
