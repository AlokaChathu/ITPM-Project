import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function InternshipTracking() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    startDate: "",
    endDate: "",
  });

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        "http://localhost:4000/api/internship-monitoring/my",
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setInternships(data.internships || []);
      } else {
        setError(data.message || "Failed to load internships");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Failed to load internship records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.studentName || !form.startDate || !form.endDate) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date must be after start date");
      return;
    }

    try {
      setSaving(true);

      const { data } = await axios.post(
        "http://localhost:4000/api/internship-monitoring",
        form,
        { withCredentials: true }
      );

      if (data.success) {
        alert("Internship saved successfully");

        setForm({
          studentId: "",
          studentName: "",
          startDate: "",
          endDate: "",
        });

        fetchInternships();
      } else {
        alert(data.message || "Failed to save internship");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save internship");
    } finally {
      setSaving(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">
              Internship Tracking
            </h1>
            <p className="text-gray-600 mt-2">
              Add and manage student internship records
            </p>
          </div>
          <BackButton />
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Add Internship
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="Enter student ID"
                  value={form.studentId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Enter student name"
                  value={form.studentName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {saving ? "Saving..." : "Save Internship"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Student Internship List
            </h2>

            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500 font-medium">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-indigo-100 text-left">
                      <th className="border border-gray-200 px-4 py-3">
                        Student ID
                      </th>
                      <th className="border border-gray-200 px-4 py-3">
                        Student Name
                      </th>
                      <th className="border border-gray-200 px-4 py-3">
                        Start Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3">
                        End Date
                      </th>
                      <th className="border border-gray-200 px-4 py-3">
                        Status
                      </th>
                      <th className="border border-gray-200 px-4 py-3">
                        Progress
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {internships.length > 0 ? (
                      internships.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3">
                            {item.studentId}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            {item.studentName}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            {item.startDate
                              ? new Date(item.startDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            {item.endDate
                              ? new Date(item.endDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                              {item.status || "Active"}
                            </span>
                          </td>
                          <td className="border border-gray-200 px-4 py-3 min-w-[180px]">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className={`h-4 rounded-full ${getProgressColor(
                                  item.progress || 0
                                )}`}
                                style={{ width: `${item.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700 mt-1 inline-block">
                              {item.progress || 0}%
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center border border-gray-200 px-4 py-6 text-gray-500"
                        >
                          No internship records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipTracking;