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
      <div className="p-4">
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
                  ${hoveredStep === step ? "scale-110 shadow-lg" : "shadow-md"}
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

                  {/* Label strictly under circle */}
                  <div className="mt-2 text-center w-24 min-h-[40px] flex items-center justify-center">
                    <p className="text-xs text-gray-700 break-words line-clamp-2">
                      {step.title || `Step ${index + 1}`}
                    </p>
                  </div>

                  {/* Tooltip */}
                  {hoveredStep === step && (
                      <div className="absolute mt-12 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 shadow-xl">
                        {step.description || step.title}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                  )}

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

        {/* Fallback details panel when no onStepClick is passed */}
        {!onStepClick && selectedStep && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3">
              <h3 className="font-semibold text-sm text-gray-800">
                {selectedStep.title}
              </h3>
              <p className="text-gray-600 text-xs mt-1">
                {selectedStep.description || "No description"}
              </p>
            </div>
        )}
      </div>
  );
}
