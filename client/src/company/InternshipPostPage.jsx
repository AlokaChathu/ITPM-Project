import React, { useEffect, useState } from "react";
import axios from "axios";

function InternshipPostPage() {
  const [internships, setInternships] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    deadline: "",
    status: "open",
  });

  const fetchInternships = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get("http://localhost:4000/api/company/internships");

      if (data.success) {
        setInternships(data.internships);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load internships");
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      requirements: "",
      duration: "",
      deadline: "",
      status: "open",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      if (editingId) {
        await axios.put(
          `http://localhost:4000/api/company/internships/${editingId}`,
          form
        );
        alert("Internship updated successfully");
      } else {
        await axios.post(
          "http://localhost:4000/api/company/internships",
          form
        );
        alert("Internship created successfully");
      }

      resetForm();
      fetchInternships();
    } catch (error) {
      console.log(error);
      alert("Operation failed");
    }
  };

  const handleEdit = (internship) => {
    setEditingId(internship._id);
    setForm({
      title: internship.title,
      description: internship.description,
      requirements: internship.requirements,
      duration: internship.duration,
      deadline: internship.deadline?.split("T")[0],
      status: internship.status,
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this internship?");
    if (!ok) return;

    try {
      axios.defaults.withCredentials = true;
      await axios.delete(`http://localhost:4000/api/company/internships/${id}`);
      alert("Internship deleted successfully");
      fetchInternships();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-6">
            Internship Post Page
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Duration</label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows="3"
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                {editingId ? "Update Internship" : "Create Internship"}
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
        </div>

        <div className="grid gap-4">
          {internships.map((internship) => (
            <div key={internship._id} className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-indigo-900">{internship.title}</h2>
              <p className="text-gray-600 mt-2">{internship.description}</p>
              <p className="mt-2"><strong>Requirements:</strong> {internship.requirements}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p><strong>Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {internship.status}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(internship)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(internship._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InternshipPostPage;