import React, { useMemo, useState } from "react";

const recipientLabels = {
  All: "All Users",
  Student: "Students",
  Company: "Companies",
  Supervisor: "Supervisors",
};

const truncate = (text, max = 72) => {
  const s = String(text || "");
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "bg-red-100 text-red-800 ring-red-200",
    Medium: "bg-amber-100 text-amber-900 ring-amber-200",
    Low: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  };
  const cls = styles[priority] || "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {priority}
    </span>
  );
};

/**
 * Sortable, filterable table of sent notifications (client-side).
 */
const NotificationTable = ({ notifications = [], loading }) => {
  const [recipientFilter, setRecipientFilter] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const filteredSorted = useMemo(() => {
    let list = [...notifications];

    if (recipientFilter) {
      list = list.filter((n) => n.recipientType === recipientFilter);
    }
    if (titleSearch.trim()) {
      const q = titleSearch.trim().toLowerCase();
      list = list.filter((n) => String(n.title || "").toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const safeA = Number.isFinite(ta) ? ta : 0;
      const safeB = Number.isFinite(tb) ? tb : 0;
      return sortNewestFirst ? safeB - safeA : safeA - safeB;
    });

    return list;
  }, [notifications, recipientFilter, titleSearch, sortNewestFirst]);

  return (
    <section className="rounded-xl border border-indigo-200/60 bg-white/95 p-5 shadow-sm md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-indigo-950">Sent notifications</h2>
          <p className="text-xs text-slate-500">Filter, search by title, and sort by date</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label htmlFor="filter-recipient" className="mb-1 block text-xs font-medium text-slate-600">
              Filter by recipient
            </label>
            <select
              id="filter-recipient"
              value={recipientFilter}
              onChange={(e) => setRecipientFilter(e.target.value)}
              className="w-full min-w-[160px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 sm:w-auto"
            >
              <option value="">All types</option>
              <option value="All">All Users</option>
              <option value="Student">Students</option>
              <option value="Company">Companies</option>
              <option value="Supervisor">Supervisors</option>
            </select>
          </div>
          <div className="flex-1 sm:min-w-[200px]">
            <label htmlFor="search-title" className="mb-1 block text-xs font-medium text-slate-600">
              Search title
            </label>
            <input
              id="search-title"
              type="search"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              placeholder="Type to filter…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setSortNewestFirst((v) => !v)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Date: {sortNewestFirst ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-slate-200">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <p className="text-sm font-medium text-indigo-800">Loading…</p>
          </div>
        )}
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["Title", "Message", "Recipient Type", "Priority", "Date Sent"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredSorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  {notifications.length === 0
                    ? "No notifications yet. Send one using the form above."
                    : "No rows match your filters."}
                </td>
              </tr>
            )}
            {filteredSorted.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50/80">
                <td className="max-w-[200px] px-4 py-3 font-medium text-slate-900">{row.title}</td>
                <td className="max-w-xs px-4 py-3 text-slate-600" title={row.message}>
                  {truncate(row.message)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                  {recipientLabels[row.recipientType] || row.recipientType}
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={row.priority} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default NotificationTable;
