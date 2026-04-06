import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function InternshipPost() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 4;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    deadline: "",
    status: "open",
  });

  const [errors, setErrors] = useState({});

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4000/api/internships", {
        withCredentials: true,
      });

      if (data.success) {
        setInternships(data.internships || []);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "title":
        if (!trimmedValue) return "Title is required";
        if (trimmedValue.length < 4) return "Title must be at least 4 characters";
        if (trimmedValue.length > 100) return "Title must be less than 100 characters";
        return "";

      case "description":
        if (!trimmedValue) return "Description is required";
        if (trimmedValue.length < 15) return "Description must be at least 15 characters";
        return "";

      case "requirements":
        if (!trimmedValue) return "Requirements are required";
        if (trimmedValue.length < 10) return "Requirements must be at least 10 characters";
        return "";

      case "duration":
        if (!trimmedValue) return "Duration is required";
        if (trimmedValue.length < 2) return "Duration is too short";
        if (!/^[a-zA-Z0-9\s,-]+$/.test(trimmedValue)) {
          return "Duration contains invalid characters";
        }
        return "";

      case "deadline":
        if (!trimmedValue) return "Deadline is required";
        if (trimmedValue < getToday()) return "Deadline cannot be a past date";
        return "";

      case "status":
        if (!["open", "closed"].includes(trimmedValue)) return "Invalid status";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      duration: "",
      deadline: "",
      status: "open",
    });
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return alert("Please fix the validation errors before submitting.");
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requirements: formData.requirements.trim(),
      duration: formData.duration.trim(),
      deadline: formData.deadline,
      status: formData.status,
    };

    try {
      setLoading(true);

      if (editingId) {
        const { data } = await axios.put(
          `http://localhost:4000/api/internships/${editingId}`,
          payload,
          { withCredentials: true }
        );

        if (data.success) {
          alert("Internship updated successfully");
        }
      } else {
        const { data } = await axios.post(
          "http://localhost:4000/api/internships",
          payload,
          { withCredentials: true }
        );

        if (data.success) {
          alert("Internship created successfully");
        }
      }

      resetForm();
      fetchInternships();
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      requirements: item.requirements || "",
      duration: item.duration || "",
      deadline: item.deadline ? item.deadline.split("T")[0] : "",
      status: item.status || "open",
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this internship?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const { data } = await axios.delete(
        `http://localhost:4000/api/internships/${id}`,
        { withCredentials: true }
      );

      if (data.success) {
        alert("Internship deleted successfully");
        fetchInternships();
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const q = searchTerm.toLowerCase();
      return (
        (item.title || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.requirements || "").toLowerCase().includes(q) ||
        (item.status || "").toLowerCase().includes(q)
      );
    });
  }, [internships, searchTerm]);

  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);

  const paginatedInternships = filteredInternships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    return status === "open"
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300";
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">
            Internship Post Management
          </h1>

          <BackButton />
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter internship title"
              value={formData.title}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="e.g. 3 months, 6 months"
              value={formData.duration}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full ${errors.duration ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              placeholder="Enter internship description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`border p-3 rounded-lg w-full ${errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Requirements</label>
            <textarea
              name="requirements"
              placeholder="Enter required skills (e.g. React, Java, SQL...)"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              className={`border p-3 rounded-lg w-full ${errors.requirements ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.requirements && (
              <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={getToday()}
              className={`border p-3 rounded-lg w-full ${errors.deadline ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full ${errors.status ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : editingId
                ? "Update Internship"
                : "Create Internship"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Search Internship</label>
          <input
            type="text"
            placeholder="Search by title, description, requirements or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">My Internship Posts</h2>

        {loading && internships.length === 0 ? (
          <div className="text-gray-500 bg-gray-50 border rounded-xl p-6">
            Loading internships...
          </div>
        ) : paginatedInternships.length === 0 ? (
          <div className="text-gray-500 bg-gray-50 border rounded-xl p-6">
            No internships found.
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedInternships.map((item) => (
              <div key={item._id} className="border rounded-xl p-5 shadow-sm bg-white">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800">{item.title}</h3>
                    <p className="mt-2 text-gray-700">{item.description}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status === "open" ? "Open" : "Closed"}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-gray-700">
                  <p><strong>Requirements:</strong> {item.requirements}</p>
                  <p><strong>Duration:</strong> {item.duration}</p>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {item.deadline ? new Date(item.deadline).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternshipPost;