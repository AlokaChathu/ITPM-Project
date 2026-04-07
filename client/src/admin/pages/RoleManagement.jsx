import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/useAdmin";
import { adminService } from "../../services/adminService";

// @validation — Allowed roles only (invalid assignment blocked client-side)
const validRoles = ["Admin", "Student", "Company", "Supervisor"];

const RoleManagement = () => {
  const { users, roles, fetchUsers } = useAdmin();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  const assignRole = async () => {
    setError("");
    // @validation — User + role required; role must be in validRoles
    if (!selectedUser) return setError("Please select a user");
    if (!selectedRole) return setError("Role selection is required");
    if (!validRoles.includes(selectedRole)) return setError("Cannot assign an invalid role");

    try {
      const response = await adminService.updateRole(selectedUser, selectedRole);
      if (response.success) {
        toast.success("Role updated successfully");
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Role management</h2>

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-800">Assign role to user</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Select user</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Choose user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Target role</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select role</option>
              {validRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <button
          type="button"
          onClick={assignRole}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Assign role
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {roles.map((role) => (
          <div key={role.name} className="rounded-lg border border-slate-200 p-4">
            <h4 className="text-base font-semibold text-slate-800">{role.name}</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>View Dashboard: {role.permissions.viewDashboard ? "Yes" : "No"}</li>
              <li>Manage Users: {role.permissions.manageUsers ? "Yes" : "No"}</li>
              <li>Manage Internships: {role.permissions.manageInternships ? "Yes" : "No"}</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoleManagement;
