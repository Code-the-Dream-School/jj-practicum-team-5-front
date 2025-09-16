import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";
import NewStepModal from "../components/NewStepModal";

import { getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ProjectPage() {
  const { projectId } = useParams();

  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewStep, setShowNewStep] = useState(false);

  // Load project from backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        setCurrent(data.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Helper to update project both locally and on server
  const updateCurrentProject = async (updates) => {
    if (!current) return;
    const token = localStorage.getItem("authToken");

    // Prepare updated project object
    let updated = { ...current, ...updates };

    // 🔥 Ensure steps keep their _id when saving
    if (updated.steps) {
      updated.steps = updated.steps.map((s) => ({
        ...s,
        _id: s._id, // keep backend ID
      }));
    }

    // Optimistic update (update UI immediately)
    setCurrent(updated);

    try {
      const res = await fetch(`${API_URL}/api/v1/projects/${current._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update project");

      // Sync state with server response
      const data = await res.json();
      setCurrent(data.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Handlers
  const onChangeDescription = (e) =>
    updateCurrentProject({ description: e.target.value });

  const onChangeProjectDue = (value) =>
    updateCurrentProject({ dueDate: value || null });

  const setStepDueDate = (stepId, value) => {
    const steps = (current.steps || []).map((s) =>
      String(s._id || s.id) === String(stepId)
        ? { ...s, dueDate: value || null }
        : s
    );
    updateCurrentProject({ steps });
  };

  const createStepFromModal = ({ title, description, dueDate }) => {
    if (!current) return;
    const steps = current.steps || [];
    const nextId = steps.length
      ? Math.max(...steps.map((s) => Number(s.id) || 0)) + 1
      : 1;

    const newStep = {
      id: nextId,
      title: title || `New Step ${nextId}`,
      description: description || "",
      dueDate: dueDate || null,
      completed: false,
      subtasks: [],
    };

    updateCurrentProject({ steps: [...steps, newStep] });
  };

  // Derived flags
  const allStepsDone = useMemo(
    () => (current?.steps || []).every((s) => derive(s).progress === 100),
    [current?.steps]
  );
  const projectDueInfo = useMemo(
    () => getDueInfo(current?.dueDate, allStepsDone),
    [current?.dueDate, allStepsDone]
  );
  const projectOverdue = projectDueInfo?.overdue;

  // Loading & error states
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `
                    linear-gradient(to bottom,
                        rgba(171, 212, 246, 1) 0%,
                        rgba(171, 212, 246, 0.3) 100%
                    )
                `,
        }}
      >
        <div className="text-center p-8 rounded-2xl bg-white bg-opacity-90 shadow-xl">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `
                    linear-gradient(to bottom,
                        rgba(171, 212, 246, 1) 0%,
                        rgba(171, 212, 246, 0.3) 100%
                    )
                `,
        }}
      >
        <div className="text-center p-8 rounded-2xl bg-white bg-opacity-90 shadow-xl max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-red-500">⚠</div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load project
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-2 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `
                    linear-gradient(to bottom,
                        rgba(171, 212, 246, 1) 0%,
                        rgba(171, 212, 246, 0.3) 100%
                    )
                `,
        }}
      >
        <div className="text-center p-8 rounded-2xl bg-white bg-opacity-90 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Project not found
          </h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-2 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // UI
  return (
    <div
      className="min-h-screen"
      style={{
        background: `
                linear-gradient(to bottom,
                    rgba(171, 212, 246, 1) 0%,
                    rgba(171, 212, 246, 0.5) 40%,
                    rgba(171, 212, 246, 0.2) 100%
                )
            `,
      }}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            ← Back to Projects
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-200 pb-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {current.title?.trim() || "Untitled project"}
              </h1>
              {current.createdAt && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#007A8E" }}
                  ></div>
                  Created {new Date(current.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Project deadline + Overdue badge */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <label
                htmlFor="project-due"
                className="text-sm font-medium text-gray-700"
              >
                Project due
              </label>
              <input
                id="project-due"
                type="date"
                value={current.dueDate ? current.dueDate.substring(0, 10) : ""}
                onChange={(e) => onChangeProjectDue(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {projectOverdue && (
                <div className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                  Overdue
                </div>
              )}
            </div>
          </div>

          {/* Project <24h warning */}
          <DueBanner
            dueInfo={projectDueInfo}
            text="less than 24 hours to the project deadline"
          />

          {/* Description */}
          <div>
            <label
              htmlFor="project-desc"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="project-desc"
              className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white bg-opacity-70"
              placeholder="Project description…"
              value={current.description || ""}
              onChange={onChangeDescription}
              rows={4}
            />
          </div>
        </div>

        {/* Steps Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
          {/* Steps Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Key Steps</h2>
            <button
              onClick={() => setShowNewStep(true)}
              className="inline-flex items-center px-6 py-2 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-white"
              style={{
                background: "linear-gradient(to right, #96007E, #809600)",
              }}
            >
              + Add Step
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {(current.steps || []).length === 0 ? (
              <div className="text-center py-12">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{ backgroundColor: "#004C5A" }}
                >
                  <div className="text-white text-2xl">📝</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No steps yet
                </h3>
                <p className="text-gray-600">
                  Start by adding your first project step
                </p>
              </div>
            ) : (
              (current.steps || []).map((s) => {
                const meta = derive(s);
                const variant = toVariant(meta.status);
                return (
                  <Link
                    to={`/project/${current._id}/step/${s._id || s.id}`}
                    key={s._id || s.id}
                    className="block p-6 border border-gray-200 rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-90 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-900 mb-3">
                          {s.title}
                        </div>

                        {/* Inline step due date */}
                        <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded-lg p-3">
                          <label
                            className="text-sm font-medium text-gray-700"
                            htmlFor={`due-${current._id}-${s._id || s.id}`}
                          >
                            Due date
                          </label>
                          <input
                            id={`due-${current._id}-${s._id || s.id}`}
                            type="date"
                            value={s.dueDate ? s.dueDate.substring(0, 10) : ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setStepDueDate(s._id || s.id, e.target.value);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>

                        {/* Progress bar */}
                        <div>
                          <ProgressBar status={variant} value={meta.progress} />
                        </div>
                      </div>

                      {/* Badge + percent */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        <Badge status={variant}>{meta.status}</Badge>
                        <div
                          className="text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
                          style={{
                            backgroundColor:
                              variant === "success"
                                ? "#4C5A00"
                                : variant === "warning"
                                ? "#5A004C"
                                : "#004C5A",
                          }}
                        >
                          {meta.progress}%
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Modal to create a new step */}
        <NewStepModal
          open={showNewStep}
          onClose={() => setShowNewStep(false)}
          onCreate={createStepFromModal}
        />
      </div>
    </div>
  );
}
