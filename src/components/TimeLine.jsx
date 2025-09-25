import React, { useState } from "react";
import { derive } from "../utils/derive";

export default function Timeline({ steps = [], onStepClick }) {
  const [selectedStep, setSelectedStep] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);

  // Return colors depending on status
  const getStepColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500 border-emerald-200";
      case "In Progress":
        return "bg-amber-500 border-amber-200";
      case "Not Started":
        return "bg-slate-400 border-slate-200";
      case "Overdue":
        return "bg-rose-500 border-rose-200";
      default:
        return "bg-gray-400 border-gray-200";
    }
  };

  // Return icons depending on status
  const getStepIcon = (status) => {
    switch (status) {
      case "Completed":
        return "✓";
      case "In Progress":
        return "⏳";
      case "Not Started":
        return "○";
      case "Overdue":
        return "!";
      default:
        return "?";
    }
  };

  if (!steps || steps.length === 0) {
    return (
        <div className="text-center p-4">
          <p className="text-gray-500 text-sm">No timeline available</p>
        </div>
    );
  }

  const displaySteps = steps.slice(0, 3);
  const hasMoreSteps = steps.length > 3;

  return (
      <div className="h-[120px] overflow-hidden flex items-center justify-center">
        <div className="flex items-start justify-center gap-8">
          {displaySteps.map((step, index) => {
            const meta = derive(step);

            return (
                <div
                    key={`timeline-${step._id || step.id || index}`}
                    className="flex flex-col items-center"
                >
                  {/* Circle */}
                  <div
                      className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs
                border-2 cursor-pointer transition-all duration-300
                ${getStepColor(meta.status)}
                ${hoveredStep === step ? "scale-110 shadow-lg" : "shadow-md"}${meta.status === "In Progress" ? "animate-spin" : ""}
              `}
                      onClick={() => {
                        if (onStepClick) {
                          onStepClick(step);
                        } else {
                          setSelectedStep(selectedStep?.id === step.id ? null : step);
                        }
                      }}
                      onMouseEnter={() => setHoveredStep(step)}
                      onMouseLeave={() => setHoveredStep(null)}
                  >
                    {getStepIcon(meta.status)}
                  </div>

                  {/* Label under circle */}
                  <div className="mt-2 text-center w-24 min-h-[32px] flex items-center justify-center">
                    <p className="text-xs text-gray-700 break-words line-clamp-2">
                      {step.title || `Step ${index + 1}`}
                    </p>
                  </div>

                  {/* +N more */}
                  {index === displaySteps.length - 1 && hasMoreSteps && (
                      <div className="mt-1 text-xs text-gray-500">
                        +{steps.length - 3}
                      </div>
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );

}
