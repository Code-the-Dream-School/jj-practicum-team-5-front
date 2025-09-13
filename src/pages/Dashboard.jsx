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
            return "text-white border border-opacity-20"
                + " " + "border-white"
                + " " + "bg-gradient-to-r from-blue-600 to-purple-600";
        case "not started":
            return "bg-purple-100 text-purple-800 border border-purple-200";
        case "overdue":
            return "bg-red-100 text-red-800 border border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border border-gray-200";
    }
};

const StatBlock = ({ label, count, gradient }) => (
    <div className="bg-white bg-opacity-90 rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
        <div
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: gradient }}
        >
            {count}
        </div>
        <div className="text-gray-600 text-xs sm:text-sm font-medium">{label}</div>
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

    // Responsive slides - 1 on mobile, 2 on tablet, 3 on desktop
    const getItemsPerSlide = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
        }
        return 3;
    };

    const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

    useEffect(() => {
        const handleResize = () => {
            setItemsPerSlide(getItemsPerSlide());
            setCurrentSlide(0); // Reset slide on resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const visibleProjects = projects.slice(currentSlide * itemsPerSlide, currentSlide * itemsPerSlide + itemsPerSlide);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / itemsPerSlide));
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + Math.ceil(projects.length / itemsPerSlide)) % Math.ceil(projects.length / itemsPerSlide));

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
            <div className="min-h-screen flex items-center justify-center px-4"
                 style={{
                     background: `
                       linear-gradient(to bottom,
                         rgba(171, 212, 246, 1) 0%,
                         rgba(171, 212, 246, 0.7) 60%,
                         rgba(171, 212, 246, 0.3) 100%
                       )
                     `,
                 }}>
                <div className="text-center bg-white bg-opacity-90 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 max-w-sm mx-auto">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 mx-auto mb-4"
                         style={{ borderColor: "#008096" }}></div>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">Loading projects...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center px-4"
                 style={{
                     background: `
                       linear-gradient(to bottom,
                         rgba(171, 212, 246, 1) 0%,
                         rgba(171, 212, 246, 0.7) 60%,
                         rgba(171, 212, 246, 0.3) 100%
                       )
                     `,
                 }}>
                <div className="bg-white bg-opacity-90 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 max-w-md mx-auto text-center text-red-600">
                    <h2 className="text-lg sm:text-xl font-bold mb-2">Error</h2>
                    <p className="text-gray-700 mb-4 text-sm sm:text-base">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                        style={{
                            background: "linear-gradient(to right, #008096, #96007E)",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Hero section with gradient blue strip background */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                          linear-gradient(to bottom,
                            rgba(171, 212, 246, 1) 0%,
                            rgba(171, 212, 246, 0.9) 60%,
                            rgba(171, 212, 246, 0.5) 80%,
                            rgba(171, 212, 246, 0) 100%
                          )
                        `,
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 z-10">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            Event
                            <span className="block" style={{ color: "#007A8E" }}>
                                Projects
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Manage and track all your event projects in one place
                        </p>
                        <button
                            onClick={() => navigate("/projects/new")}
                            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                            style={{
                                background: "linear-gradient(to right, #008096, #96007E)",
                            }}
                        >
                            Add New Project
                        </button>
                    </div>
                </div>
            </section>

            {/* Projects section with mycelium background */}
            <section className="relative">
                {/* Background with fade effect */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(to top,
                                    rgba(255,255,255,0) 10%,
                                    rgba(255,255,255,1) 100%
                                ),
                                url('/images/mycelium.webp')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                </div>

                <div className="relative z-10 py-6 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        {projects.length === 0 ? (
                            <div className="text-center py-4">
                                <div className="bg-white bg-opacity-90 rounded-2xl p-6 sm:p-8 shadow-xl max-w-md mx-auto border border-gray-200">
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                                        style={{ backgroundColor: "#004C5A" }}
                                    >
                                        <span className="text-white text-2xl sm:text-3xl">📋</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
                                    <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                                        Start by creating your first event project and begin organizing your tasks efficiently
                                    </p>
                                    <button
                                        onClick={() => navigate("/projects/new")}
                                        className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                                        style={{
                                            background: "linear-gradient(to right, #008096, #96007E)",
                                        }}
                                    >
                                        Create First Project
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                    {visibleProjects.map((project) => (
                                        <div
                                            key={project._id}
                                            className="bg-white bg-opacity-90 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col hover:bg-gray-100"
                                            style={{
                                                minHeight: "500px",
                                                maxHeight: "600px"
                                            }}
                                        >
                                            {/* Image section with responsive height */}
                                            {project.image ? (
                                                <div className="mb-2 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 flex-shrink-0">
                                                    <img
                                                        src={`${API_URL}${project.image}`}
                                                        alt={project.title}
                                                        className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-t-2xl"
                                                        onError={(e) => (e.target.style.display = "none")}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="mb-2 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 flex-shrink-0 h-32 sm:h-40 lg:h-48" />
                                            )}

                                            {/* Status */}
                                            <div className="flex-shrink-0 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex-shrink-0 line-clamp-2">
                                                {project.title}
                                            </h3>

                                            {/* Description with scrolling */}
                                            <div className="mb-3 sm:mb-4 flex-grow min-h-0">
                                                <div className="max-h-16 sm:max-h-20 overflow-y-auto">
                                                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                                                        {project.description || "No description available"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Due Date */}
                                            <div
                                                className="mb-3 sm:mb-4 flex justify-between items-center px-2 sm:px-3 py-2 rounded-lg border flex-shrink-0"
                                                style={{
                                                    backgroundColor: "rgba(171, 212, 246, 0.3)",
                                                    borderColor: "#007A8E"
                                                }}
                                            >
                                                <span className="font-semibold text-xs sm:text-sm" style={{ color: "#007A8E" }}>Due Date:</span>
                                                <span className="font-bold text-xs sm:text-sm" style={{ color: "#004C5A" }}>{formatDate(project.dueDate)}</span>
                                            </div>

                                            {/* Timeline with scrolling */}
                                            <div className="mb-3 sm:mb-4 flex-grow min-h-0" style={{ minHeight: "80px", maxHeight: "120px" }}>
                                                {project.steps?.length > 0 ? (
                                                    <div className="h-full overflow-y-auto">
                                                        <Timeline steps={project.steps} />
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                                                        No steps defined
                                                    </div>
                                                )}
                                            </div>

                                            {/* Buttons - always at bottom */}
                                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-auto flex-shrink-0">
                                                <button
                                                    onClick={() => navigate(`/project/${project._id}`)}
                                                    className="flex-1 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs sm:text-sm"
                                                    style={{
                                                        background: "linear-gradient(to right, #008096, #96007E)",
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/project/${project._id}`)}
                                                    className="px-4 sm:px-6 py-2 sm:py-3 border-2 text-gray-700 rounded-xl font-semibold transition-all duration-200 bg-white hover:bg-gray-50 hover:shadow-md text-xs sm:text-sm"
                                                    style={{ borderColor: "#007A8E" }}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Slider Arrows - Hide on mobile */}
                                {projects.length > itemsPerSlide && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="hidden lg:block absolute -left-8 xl:-left-12 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border"
                                            style={{ borderColor: "#007A8E" }}
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#007A8E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={nextSlide}
                                            className="hidden lg:block absolute -right-8 xl:-right-12 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border"
                                            style={{ borderColor: "#007A8E" }}
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#007A8E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}

                                {/* Slider Dots */}
                                {Math.ceil(projects.length / itemsPerSlide) > 1 && (
                                    <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
                                        {Array.from({ length: Math.ceil(projects.length / itemsPerSlide) }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                                    currentSlide === index
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                                                        : "bg-gray-300 hover:bg-gray-400"
                                                }`}
                                                style={currentSlide === index ? { background: "linear-gradient(to right, #008096, #96007E)" } : {}}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Mobile Navigation Buttons */}
                                {projects.length > itemsPerSlide && (
                                    <div className="flex justify-center mt-4 space-x-4 lg:hidden">
                                        <button
                                            onClick={prevSlide}
                                            className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border"
                                            style={{ borderColor: "#007A8E" }}
                                        >
                                            <svg className="w-5 h-5" style={{ color: "#007A8E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border"
                                            style={{ borderColor: "#007A8E" }}
                                        >
                                            <svg className="w-5 h-5" style={{ color: "#007A8E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Statistics - responsive grid */}
                    <div className="mt-8 sm:mt-12 lg:mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        <StatBlock label="Total Projects" count={stats.total} gradient="#B40098" />
                        <StatBlock label="Completed" count={stats.completed} gradient="#4C5A00" />
                        <StatBlock label="In Progress" count={stats.inProgress} gradient="#007A8E" />
                        <StatBlock label="Overdue" count={stats.overdue} gradient="#5A004C" />
                    </div>
                </div>
            </section>
        </div>
    );
}