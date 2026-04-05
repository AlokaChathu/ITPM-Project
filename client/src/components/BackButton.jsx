import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton({ label = "Back to Dashboard", path = "/company-dashboard" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition shadow"
    >
      ← {label}
    </button>
  );
}

export default BackButton;