import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CompanyLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyEmail: "",
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
        "http://localhost:4000/api/company-auth/login",
        formData
      );

      if (data.success) {
        alert("Company login successful");
        navigate("/company-dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-6">
          Company Login
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-4">

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

          {/* PASSWORD */}
          <div>
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

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CompanyLogin;