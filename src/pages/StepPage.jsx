// src/pages/StepPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

// UI
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";

// --- storage helpers ---
const STORAGE_KEY = "steps_v1";
const loadSteps = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveSteps = (steps) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));

// --- progress & status from subtasks ---
export function derive(step) {
  const total = step?.subtasks?.length || 0;
  const done = step?.subtasks?.filter((t) => t.done).length || 0;
  const progress = total ? Math.round((done / total) * 100) : 0;

  let status = "Not Started";
  const overdue =
    step?.dueDate && new Date(step.dueDate) < new Date() && done < total;
  if (overdue) status = "Overdue";
  else if (done === 0) status = "Not Started";
  else if (done === total) status = "Completed";
  else status = "In Progress";

  return { progress, status, total, done };
}

// Доменные статусы -> варианты UI-компонентов
const toVariant = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Overdue":
      return "error";
    case "Not Started":
    default:
      return "neutral";
  }
};

// --- page ---
export default function StepPage() {
  const { id } = useParams();
  const stepId = Number(id);
  const location = useLocation();
  const stateStep = location.state?.step || null; // приходит из <Link state={{step}} />

  // Load all steps once
  const [steps, setSteps] = useState(() => loadSteps());

  // Pick the step: prefer stored, else fallback to state
  const initialStep =
    steps.find((s) => s.id === stepId) ||
    (stateStep && stateStep.id === stepId ? stateStep : null);

  const [step, setStep] = useState(initialStep);

  // Если шаг пришёл только из state — вставим его в сторедж
  useEffect(() => {
    if (
      stateStep &&
      stateStep.id === stepId &&
      !steps.find((s) => s.id === stepId)
    ) {
      const inserted = [
        ...steps,
        { ...stateStep, subtasks: stateStep.subtasks || [] },
      ];
      setSteps(inserted);
      saveSteps(inserted);
      setStep(stateStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateStep, stepId]);

  const meta = useMemo(() => derive(step), [step]);
  const variant = toVariant(meta.status);

  if (!step) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="mb-3">Step #{id} not found.</p>
        <Link to="/" className="text-blue-600 underline">
          ← Back to Project
        </Link>
      </div>
    );
  }

  // -- mutations with persist --
  const updateAndPersist = (updated) => {
    setStep(updated);
    const updatedSteps = steps.some((s) => s.id === updated.id)
      ? steps.map((s) => (s.id === updated.id ? updated : s))
      : [...steps, updated];
    setSteps(updatedSteps);
    saveSteps(updatedSteps);
  };

  const setDescription = (val) =>
    updateAndPersist({ ...step, description: val });
  const setDueDate = (val) =>
    updateAndPersist({
      ...step,
      dueDate: val ? new Date(val).toISOString() : null,
    });

  const toggleSubtask = (tid) => {
    const subtasks = (step.subtasks || []).map((t) =>
      t.id === tid ? { ...t, done: !t.done } : t
    );
    updateAndPersist({ ...step, subtasks });
  };
  const editSubtaskTitle = (tid, title) => {
    const subtasks = (step.subtasks || []).map((t) =>
      t.id === tid ? { ...t, title } : t
    );
    updateAndPersist({ ...step, subtasks });
  };
  const addSubtask = () => {
    const list = step.subtasks || [];
    const nextId = list.length ? Math.max(...list.map((t) => t.id)) + 1 : 1;
    updateAndPersist({
      ...step,
      subtasks: [
        ...list,
        { id: nextId, title: `New item ${nextId}`, done: false },
      ],
    });
  };
  const removeSubtask = (tid) =>
    updateAndPersist({
      ...step,
      subtasks: (step.subtasks || []).filter((t) => t.id !== tid),
    });

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
        <Link to="/" className="text-sm px-2 py-1 rounded hover:bg-gray-100">
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
          value={step.dueDate ? step.dueDate.slice(0, 10) : ""}
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
