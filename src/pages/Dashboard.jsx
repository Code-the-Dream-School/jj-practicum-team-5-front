import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/TimeLine.jsx";
import { derive } from "../utils/derive";
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

// Get color for status badge (aligned with step colors)
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-500 text-white border border-emerald-200";
    case "In Progress":
      return "bg-amber-500 text-white border border-amber-200";
    case "Not Started":
      return "bg-slate-400 text-white border border-slate-200";
    case "Overdue":
      return "bg-rose-500 text-white border border-rose-200";
    default:
      return "bg-gray-400 text-white border border-gray-200";
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
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  // Responsive slides - 1 on mobile, 2 on tablet, 3 on desktop
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleProjects = projects.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const nextSlide = () =>
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(projects.length / itemsPerSlide)
    );
  const prevSlide = () =>
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(projects.length / itemsPerSlide)) %
        Math.ceil(projects.length / itemsPerSlide)
    );

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="relative">
        <div className="relative z-10 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {projects.length === 0 ? (
              <div className="text-center py-4">No projects yet</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {visibleProjects.map((project) => {
                    const { progress, status } = getProjectMeta(project);

                    return (
                      <div
                        key={project._id}
                        className="bg-white bg-opacity-90 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col hover:bg-gray-100"
                        style={{
                          minHeight: "500px",
                          maxHeight: "600px",
                        }}
                      >
                        {/* Image */}
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

                        {/* Status + Due Date */}
                        <div className="flex items-center justify-between mb-2">
                          {/* Status badge */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                          {/* Due Date compact */}
                          <div
                            className="flex items-center px-2 py-1 rounded-md border text-xs sm:text-sm"
                            style={{
                              backgroundColor: "rgba(171, 212, 246, 0.2)",
                              borderColor: "#007A8E",
                            }}
                          >
                            <span
                              className="font-semibold mr-1"
                              style={{ color: "#007A8E" }}
                            >
                              📅
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: "#004C5A" }}
                            >
                              {formatDate(project.dueDate)}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex-shrink-0 line-clamp-2">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <div className="mb-3 sm:mb-4 flex-grow min-h-0">
                          <div className="max-h-16 sm:max-h-20 overflow-y-auto">
                            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                              {project.description ||
                                "No description available"}
                            </p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div
                          className="mb-3 sm:mb-4 flex-grow min-h-0"
                          style={{ minHeight: "80px", maxHeight: "120px" }}
                        >
                          {project.steps?.length > 0 ? (
                            <div className="h-full overflow-y-auto">
                              <Timeline
                                steps={project.steps}
                                onStepClick={(step) =>
                                  navigate(
                                    `/project/${project._id}/step/${step._id}`
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                              No steps defined
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3 sm:mb-4">
                          <ProgressBar progress={progress} />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-auto flex-shrink-0">
                          <button
                            onClick={() => navigate(`/project/${project._id}`)}
                            className="flex-1 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs sm:text-sm"
                            style={{
                              background:
                                "linear-gradient(to right, #008096, #96007E)",
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
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
