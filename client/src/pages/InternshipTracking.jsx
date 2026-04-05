import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function InternshipTracking() {
  const [internships, setInternships] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    startDate: "",
    endDate: "",
  });

  const fetchInternships = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/internship-monitoring/my", {
        withCredentials: true,
      });

      if (data.success) {
        setInternships(data.internships);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date must be after start date");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/internship-monitoring",
        form,
        { withCredentials: true }
      );

      setForm({
        studentId: "",
        studentName: "",
        startDate: "",
        endDate: "",
      });

      fetchInternships();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save internship");
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">
            Internship Tracking
          </h1>
          <BackButton />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl mb-10">

          <div>
            <label className="block mb-1 font-medium">
              Student ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter student ID"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter student name"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Save Internship
          </button>
        </form>

        {/* Table */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Student Internship List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-indigo-100 text-left">
                <th className="border border-gray-200 px-4 py-3">Student ID</th>
                <th className="border border-gray-200 px-4 py-3">Student Name</th>
                <th className="border border-gray-200 px-4 py-3">Start Date</th>
                <th className="border border-gray-200 px-4 py-3">End Date</th>
                <th className="border border-gray-200 px-4 py-3">Status</th>
                <th className="border border-gray-200 px-4 py-3">Progress</th>
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
                      {new Date(item.startDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      {item.status}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${getProgressColor(item.progress || 0)}`}
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

      </div>
    </div>
  );
}

export default InternshipTracking;