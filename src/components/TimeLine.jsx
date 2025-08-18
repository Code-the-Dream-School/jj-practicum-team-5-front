import React, { useState } from "react";

export default function Timeline({ steps = [] }) {
    const [selectedStep, setSelectedStep] = useState(null);
    const [hoveredStep, setHoveredStep] = useState(null);

    const getStepColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-500 border-emerald-200";
            case "in-progress":
                return "bg-amber-500 border-amber-200";
            case "not started":
                return "bg-slate-400 border-slate-200";
            case "overdue":
                return "bg-rose-500 border-rose-200";
            default:
                return "bg-gray-400 border-gray-200";
        }
    };

    const getStepIcon = (status) => {
        switch (status) {
            case "completed":
                return "✓";
            case "in-progress":
                return "⏳";
            case "not started":
                return "○";
            case "overdue":
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

    };

    const displaySteps = steps.slice(0, 3);
    const hasMoreSteps = steps.length > 3;

    return (
        <div className="p-4">
            <div className="flex items-center justify-center">
                {displaySteps.map((step, index) => (
                    <div key={`timeline-${index}`} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs
                                    border-2 cursor-pointer transition-all duration-300 relative
                                    ${getStepColor(step.status)}
                                    ${hoveredStep === step ? 'scale-110 shadow-lg' : 'shadow-md'}
                                `}
                                onClick={() => setSelectedStep(selectedStep?.name === step.name ? null : step)}
                                onMouseEnter={() => setHoveredStep(step)}
                                onMouseLeave={() => setHoveredStep(null)}
                            >
                                <span className="text-sm">{getStepIcon(step.status)}</span>
                            </div>

                            <div className="mt-1 text-center max-w-16">
                                <h4 className="font-medium text-xs text-gray-700 leading-tight">
                                    {step.name || `Step ${index + 1}`}
                                </h4>
                            </div>

                            {hoveredStep === step && (
                                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 shadow-xl">
                                    {step.description || step.name}
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                            )}
                        </div>

                        {index < displaySteps.length - 1 && (
                            <div className="flex items-center mx-2" style={{ marginTop: '-16px' }}>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        )}

                        {index === displaySteps.length - 1 && hasMoreSteps && (
                            <div className="flex items-center mx-2" style={{ marginTop: '-16px' }}>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="ml-1 text-xs text-gray-500">+{steps.length - 3}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedStep && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm text-gray-800">{selectedStep.name}</h3>
                            <p className="text-gray-600 text-xs mt-1">{selectedStep.description || 'No description'}</p>
                        </div>
                        <button
                            onClick={() => setSelectedStep(null)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}