import React from "react";

export default function ProgressBar({ progress = 0 }) {
  const getBarColor = (p) => {
    if (p === 100) return "bg-emerald-500"; // Completed
    if (p > 0) return "bg-amber-500"; // In Progress
    return "bg-slate-400"; // Not Started
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-1">
        <span className="text-xs font-medium text-gray-600">{progress}%</span>
      </div>

      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${getBarColor(
            progress
          )} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
