import React from "react";

const SummaryCard = ({ label, value, accent = "bg-blue-500" }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default SummaryCard;
