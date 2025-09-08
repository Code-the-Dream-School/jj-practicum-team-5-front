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

                if (result.projects && result.projects.length > 0) {
                    console.log("Sample project steps structure:", result.projects[0].steps);
                }

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
                return "bg-green-100 text-green-800 border border-green-200";
            case "In Progress":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "Not started":
                return "bg-purple-100 text-purple-800 border border-purple-200";
            case "Overdue":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
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
            <div className="min-h-screen bg-blue-200 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-blue-200 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-md">
                    <div className="text-red-600 text-center">
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
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-200">
            {/* Header Section */}
            <section className="relative py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center relative">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Event Projects
                        </h1>
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
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-6 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-gray-700 font-medium">Total projects: </span>
                            <span className="text-blue-700 font-bold text-lg ml-2">{projects.length}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="py-12 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="relative">
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
                                                    onError={(e) => {
                                                        console.log('Image load error:', e.target.src);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className={project.image ? 'mt-4' : ''}>
                                            <span
                                                className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                                                    project.status
                                                )}`}
                                            >
                                                {project.status}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{project.title}</h3>
                                            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{project.description}</p>
                                            {project.steps && project.steps.length > 0 && <Timeline steps={project.steps} />}
                                            <div className="flex space-x-3 mt-6">
                                                <button
                                                    onClick={() => navigate(`/project/${project._id}`)}
                                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/project/edit/${project._id}`)}
                                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:text-gray-900 transition-all duration-200 bg-white hover:bg-gray-50"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMultipleSlides && (
                                <div className="flex justify-center mt-12 space-x-4">
                                    <button
                                        onClick={prevSlide}
                                        className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium border border-gray-200"
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium border border-gray-200"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}