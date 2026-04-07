import React, { useState, useEffect } from "react";
import { Shield, Users, Edit, Check, X } from "lucide-react";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setUsers([
        { id: 1, name: "John Doe", email: "john@example.com", currentRole: "Student" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", currentRole: "Lecturer" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", currentRole: "Company" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", currentRole: "Supervisor" },
        { id: 5, name: "Charlie Wilson", email: "charlie@example.com", currentRole: "Admin" }
      ]);
      
      setRoles([
        { name: "Student", permissions: { viewDashboard: true, manageUsers: false, manageInternships: true, viewReports: false } },
        { name: "Lecturer", permissions: { viewDashboard: true, manageUsers: false, manageInternships: true, viewReports: true } },
        { name: "Company", permissions: { viewDashboard: false, manageUsers: false, manageInternships: true, viewReports: false } },
        { name: "Supervisor", permissions: { viewDashboard: true, manageUsers: false, manageInternships: true, viewReports: true } },
        { name: "Admin", permissions: { viewDashboard: true, manageUsers: true, manageInternships: true, viewReports: true } }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      alert("Please select both a user and a role");
      return;
    }

    setLoading(true);
    
    // Mock role assignment
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === parseInt(selectedUser) 
          ? { ...user, currentRole: selectedRole }
          : user
      ));
      
      setSelectedUser("");
      setSelectedRole("");
      setLoading(false);
    }, 1000);
  };

  const getRolePermissions = (roleName) => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.permissions : {};
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          Role Assignment
        </div>
      </div>

      {/* Assign Role */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Role to User</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - Current: {user.currentRole}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={handleAssignRole}
          disabled={loading || !selectedUser || !selectedRole}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent"></div>
              Assigning...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Assign Role
            </>
          )}
        </button>
      </div>

      {/* Role Definitions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Definitions & Permissions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600">Role Type</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h5>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">View Dashboard</span>
                    <span className={`flex items-center gap-1 ${role.permissions.viewDashboard ? 'text-green-600' : 'text-red-600'}`}>
                      {role.permissions.viewDashboard ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {role.permissions.viewDashboard ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Manage Users</span>
                    <span className={`flex items-center gap-1 ${role.permissions.manageUsers ? 'text-green-600' : 'text-red-600'}`}>
                      {role.permissions.manageUsers ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {role.permissions.manageUsers ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Manage Internships</span>
                    <span className={`flex items-center gap-1 ${role.permissions.manageInternships ? 'text-green-600' : 'text-red-600'}`}>
                      {role.permissions.manageInternships ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {role.permissions.manageInternships ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">View Reports</span>
                    <span className={`flex items-center gap-1 ${role.permissions.viewReports ? 'text-green-600' : 'text-red-600'}`}>
                      {role.permissions.viewReports ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      {role.permissions.viewReports ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users by Role */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
        
        <div className="space-y-4">
          {roles.map((role) => {
            const roleUsers = users.filter(user => user.currentRole === role.name);
            
            return (
              <div key={role.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                    {roleUsers.length} users
                  </span>
                </div>
                
                {roleUsers.length > 0 ? (
                  <div className="space-y-2">
                    {roleUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUser(user.id.toString());
                            setSelectedRole(role.name);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No users assigned to this role</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            <p className="text-sm text-gray-600">Available Roles</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Edit className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.currentRole === 'Student').length}
            </p>
            <p className="text-sm text-gray-600">Student Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
