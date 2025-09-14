import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/TimeLine.jsx";
import { derive, toVariant } from "../utils/derive";
import ProgressBar from "../components/ProgressBar";

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

// Get color for status badge
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border border-green-200";
    case "In Progress":
      return "text-white border border-opacity-20 border-white bg-gradient-to-r from-blue-600 to-purple-600";
    case "Not Started":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "Overdue":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

// Calculate project progress & status from its steps
const getProjectMeta = (project) => {
  const steps = project.steps || [];
  const total = steps.length;
  const done = steps.filter((s) => derive(s).progress === 100).length;

  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  let status = "Not Started";
  if (progress === 100) status = "Completed";
  else if (done > 0) status = "In Progress";

  return { progress, status };
};

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
          throw new Error(
            `Failed to fetch projects: ${response.status} - ${errorText}`
          );
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

  // Statistics
  const stats = projects.reduce(
    (acc, project) => {
      const meta = getProjectMeta(project);
      acc.total += 1;
      if (meta.status === "Completed") acc.completed += 1;
      else if (meta.status === "In Progress") acc.inProgress += 1;
      else if (meta.status === "Overdue") acc.overdue += 1;
      else acc.notStarted += 1;
      return acc;
    },
    { total: 0, completed: 0, inProgress: 0, overdue: 0, notStarted: 0 }
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading projects...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Projects section */}
      <section className="relative">
        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 relative">
            {projects.length === 0 ? (
              <div className="text-center py-12">
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
                  {visibleProjects.map((project) => {
                    const meta = getProjectMeta(project);

                    return (
                      <div
                        key={project._id}
                        className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full hover:bg-gray-100"
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
                            meta.status
                          )}`}
                        >
                          {meta.status}
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
                            {formatDate(project.dueDate)}
                          </span>
                        </div>

                        {/* Project progress bar */}
                        <div className="mb-4">
                          <ProgressBar
                            status={toVariant(meta.status)}
                            value={meta.progress}
                          />
                        </div>

                        {project.steps?.length > 0 && (
                          <div className="mb-4 max-h-40 overflow-auto">
                            <Timeline steps={project.steps} />
                          </div>
                        )}

                        <div className="flex space-x-3 mt-auto">
                          <button
                            onClick={() => navigate(`/project/${project._id}`)}
                            className="flex-1 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            style={{
                              background:
                                "linear-gradient(to right, #008096, #96007E)",
                            }}
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => navigate(`/project/${project._id}`)}
                            className="px-6 py-3 border-2 text-gray-700 rounded-xl font-semibold transition-all duration-200 bg-white hover:bg-gray-50 hover:shadow-md"
                            style={{ borderColor: "#007A8E" }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Statistics */}
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
        </div>
      </section>
    </div>
  );
}
