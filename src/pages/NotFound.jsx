import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{
                    background: `
                      linear-gradient(to bottom,
                        rgba(171, 212, 246, 1) 0%,
                        rgba(171, 212, 246, 0.7) 60%,
                        rgba(171, 212, 246, 0.3) 100%
                      )
                    `,
                }}
            />

            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url('/images/mycelium.webp')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200 backdrop-blur-sm">
                        {/* 404 Icon */}
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                            style={{ backgroundColor: "#004C5A" }}
                        >
                            <span className="text-white text-4xl font-bold">404</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            Page Not
                            <span className="block" style={{ color: "#007A8E" }}>
                                Found
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                            The page you're looking for doesn't exist or has been moved.
                        </p>

                        {/* Navigation buttons */}
                        <div className="space-y-4">
                            <Link
                                to="/dashboard"
                                className="inline-block w-full px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                style={{
                                    background: "linear-gradient(to right, #008096, #96007E)",
                                }}
                            >
                                Go to Dashboard
                            </Link>

                            <Link
                                to="/"
                                className="inline-block w-full px-8 py-4 border-2 text-gray-700 rounded-xl font-semibold transition-all duration-200 bg-white hover:bg-gray-50 hover:shadow-md"
                                style={{ borderColor: "#007A8E" }}
                            >
                                Back to Home
                            </Link>
                        </div>

                        {/* Additional help */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                                Need help? Contact our support team or check the navigation menu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;