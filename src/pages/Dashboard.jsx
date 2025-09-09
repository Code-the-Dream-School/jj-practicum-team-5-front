import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/TimeLine.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const formatDate = (dateStr) => {
    if (!dateStr) return "No date";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case "completed":
            return "bg-green-100 text-green-800 border border-green-200";
        case "in progress":
            return "bg-blue-100 text-blue-800 border border-blue-200";
        case "not started":
            return "bg-purple-100 text-purple-800 border border-purple-200";
        case "overdue":
            return "bg-red-100 text-red-800 border border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border border-gray-200";
    }
};

const StatBlock = ({ label, count }) => (
    <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {count}
        </div>
        <div className="text-gray-600 text-sm">{label}</div>
    </div>
);

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("authToken");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await fetch(`${API_URL}/api/v1/projects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch projects: ${response.status} - ${errorText}`);
                }
                const result = await response.json();
                setProjects(result.projects || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [navigate]);

    const visibleProjects = projects.slice(currentSlide * 3, currentSlide * 3 + 3);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / 3));
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(projects.length / 3)) % Math.ceil(projects.length / 3));

    const stats = projects.reduce(
        (acc, project) => {
            const status = project.status?.toLowerCase() || "not started";
            acc.total += 1;
            if (status === "completed") acc.completed += 1;
            else if (status === "in progress") acc.inProgress += 1;
            else if (status === "overdue") acc.overdue += 1;
            else acc.notStarted += 1;
            return acc;
        },
        { total: 0, completed: 0, inProgress: 0, overdue: 0, notStarted: 0 }
    );

    if (loading)
        return (
            <div className="min-h-screen bg-blue-200 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading projects...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-blue-200 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-md text-center text-red-600">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-blue-200">
            {/* Header */}
            <section className="relative py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Event Projects</h1>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                        Manage and track all your event projects in one place
                    </p>
                    <button
                        onClick={() => navigate("/projects/new")}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Add New Project
                    </button>
                </div>
            </section>

            {/* Projects */}
            <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 relative">
                    {projects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-gray-200">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-white text-3xl">📋</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">No Projects Yet</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Start by creating your first event project and begin organizing your tasks efficiently
                                </p>
                                <button
                                    onClick={() => navigate("/projects/new")}
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    Create First Project
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleProjects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
                                    >
                                        {project.image && (
                                            <div className="mb-6 -mx-8 -mt-8">
                                                <img
                                                    src={`${API_URL}${project.image}`}
                                                    alt={project.title}
                                                    className="w-full h-48 object-cover rounded-t-2xl"
                                                    onError={(e) => (e.target.style.display = "none")}
                                                />
                                            </div>
                                        )}
                                        <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{project.title}</h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed flex-grow">{project.description || ""}</p>

                                        <div className="mb-4 flex justify-between items-center bg-blue-100 px-3 py-2 rounded-lg border border-blue-300">
                                            <span className="text-blue-800 font-semibold text-sm">Due Date:</span>
                                            <span className="text-blue-900 font-bold">{formatDate(project.date)}</span>
                                        </div>

                                        {project.steps?.length > 0 && (
                                            <div className="mb-4 max-h-40 overflow-auto">
                                                <Timeline steps={project.steps} />
                                            </div>
                                        )}

                                        <div className="flex space-x-3 mt-auto">
                                            <button
                                                onClick={() => navigate(`/project/${project._id}`)}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => navigate(`/project/edit/${project._id}`)}
                                                className="px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-xl font-semibold hover:border-gray-500 hover:text-gray-900 transition-all duration-200 bg-white hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Slider Arrows */}
                            {projects.length > 3 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-400"
                                        disabled={projects.length <= 3}
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={nextSlide}
                                        className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-400"
                                        disabled={projects.length <= 3}
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Slider Dots */}
                            {Math.ceil(projects.length / 3) > 1 && (
                                <div className="flex justify-center mt-6 space-x-2">
                                    {Array.from({ length: Math.ceil(projects.length / 3) }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                currentSlide === index
                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Statistics */}
            <div className="mt-16 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatBlock label="Total Projects" count={stats.total} />
                <StatBlock label="Completed" count={stats.completed} />
                <StatBlock label="In Progress" count={stats.inProgress} />
                <StatBlock label="Overdue" count={stats.overdue} />
            </div>
        </div>
    );
}

