import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/TimeLine.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
                console.log("Token:", token);

                if (!token) {
                    navigate("/login");
                    return;
                }

                console.log("Fetching projects from:", `${API_URL}/api/v1/projects`);

                const response = await fetch(`${API_URL}/api/v1/projects`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                console.log("Response status:", response.status);
                console.log("Response ok:", response.ok);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch projects: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                console.log("Full response from server:", result);
                console.log("Projects array:", result.projects);
                console.log("Projects count:", result.projects?.length || 0);

                setProjects(result.projects || []);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            case "Not started":
                return "bg-purple-100 text-purple-800";
            case "Overdue":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / 3));
    const prevSlide = () =>
        setCurrentSlide(
            (prev) => (prev - 1 + Math.ceil(projects.length / 3)) % Math.ceil(projects.length / 3)
        );
    const goToSlide = (index) => setCurrentSlide(index);

    const visibleProjects = projects.slice(currentSlide * 3, currentSlide * 3 + 3);
    const hasMultipleSlides = projects.length > 3;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md">
                    <div className="text-red-600 text-center">
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 relative">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Projects</h1>
                    <button
                        onClick={() => navigate("/projects/new")}
                        className="absolute top-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium text-sm hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        Add New Project
                    </button>
                </div>


                <div className="text-center mb-6">
                    <p className="text-gray-600">Total projects: {projects.length}</p>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Yet</h3>
                            <p className="text-gray-600 mb-6">Start by creating your first event project!</p>
                            <button
                                onClick={() => navigate("/projects/new")}
                                className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                Create First Project
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative px-16">
                        <div className="overflow-hidden rounded-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {visibleProjects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl flex flex-col h-full"
                                    >
                                        {project.image && (
                                            <div className="mb-4 -mx-6 -mt-6">
                                                <img
                                                    src={`${API_URL}${project.image}`}
                                                    alt={project.title}
                                                    className="w-full h-48 object-cover rounded-t-2xl"
                                                    onError={(e) => {
                                                        console.log('Image load error:', e.target.src);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className={project.image ? 'mt-4' : ''}>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 mt-3">{project.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                                            {project.steps && project.steps.length > 0 && <Timeline steps={project.steps} />}
                                            <div className="flex space-x-2 mt-4">
                                                <button
                                                    onClick={() => navigate(`/project/${project._id}`)}
                                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {hasMultipleSlides && (
                            <div className="flex justify-center mt-8 space-x-4">
                                <button
                                    onClick={prevSlide}
                                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow transition-colors duration-200"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow transition-colors duration-200"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}