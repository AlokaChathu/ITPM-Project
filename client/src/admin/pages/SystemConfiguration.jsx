import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/useAdmin";
import { adminService } from "../../services/adminService";

const defaultForm = {
  minGpaRequirement: "2.5",
  internshipDurationMonths: "6",
  evalWeightTechnical: "40",
  evalWeightCommunication: "35",
  evalWeightAttendance: "25",
};

function toFormStrings(c) {
  if (!c) return { ...defaultForm };
  return {
    minGpaRequirement: String(c.minGpaRequirement ?? 2.5),
    internshipDurationMonths: String(c.internshipDurationMonths ?? 6),
    evalWeightTechnical: String(c.evalWeightTechnical ?? 40),
    evalWeightCommunication: String(c.evalWeightCommunication ?? 35),
    evalWeightAttendance: String(c.evalWeightAttendance ?? 25),
  };
}

const SystemConfiguration = () => {
  const { config, fetchConfig } = useAdmin();
  const [form, setForm] = useState(() => toFormStrings(config));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormStrings(config));
  }, [config]);

  const weightSum = useMemo(() => {
    const a = Number(form.evalWeightTechnical) || 0;
    const b = Number(form.evalWeightCommunication) || 0;
    const c = Number(form.evalWeightAttendance) || 0;
    return a + b + c;
  }, [form]);

  // @validation — GPA 0–4; months 1–24; integer weights total 100%
  const validate = () => {
    const next = {};
    const gpa = Number(form.minGpaRequirement);
    const months = Number(form.internshipDurationMonths);
    const wT = Number(form.evalWeightTechnical);
    const wC = Number(form.evalWeightCommunication);
    const wA = Number(form.evalWeightAttendance);

    if (form.minGpaRequirement === "" || Number.isNaN(gpa)) {
      next.minGpaRequirement = "Minimum GPA is required";
    } else if (gpa < 0 || gpa > 4) {
      next.minGpaRequirement = "GPA must be between 0 and 4";
    }

    if (form.internshipDurationMonths === "" || !Number.isInteger(months)) {
      next.internshipDurationMonths = "Enter a whole number of months (1–24)";
    } else if (months < 1 || months > 24) {
      next.internshipDurationMonths = "Duration must be from 1 to 24 months";
    }

    [
      ["evalWeightTechnical", wT],
      ["evalWeightCommunication", wC],
      ["evalWeightAttendance", wA],
    ].forEach(([key, w]) => {
      if (form[key] === "" || !Number.isInteger(w)) {
        next[key] = "Enter a whole number from 0 to 100";
      } else if (w < 0 || w > 100) {
        next[key] = "Each weight must be 0–100";
      }
    });

    if (
      Number.isInteger(wT) &&
      Number.isInteger(wC) &&
      Number.isInteger(wA) &&
      wT + wC + wA !== 100
    ) {
      next.evalTotal = `Weights must total 100% (currently ${wT + wC + wA}%)`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveConfig = async () => {
    if (!validate()) return;
    const payload = {
      minGpaRequirement: Number(form.minGpaRequirement),
      internshipDurationMonths: Number(form.internshipDurationMonths),
      evalWeightTechnical: Number(form.evalWeightTechnical),
      evalWeightCommunication: Number(form.evalWeightCommunication),
      evalWeightAttendance: Number(form.evalWeightAttendance),
    };
    try {
      const response = await adminService.saveConfig(payload);
      if (response.success) {
        toast.success("Configuration saved successfully");
        fetchConfig();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save configuration");
    }
  };

  const canSubmit = useMemo(() => {
    const gpa = Number(form.minGpaRequirement);
    const months = Number(form.internshipDurationMonths);
    const wT = Number(form.evalWeightTechnical);
    const wC = Number(form.evalWeightCommunication);
    const wA = Number(form.evalWeightAttendance);
    if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) return false;
    if (!Number.isInteger(months) || months < 1 || months > 24) return false;
    if (![wT, wC, wA].every((w) => Number.isInteger(w) && w >= 0 && w <= 100)) return false;
    if (wT + wC + wA !== 100) return false;
    return true;
  }, [form]);

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">System configuration</h2>
      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-800">Academic &amp; evaluation settings</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Minimum GPA requirement</label>
            <input
              type="number"
              min={0}
              max={4}
              step={0.1}
              value={form.minGpaRequirement}
              onChange={(e) => setForm((p) => ({ ...p, minGpaRequirement: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-slate-500">Scale 0.0 – 4.0</p>
            {errors.minGpaRequirement && <p className="mt-1 text-xs text-red-600">{errors.minGpaRequirement}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Internship duration (months)</label>
            <input
              type="number"
              min={1}
              max={24}
              step={1}
              value={form.internshipDurationMonths}
              onChange={(e) => setForm((p) => ({ ...p, internshipDurationMonths: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
            {errors.internshipDurationMonths && (
              <p className="mt-1 text-xs text-red-600">{errors.internshipDurationMonths}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="mb-2 text-sm font-semibold text-slate-800">Evaluation weight (%)</h4>
          <p className="mb-3 text-xs font-medium text-slate-500">Technical, communication, and attendance must total 100%.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Technical skills</label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={form.evalWeightTechnical}
                onChange={(e) => setForm((p) => ({ ...p, evalWeightTechnical: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
              {errors.evalWeightTechnical && (
                <p className="mt-1 text-xs text-red-600">{errors.evalWeightTechnical}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Communication</label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={form.evalWeightCommunication}
                onChange={(e) => setForm((p) => ({ ...p, evalWeightCommunication: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
              {errors.evalWeightCommunication && (
                <p className="mt-1 text-xs text-red-600">{errors.evalWeightCommunication}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Attendance</label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={form.evalWeightAttendance}
                onChange={(e) => setForm((p) => ({ ...p, evalWeightAttendance: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
              {errors.evalWeightAttendance && (
                <p className="mt-1 text-xs text-red-600">{errors.evalWeightAttendance}</p>
              )}
            </div>
          </div>
          <p
            className={`mt-2 text-sm font-semibold ${weightSum === 100 ? "text-emerald-600" : "text-amber-600"}`}
          >
            Total: {weightSum}% {weightSum === 100 ? "✓" : "(must equal 100%)"}
          </p>
          {errors.evalTotal && <p className="mt-1 text-xs text-red-600">{errors.evalTotal}</p>}
        </div>

        <button
          type="button"
          onClick={saveConfig}
          disabled={!canSubmit}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save settings
        </button>
      </div>
    </section>
  );
};

export default SystemConfiguration;
