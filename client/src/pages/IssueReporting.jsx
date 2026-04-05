import React, { useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function IssueReporting() {
  const [form, setForm] = useState({
    internshipId: "",
    issueType: "Technical",
    subject: "",
    description: "",
    priority: "Medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/issues", form, {
      withCredentials: true,
    });
    alert("Issue reported successfully");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Issue Reporting</h1>
      <BackButton/>
      
    </div>
  );
}

export default IssueReporting;