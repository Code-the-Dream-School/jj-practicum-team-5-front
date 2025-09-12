import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";

import { getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function StepPage() {
  const { projectId, stepId: stepIdParam } = useParams(); // /project/:projectId/step/:stepId
  const stepId = Number(stepIdParam);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load project from server
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
        setProject(data.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Find current step
  const step = useMemo(() => {
    if (!project) return null;
    return (project.steps || []).find((s) => s.id === stepId) || null;
  }, [project, stepId]);

  // Save project to backend
  const saveProject = async (updatedProject) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/v1/projects/${project._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProject),
      });
      if (!res.ok) throw new Error("Failed to update project");
      const data = await res.json();
      setProject(data.data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // Update a step
  const updateStep = (updater) => {
    if (!project || !step) return;
    const updatedSteps = (project.steps || []).map((s) =>
      s.id === step.id ? updater(s) : s
    );
    const updatedProject = { ...project, steps: updatedSteps };
    setProject(updatedProject); // optimistic update
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
      const nextId = list.length
        ? Math.max(...list.map((t) => Number(t.id) || 0)) + 1
        : 1;
      return {
        ...s,
        subtasks: [
          ...list,
          { id: nextId, title: `New item ${nextId}`, done: false },
        ],
      };
    });
  const removeSubtask = (tid) =>
    updateStep((s) => ({
      ...s,
      subtasks: (s.subtasks || []).filter((t) => t.id !== tid),
    }));

  // Derived meta
  const meta = useMemo(() => derive(step || {}), [step]);
  const variant = toVariant(meta.status);
  const stepDueInfo = getDueInfo(step?.dueDate, meta.progress === 100);

  if (loading) {
    return <div className="p-6 text-center">Loading step…</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load step: {error}
      </div>
    );
  }
  if (!project || !step) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="mb-3">
          {(!project && "Project not found.") || (!step && "Step not found.")}
        </p>
        <Link
          to={project ? `/project/${project._id}` : "/dashboard"}
          className="text-blue-600 underline"
        >
          ← Back to Project
        </Link>
      </div>
    );
  }

  // UI
  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
        <Link
          to={`/project/${project._id}`}
          className="text-sm px-2 py-1 rounded hover:bg-gray-100"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-semibold">Step: {step.title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Badge status={variant}>{meta.status}</Badge>
          <span className="text-xs text-gray-500 w-12 text-right">
            {meta.progress}%
          </span>
        </div>
      </div>

      {/* <24h warning */}
      <DueBanner
        dueInfo={stepDueInfo}
        text="less than 24 hours to the deadline"
      />

      {/* Description */}
      <label htmlFor="step-desc" className="block text-sm text-gray-600 mb-1">
        Description
      </label>
      <textarea
        id="step-desc"
        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
        placeholder="Describe this step…"
        value={step.description || ""}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Due date */}
      <div className="mt-4">
        <label htmlFor="due-date" className="block text-sm text-gray-600 mb-1">
          Due date
        </label>
        <input
          id="due-date"
          type="date"
          value={step.dueDate ? step.dueDate.substring(0, 10) : ""}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-gray-600">Progress</div>
          <div className="text-xs text-gray-500">
            {meta.done}/{meta.total} • {meta.progress}%
          </div>
        </div>
        <ProgressBar status={variant} value={meta.progress} />
      </div>

      {/* Subtasks */}
      <h2 className="mt-6 mb-2 text-sm font-semibold text-gray-700">
        Subtasks
      </h2>
      <div className="space-y-2">
        {(step.subtasks || []).map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg"
          >
            <input
              type="checkbox"
              checked={!!t.done}
              onChange={() => toggleSubtask(t.id)}
              className="h-4 w-4"
            />
            <input
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
              value={t.title}
              onChange={(e) => editSubtaskTitle(t.id, e.target.value)}
            />
            <button
              onClick={() => removeSubtask(t.id)}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <button
          onClick={addSubtask}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          + Add Subtask
        </button>
      </div>
    </div>
  );
}
