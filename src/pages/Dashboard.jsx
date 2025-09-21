import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Timeline from "../components/TimeLine.jsx";
import ProgressBar from "../components/ProgressBar";
import { derive } from "../utils/derive";
import ConfirmModal from "../components/ConfirmModal.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return "No date";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate project progress and status
const getProjectMeta = (project) => {
  const steps = project.steps || [];
  if (steps.length === 0) {
    return { progress: 0, status: "Not Started" };
  }

  const total = steps.length * 100;
  const done = steps.reduce((sum, s) => sum + derive(s).progress, 0);
  const progress = Math.round((done / total) * 100);

  let status = "Not Started";
  if (progress === 100) status = "Completed";
  else if (progress > 0) status = "In Progress";

  const due = project.dueDate ? new Date(project.dueDate) : null;
  if (due && !isNaN(due) && status !== "Completed" && due < new Date()) {
    status = "Overdue";
  }

  return { progress, status };
};

// Status colors
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 border border-green-200";
    case "in progress":
      return "text-white border border-opacity-20 border-white bg-gradient-to-r from-blue-600 to-purple-600";
    case "not started":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "overdue":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

// Stats block
const StatBlock = ({ label, count, gradient }) => (
  <div className="bg-white bg-opacity-90 rounded-2xl p-6 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
    <div className="text-3xl font-bold mb-2" style={{ color: gradient }}>
      {count}
    </div>
    <div className="text-gray-600 text-sm font-medium">{label}</div>
  </div>
);

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsUnauthorized(false);
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await fetch(`${API_URL}/api/v1/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            setIsUnauthorized(true);
            setError("Please log in to continue");
          } else {
            const errorText = await response.text();
            setError(
              `Failed to fetch projects: ${response.status} - ${errorText}`
            );
          }
          return;
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

  const visibleProjects = projects.slice(
    currentSlide * 3,
    currentSlide * 3 + 3
  );

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / 3));
  const prevSlide = () =>
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(projects.length / 3)) %
        Math.ceil(projects.length / 3)
    );

  // Stats aggregation
  const stats = projects.reduce(
    (acc, project) => {
      const { status } = getProjectMeta(project);
      acc.total += 1;
      if (status === "Completed") acc.completed += 1;
      else if (status === "In Progress") acc.inProgress += 1;
      else if (status === "Overdue") acc.overdue += 1;
      else acc.notStarted += 1;
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, overdue: 0, notStarted: 0 }
  );
  const handleTryAgain = () => {
    if (isUnauthorized) {
      navigate("/login");
    } else {
      window.location.reload();
    }
  };

  // Loading screen
  const handleDelete = (project) => {
    setSelectedProject(project);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${API_URL}/api/v1/projects/${selectedProject._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== selectedProject._id));
    } catch (err) {
      alert("Error deleting project: " + err.message);
    } finally {
      setConfirmOpen(false);
      setSelectedProject(null);
    }
  };

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `
                       linear-gradient(to bottom,
                         rgba(171, 212, 246, 1) 0%,
                         rgba(171, 212, 246, 0.7) 60%,
                         rgba(171, 212, 246, 0.3) 100%
                       )
                     `,
        }}
      >
        <div className="text-center bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#008096" }}
          ></div>
          <p className="text-gray-700 font-medium">Loading projects...</p>
        </div>
      </div>
    );

  // Error screen
  if (error)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(171, 212, 246, 1) 0%,
              rgba(171, 212, 246, 0.7) 60%,
              rgba(171, 212, 246, 0.3) 100%
            )`,
        }}
      >
        <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200 max-w-md text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={handleTryAgain}
            className="text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            {isUnauthorized ? "Go to Login" : "Try Again"}
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col">
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Event
              <span className="block" style={{ color: "#007A8E" }}>
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Manage and track all your event projects in one place
            </p>
            {projects.length > 0 && (
              <button
                onClick={() => navigate("/projects/new")}
                className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{
                  background: "linear-gradient(to right, #008096, #96007E)",
                }}
              >
                Add New Project
              </button>
            )}
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

        <div className="relative z-10 py-4">
          <div className="max-w-7xl mx-auto px-4 relative">
            {projects.length === 0 ? (
              <div className="text-center py-4">
                <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-gray-200">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={{ backgroundColor: "#004C5A" }}
                  >
                    <span className="text-white text-3xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    No Projects Yet
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Start by creating your first event project and begin
                    organizing your tasks efficiently
                  </p>
                  <button
                    onClick={() => navigate("/projects/new")}
                    className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleProjects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col hover:bg-gray-100"
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
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                        {project.description || ""}
                      </p>

                      <div
                        className="mb-4 flex justify-between items-center px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: "rgba(171, 212, 246, 0.3)",
                          borderColor: "#007A8E",
                        }}
                      >
                        <span
                          className="font-semibold text-sm"
                          style={{ color: "#007A8E" }}
                        >
                          Due Date:
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: "#004C5A" }}
                        >
                          {formatDate(project.date)}
                        </span>
                      </div>

                      {project.steps?.length > 0 && (
                        <Timeline steps={project.steps} />
                      )}

                      <div className="flex space-x-3 mt-auto">
                        {/*View/Edit*/}
                        <button
                          onClick={() => navigate(`/project/${project._id}`)}
                          className="flex-1 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          style={{
                            background:
                              "linear-gradient(to right, #008096, #96007E)",
                          }}
                        >
                          View / Edit
                        </button>

                        {/*Delete*/}
                        <button
                          onClick={() => handleDelete(project)}
                          className="px-6 py-3 border-2 text-gray-700 rounded-xl font-semibold transition-all duration-200 bg-white hover:bg-gray-50 hover:shadow-md"
                          style={{ borderColor: "#DC2626" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider arrows removed */}

                {/* Slider dots  */}
                {Math.ceil(projects.length / 3) > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({
                      length: Math.ceil(projects.length / 3),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        style={
                          currentSlide === index
                            ? {
                                background:
                                  "linear-gradient(to right, #008096, #96007E)",
                              }
                            : {}
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}

          {/* Statistics */}
          {projects.length > 0 && (
            <div className="mt-16 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatBlock
                label="Total Projects"
                count={stats.total}
                gradient="#B40098"
              />
              <StatBlock
                label="Completed"
                count={stats.completed}
                gradient="#4C5A00"
              />
              <StatBlock
                label="In Progress"
                count={stats.inProgress}
                gradient="#007A8E"
              />
              <StatBlock
                label="Overdue"
                count={stats.overdue}
                gradient="#5A004C"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
