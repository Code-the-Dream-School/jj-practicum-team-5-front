import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/TimeLine.jsx";
import EditProject from "../components/EditProject.jsx";

export default function ProjectsSliderPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/v1/projects");
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const openEditModal = (project) => {
        setSelectedProject(project);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProject(null);
    };

    const handleSaveProject = async (updatedProject) => {
        try {
            const response = await fetch(`/api/v1/projects/${updatedProject.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProject),
            });

            if (!response.ok) {
                throw new Error("Failed to update project");
            }
            const savedProject = await response.json();
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project.id === savedProject.id ? savedProject : project
                )
            );
        } catch (err) {
            console.error(err);
            alert("Error saving project");
        }
        closeEditModal();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Not started':
                return 'bg-purple-100 text-purple-800';
            case 'Overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const totalSlides = Math.ceil(projects.length / 3);
    const shouldShowSlider = projects.length > 3;

    const nextSlide = () => {
        if (shouldShowSlider) {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }
    };

    const prevSlide = () => {
        if (shouldShowSlider) {
            setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        }
    };

    const goToSlide = (index) => {
        if (shouldShowSlider) {
            setCurrentSlide(index);
        }
    };

    const visibleProjects = shouldShowSlider
        ? projects.slice(currentSlide * 3, currentSlide * 3 + 3)
        : projects;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-xl text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12 relative">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Event Projects
                    </h1>
                    <button
                        onClick={() => navigate('/project/new')}
                        className="absolute top-0 right-16 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium text-sm hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Project</span>
                    </button>
                </div>

                <div className="p-6">
                    {projects.length > 0 ? (
                        <>
                            <div className={`relative ${shouldShowSlider ? 'px-16' : ''}`}>
                                <div className="overflow-hidden rounded-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {visibleProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl flex flex-col h-full"
                                            >
                                                <div className="w-full h-48 rounded-xl mb-4 overflow-hidden">
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div
                                                        className="w-full h-48 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl flex items-center justify-center text-gray-500 text-sm"
                                                        style={{ display: 'none' }}
                                                    >
                                                        Image not available
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                    {project.title}
                                                </h3>

                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                                    {project.description}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Date:</span>
                                                        <span className="font-medium text-gray-700">{project.date}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-4 border-t pt-3">
                                                    <Timeline steps={project.steps} />
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/project/${project.id}`)}
                                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(project)}
                                                        className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-xl font-medium text-sm hover:border-gray-400 hover:text-gray-700 transition-all duration-300"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {shouldShowSlider && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-400"
                                        >
                                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-400"
                                        >
                                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {shouldShowSlider && totalSlides > 1 && (
                                <div className="flex justify-center mt-8 space-x-2">
                                    {Array.from({ length: totalSlides }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {projects.length}
                                    </div>
                                    <div className="text-gray-600 text-sm">Total Projects</div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {projects.filter(p => p.status === 'Completed').length}
                                    </div>
                                    <div className="text-gray-600 text-sm">Completed</div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {projects.filter(p => p.status === 'In Progress').length}
                                    </div>
                                    <div className="text-gray-600 text-sm">In Progress</div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {projects.filter(p => p.status === 'Overdue').length}
                                    </div>
                                    <div className="text-gray-600 text-sm">Overdue</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 italic text-center">No projects yet</p>
                    )}
                </div>

                <EditProject
                    project={selectedProject}
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={handleSaveProject}
                />
            </div>
        </div>
    );
}