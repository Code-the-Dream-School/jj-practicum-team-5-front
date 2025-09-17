import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";

import { getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function StepPage() {
  const { projectId, stepId: stepIdParam } = useParams();
  const stepId = String(stepIdParam);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load project from backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch project");

        const data = await res.json();
        setProject(data.project || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const step = useMemo(() => {
    if (!project) return null;
    return (project.steps || []).find((s) => String(s._id || s.id) === stepId);
  }, [project, stepId]);

  const meta = useMemo(() => derive(step || {}), [step]);
  const variant = toVariant(meta.status);
  const stepDueInfo = getDueInfo(step?.dueDate, meta.progress === 100);

  // Save whole project after editing a step
  const saveProject = async (updated) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await fetch(`${API_URL}/api/v1/projects/${project._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to save step");
      const data = await res.json();
      setProject(data.data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const updateStep = (updater) => {
    if (!project) return;
    const updatedSteps = (project.steps || []).map((s) =>
      String(s._id || s.id) === stepId ? updater(s) : s
    );
    const updatedProject = { ...project, steps: updatedSteps };
    setProject(updatedProject);
    saveProject(updatedProject);
  };

  // Handlers
  const setDescription = (val) =>
    updateStep((s) => ({ ...s, description: val }));

  const setDueDate = (val) =>
    updateStep((s) => ({ ...s, dueDate: val || null }));

  const toggleSubtask = (tid) =>
    updateStep((s) => ({
      ...s,
      subtasks: (s.subtasks || []).map((t) =>
        t.id === tid ? { ...t, done: !t.done } : t
      ),
    }));

  const editSubtaskTitle = (tid, title) =>
    updateStep((s) => ({
      ...s,
      subtasks: (s.subtasks || []).map((t) =>
        t.id === tid ? { ...t, title } : t
      ),
    }));

  const addSubtask = () =>
    updateStep((s) => {
      const list = s.subtasks || [];
      const nextId =
        list.length && typeof list[0]?.id === "number"
          ? Math.max(...list.map((t) => Number(t.id) || 0)) + 1
          : list.length + 1;
      return {
        ...s,
        subtasks: [
          ...list,
          { id: nextId, title: "", done: false }, // placeholder only in UI
        ],
      };
    });

  const removeSubtask = (tid) =>
    updateStep((s) => ({
      ...s,
      subtasks: (s.subtasks || []).filter((t) => t.id !== tid),
    }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading step…</p>
      </div>
    );
  }

  if (error || !project || !step) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-xl max-w-md mx-auto border border-gray-200 text-center">
          <p className="mb-4 text-lg text-gray-700">
            {error || "Step not found."}
          </p>
          <Link
            to={project ? `/project/${project._id}` : "/dashboard"}
            className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            ← Back to Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
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
        <div className="relative z-10 max-w-4xl mx-auto p-6 pt-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 bg-opacity-95">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
              <Link
                to={`/project/${project._id}`}
                className="inline-flex items-center px-4 py-2 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                style={{
                  background: "linear-gradient(to right, #008096, #96007E)",
                }}
              >
                ← Back to Project
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                Step: <span style={{ color: "#007A8E" }}>{step.title}</span>
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
              dueInfo={stepDueInfo}
              text="Less than 24 hours to deadline!"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 bg-opacity-95 overflow-hidden">
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <label
                  htmlFor="step-desc"
                  className="block text-lg font-semibold text-gray-900 mb-3"
                >
                  Description
                </label>
                <textarea
                  id="step-desc"
                  className="w-full p-4 border border-gray-300 rounded-xl text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe this step in detail…"
                  value={step.description || ""}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Due date + progress */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label
                    htmlFor="due-date"
                    className="block text-lg font-semibold text-gray-900 mb-3"
                  >
                    Due Date
                  </label>
                  <input
                    id="due-date"
                    type="date"
                    value={step.dueDate ? step.dueDate.substring(0, 10) : ""}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold text-gray-900">
                      Progress
                    </div>
                    <div className="text-sm text-gray-600 bg-white rounded-lg px-3 py-1 shadow-sm">
                      {meta.done}/{meta.total} tasks • {meta.progress}%
                    </div>
                  </div>
                  <ProgressBar status={variant} progress={meta.progress} />
                </div>
              </div>

              {/* Subtasks */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Subtasks</h2>
                  <button
                    onClick={addSubtask}
                    className="inline-flex items-center px-4 py-2 font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-white transform hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(to right, #96007E, #809600)",
                    }}
                  >
                    + Add Subtask
                  </button>
                </div>

                <div className="space-y-3">
                  {(step.subtasks || []).map((t, index) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-semibold text-gray-500 w-8">
                          #{index + 1}
                        </span>
                        <input
                          type="checkbox"
                          checked={!!t.done}
                          onChange={() => toggleSubtask(t.id)}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <input
                        className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={t.title}
                        onChange={(e) => editSubtaskTitle(t.id, e.target.value)}
                        placeholder={`Subtask ${index + 1}`}
                      />
                      <button
                        onClick={() => removeSubtask(t.id)}
                        className="text-sm px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span className="font-semibold" style={{ color: "#008096" }}>
                    {meta.done}
                  </span>{" "}
                  completed •
                  <span className="font-semibold" style={{ color: "#96007E" }}>
                    {meta.total - meta.done}
                  </span>{" "}
                  remaining
                </div>
                <div className="text-xs">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
