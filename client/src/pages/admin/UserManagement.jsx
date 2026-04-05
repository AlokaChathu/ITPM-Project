import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/useAdmin";
import { adminService } from "../../services/adminService";

const initialForm = { name: "", email: "", role: "", password: "" };

function displayStatus(status) {
  if (status === "Suspended") return "Inactive";
  return status || "—";
}

const UserManagement = () => {
  const { users, fetchUsers, loading } = useAdmin();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [editErrors, setEditErrors] = useState({});

  // @validation — Add user: name min 3, email format, role required, password min 6
  const validate = () => {
    const nextErrors = {};
    if (!formData.name || formData.name.trim().length < 3) nextErrors.name = "Name must be at least 3 characters";
    if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Please enter a valid email";
    if (!formData.role) nextErrors.role = "Role is required";
    if (!formData.password || formData.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateEdit = () => {
    const next = {};
    if (!editForm.name || editForm.name.trim().length < 3) next.name = "Name must be at least 3 characters";
    if (!/\S+@\S+\.\S+/.test(editForm.email)) next.email = "Please enter a valid email";
    const dup = users.find(
      (u) => u.email.toLowerCase() === editForm.email.trim().toLowerCase() && u._id !== editUser?._id
    );
    if (dup) next.email = "This email is already used by another user";
    setEditErrors(next);
    return Object.keys(next).length === 0;
  };

  const addValid =
    formData.name.trim().length >= 3 &&
    /\S+@\S+\.\S+/.test(formData.email) &&
    formData.role &&
    formData.password.length >= 6;

  const handleAddUser = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const response = await adminService.createUser(formData);
      if (response.success) {
        toast.success("User added successfully");
        setFormData(initialForm);
        setErrors({});
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to add user");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleStatusAction = async (userId, payload, successMessage) => {
    try {
      const response = await adminService.patchUser(userId, payload);
      if (response.success) {
        toast.success(successMessage);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Remove this user from the system?")) return;
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        toast.success("User removed");
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const loadDemoUsers = async () => {
    try {
      const response = await adminService.seedDemoUsers();
      toast.success(response.message || "Demo users loaded");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load demo users");
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email });
    setEditErrors({});
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!validateEdit()) return;
    try {
      const res = await adminService.patchUser(editUser._id, {
        action: "updateProfile",
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      });
      if (res.success) {
        toast.success("User updated");
        setEditUser(null);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const prefillSample = () => {
    setFormData({
      name: "Sample Company User",
      email: `company${Date.now()}@usims.com`,
      role: "Company",
      password: "sample12",
    });
    setErrors({});
  };

  const activeUsers = useMemo(() => users.filter((u) => !u.isDeleted), [users]);

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">User management</h2>
        <button
          type="button"
          onClick={loadDemoUsers}
          className="w-fit rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
        >
          Load demo users
        </button>
      </div>

      <form onSubmit={handleAddUser} className="mt-4 rounded-xl border border-slate-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Add new user</h3>
          <button
            type="button"
            onClick={prefillSample}
            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
          >
            Fill sample data
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select role</option>
              <option value="Student">Student</option>
              <option value="Company">Company</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={!addValid}
          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add user
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full bg-white">
          <thead className="bg-slate-50">
            <tr>
              {["Name", "Email", "Role", "Status", "Actions"].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeUsers.map((user) => (
              <tr key={user._id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-sm text-slate-800">{user.email}</td>
                <td className="px-4 py-3 text-sm text-slate-800">{user.role}</td>
                <td className="px-4 py-3 text-sm text-slate-800">{displayStatus(user.status)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded bg-slate-700 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                      onClick={() => openEdit(user)}
                    >
                      Edit
                    </button>
                    {user.role === "Company" && (
                      <button
                        type="button"
                        className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700"
                        onClick={() =>
                          handleStatusAction(user._id, { action: "approveCompany" }, "Company approved")
                        }
                      >
                        Approve company
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                      onClick={() => handleStatusAction(user._id, { status: "Active" }, "User activated")}
                    >
                      Activate
                    </button>
                    <button
                      type="button"
                      className="rounded bg-amber-600 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                      onClick={() => handleStatusAction(user._id, { status: "Suspended" }, "User deactivated")}
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && activeUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Edit user</h3>
            <p className="text-xs text-slate-500">Update name and email. Role changes use Role management.</p>
            <form onSubmit={saveEdit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
                {editErrors.name && <p className="mt-1 text-xs text-red-600">{editErrors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
                {editErrors.email && <p className="mt-1 text-xs text-red-600">{editErrors.email}</p>}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserManagement;
