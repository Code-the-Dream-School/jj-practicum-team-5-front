import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";
import Timeline from "../components/TimeLine";

import { getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Format date for UI
const formatDate = (dateStr) => {
  if (!dateStr) return "Not set";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a single project from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/v1/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Failed to fetch project: ${response.status} - ${text}`
          );
        }

        const result = await response.json();
        setProject(result.project || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  // Derive meta
  const meta = useMemo(() => derive(project || {}), [project]);
  const variant = toVariant(meta.status);
  const projectDueInfo = getDueInfo(project?.dueDate, meta.progress === 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-gray-200 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Project not found
          </h3>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero section with gradient strip background */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(171, 212, 246, 1) 0%,
                rgba(171, 212, 246, 0.9) 40%,
                rgba(171, 212, 246, 0.5) 70%,
                rgba(171, 212, 246, 0) 100%
              )
            `,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10">
          {/* Header card */}
          <div className="bg-white bg-opacity-90 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 mb-6">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                style={{
                  background: "linear-gradient(to right, #008096, #96007E)",
                }}
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                Project:{" "}
                <span style={{ color: "#007A8E" }}>{project.title}</span>
              </h1>
              <div className="flex items-center gap-3">
                <Badge status={variant}>{meta.status}</Badge>
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#B40098" }}
                  >
                    {meta.progress}%
                  </div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
            </div>
            <DueBanner
              dueInfo={projectDueInfo}
              text="Less than 24 hours to deadline!"
            />
          </div>

          {/* Main content card */}
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600 text-sm">
                {project.description || "No description available"}
              </p>
            </div>

            {/* Due date */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Due Date
              </h2>
              <p className="text-gray-600 text-sm">
                {formatDate(project.dueDate)}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-900">
                  Progress
                </div>
                <div className="text-xs text-gray-500">
                  {meta.done}/{meta.total} tasks • {meta.progress}%
                </div>
              </div>
              <ProgressBar status={variant} value={meta.progress} />
            </div>

            {/* Steps / Timeline */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Steps
              </h2>
              {project.steps?.length > 0 ? (
                <Timeline
                  steps={project.steps}
                  onStepClick={(step) =>
                    navigate(
                      `/project/${project._id || project.id}/step/${
                        step._id || step.id
                      }`
                    )
                  }
                />
              ) : (
                <p className="text-gray-500 text-sm">No steps defined</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
