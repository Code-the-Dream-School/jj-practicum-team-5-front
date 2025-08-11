import { useState } from "react";

export default function Timeline({ steps = [] }) {
    const [selectedStep, setSelectedStep] = useState(null);
    const [hoveredStep, setHoveredStep] = useState(null);

    const getStepColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-500 border-emerald-200";
            case "in-progress":
                return "bg-amber-500 border-amber-200";
            case "not-started":
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
            case "not-started":
                return "○";
            case "overdue":
                return "!";
            default:
                return "?";
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            "completed": { color: "bg-emerald-100 text-emerald-800", text: "Complete" },
            "in-progress": { color: "bg-amber-100 text-amber-800", text: "In process" },
            "not-started": { color: "bg-slate-100 text-slate-800", text: "Not started" },
            "overdue": { color: "bg-rose-100 text-rose-800", text: "Overdue" },
        };

        const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", text: "Not started" };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {!steps || steps.length === 0 ? (
                <div className="text-center p-8">
                    <p className="text-gray-500">No steps to display</p>
                </div>
            ) : (
                <>
                    <div className="relative pb-8">
                        {/* Линия, соединяющая шаги */}
                        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300"></div>

                        <div className="flex justify-between relative">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center relative z-10 w-24"
                                >
                                    <div
                                        className={`
                                            w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
                                            border-4 cursor-pointer transition-all duration-300
                                            ${getStepColor(step.status)}
                                            ${hoveredStep === step ? 'scale-110 shadow-2xl' : 'shadow-lg'}
                                        `}
                                        onClick={() => setSelectedStep(selectedStep?.name === step.name ? null : step)}
                                        onMouseEnter={() => setHoveredStep(step)}
                                        onMouseLeave={() => setHoveredStep(null)}
                                    >
                                        <span className="text-2xl">{getStepIcon(step.status)}</span>
                                    </div>

                                    <div className="mt-4 text-center max-w-32">
                                        <h3 className="font-semibold text-sm text-gray-800 leading-tight">
                                            {step.name || `Step ${index + 1}`}
                                        </h3>
                                    </div>

                                    {hoveredStep === step && (
                                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10 shadow-xl">
                                            {step.description || 'No description'}
                                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedStep && (
                        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedStep.name}</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed">{selectedStep.description || 'No description'}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedStep(null)}
                                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                {getStatusBadge(selectedStep.status)}
                                {selectedStep.date && (
                                    <div className="flex items-center text-gray-500">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {selectedStep.date}
                                    </div>
                                )}
                            </div>

                            {selectedStep.details && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-semibold text-gray-700 mb-2">More information:</h4>
                                    <p className="text-gray-600">{selectedStep.details}</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}