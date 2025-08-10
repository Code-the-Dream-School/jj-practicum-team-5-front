import { useState } from "react";

export default function Timeline({ steps }) {
    const [selectedStep, setSelectedStep] = useState(null);

    const getStepColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "in-progress":
                return "bg-blue-500";
            case "not started":
                return "bg-red-300";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <div className="relative mb-6 mt-4 h-20 max-w-4xl mx-auto w-full">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center cursor-pointer select-none"
                            onClick={() => setSelectedStep(step)}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getStepColor(
                                    step.status
                                )}`}
                            >
                                {index + 1}
                            </div>
                            <div className="mt-4 h-4"></div>
                        </div>
                    ))}
                </div>

            
            {selectedStep && (
                <div className="p-4 border rounded-lg shadow bg-white transition-all duration-300">
                    <h2 className="text-lg font-semibold">{selectedStep.name}</h2>
                    <p className="text-gray-600">{selectedStep.description}</p>
                    <p className="mt-2 text-sm italic">Status: {selectedStep.status}</p>
                </div>
            )}
        </div>
    );
}
