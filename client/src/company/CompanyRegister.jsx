import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CompanyRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    companyWebsite: "",
    industry: "",
    description: "",
    supervisorName: "",
    supervisorEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        "http://localhost:4000/api/company-auth/register",
        formData
      );

      if (data.success) {
        alert("Company registered successfully");
        navigate("/company-login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-6">
          Company Registration Form
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* COMPANY NAME */}
          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 font-medium">Company Email</label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* WEBSITE */}
          <div>
            <label className="block mb-1 font-medium">Website</label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* INDUSTRY */}
          <div>
            <label className="block mb-1 font-medium">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* SUPERVISOR NAME */}
          <div>
            <label className="block mb-1 font-medium">Supervisor Name</label>
            <input
              type="text"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* SUPERVISOR EMAIL */}
          <div>
            <label className="block mb-1 font-medium">Supervisor Email</label>
            <input
              type="email"
              name="supervisorEmail"
              value={formData.supervisorEmail}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Company Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="border p-3 rounded-lg w-full"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition md:col-span-2"
          >
            {loading ? "Registering..." : "Register Company"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CompanyRegister;