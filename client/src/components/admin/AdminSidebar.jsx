import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/admin/system" },
  { label: "Users", to: "/admin/system/users" },
  { label: "Roles", to: "/admin/system/roles" },
  { label: "Internships", to: "/admin/system/internships" },
  { label: "Configuration", to: "/admin/system/config" },
  { label: "Analytics", to: "/admin/system/analytics" },
  { label: "Reports", to: "/admin/system/reports" },
  { label: "Backup & restore", to: "/admin/system/backup" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-full rounded-xl border border-indigo-200/50 bg-white/90 p-4 shadow-md shadow-indigo-950/5 backdrop-blur-sm lg:w-64">
      <h2 className="mb-1 text-lg font-bold text-indigo-950">USIMS admin</h2>
      <p className="mb-4 text-xs font-medium text-slate-500">System administration &amp; analytics</p>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin/system"}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-700 hover:bg-indigo-50/80"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
