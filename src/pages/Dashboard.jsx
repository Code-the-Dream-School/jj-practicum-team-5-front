import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/TimeLine.jsx";
import EditProject from "../components/EditProject.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProjectsSliderPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const isAuthenticated = localStorage.getItem("isAuthenticated");
                if (isAuthenticated !== 'true') {
                    navigate("/login");
                    return;

                }
                const token = localStorage.getItem("authToken");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${API_URL}/api/v1/projects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch projects");

                const data = await response.json();
                setProjects(data.projects || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [navigate]);

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Event Projects</h1>

                {projects.length === 0 ? (
                    <p className="text-center text-gray-500">No projects yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                <p className="text-gray-600">{project.description}</p>
                                <Timeline steps={project.steps} />
                            </div>
                        ))}
                    </div>
                )}

                <EditProject
                    project={selectedProject}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={() => {}}
                />
            </div>
        </div>
    );
}
