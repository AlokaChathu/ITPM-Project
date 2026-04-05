import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function WeeklyMonthlyReports() {
  const [reports, setReports] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    studentId: "",
    type: "Weekly",
    weekNumber: "",
    monthNumber: "",
    title: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/reports/my", {
        withCredentials: true,
      });

      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.log("Fetch reports error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "type") {
        if (value === "Weekly") {
          updated.monthNumber = "";
        } else {
          updated.weekNumber = "";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: form.studentId.trim(),
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      weekNumber:
        form.type === "Weekly" && form.weekNumber !== ""
          ? Number(form.weekNumber)
          : null,
      monthNumber:
        form.type === "Monthly" && form.monthNumber !== ""
          ? Number(form.monthNumber)
          : null,
    };

    if (!payload.studentId || !payload.title || !payload.description) {
      alert("Please fill all required fields");
      return;
    }

    if (payload.type === "Weekly" && !payload.weekNumber) {
      alert("Week number is required for weekly reports");
      return;
    }

    if (payload.type === "Monthly" && !payload.monthNumber) {
      alert("Month number is required for monthly reports");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const { data } = await axios.put(
          `http://localhost:4000/api/reports/${editingId}`,
          payload,
          { withCredentials: true }
        );

        if (data.success) {
          alert("Report updated successfully");
        }
      } else {
        const { data } = await axios.post(
          "http://localhost:4000/api/reports",
          payload,
          { withCredentials: true }
        );

        if (data.success) {
          alert("Report submitted successfully");
        }
      }

      resetForm();
      fetchReports();
    } catch (error) {
      console.log("Submit report error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report) => {
    setEditingId(report._id);
    setForm({
      studentId: report.studentId || "",
      type: report.type || "Weekly",
      weekNumber: report.weekNumber || "",
      monthNumber: report.monthNumber || "",
      title: report.title || "",
      description: report.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/reports/${id}`,
        { withCredentials: true }
      );

      if (data.success) {
        alert("Report deleted successfully");
        fetchReports();
      }
    } catch (error) {
      console.log("Delete report error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weekly / Monthly Reports</h1>
        <BackButton />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 bg-white p-6 rounded-xl shadow mb-8"
      >
        <div>
          <label className="block mb-1 font-medium">
            Student ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter student ID"
            value={form.studentId}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Report Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {form.type === "Weekly" && (
          <div>
            <label className="block mb-1 font-medium">
              Week Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="weekNumber"
              placeholder="Enter week number"
              value={form.weekNumber}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              min="1"
              required
            />
          </div>
        )}

        {form.type === "Monthly" && (
          <div>
            <label className="block mb-1 font-medium">
              Month Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="monthNumber"
              placeholder="Enter month number"
              value={form.monthNumber}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              min="1"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            Report Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter report title"
            value={form.title}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Report Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Enter report description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
            rows="4"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : editingId
              ? "Update Report"
              : "Submit Report"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Reports</h2>

      <div className="grid gap-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report._id} className="border rounded-xl p-5 shadow-sm bg-white">
              <h3 className="text-xl font-bold text-indigo-800">{report.title}</h3>
              <p className="mt-2"><strong>Student ID:</strong> {report.studentId}</p>
              <p><strong>Type:</strong> {report.type}</p>
              <p><strong>Week Number:</strong> {report.weekNumber || "-"}</p>
              <p><strong>Month Number:</strong> {report.monthNumber || "-"}</p>
              <p><strong>Description:</strong> {report.description}</p>
              <p><strong>Status:</strong> {report.status}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(report)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(report._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reports found.</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyMonthlyReports;