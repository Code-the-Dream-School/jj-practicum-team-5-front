import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

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

const pillCls = (status) =>
  status === "Completed"
    ? "border-green-500 text-green-600 bg-green-100"
    : status === "In Progress"
    ? "border-orange-500 text-orange-600 bg-orange-100"
    : status === "Overdue"
    ? "border-red-500 text-red-600 bg-red-100"
    : "border-gray-400 text-gray-600 bg-white";

// --- page ---
export default function StepPage() {
  const { id } = useParams();
  const stepId = Number(id);
  const location = useLocation();
  const stateStep = location.state?.step || null; // comes from <Link state={{step}} />

  // Load all steps once
  const [steps, setSteps] = useState(() => loadSteps());

  // Pick the step: prefer stored, else fallback to state
  const initialStep =
    steps.find((s) => s.id === stepId) ||
    (stateStep && stateStep.id === stepId ? stateStep : null);

  const [step, setStep] = useState(initialStep);

  // If step only came from state but not in storage — insert & persist it
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
        <span
          className={`ml-auto px-3 py-1 text-xs font-medium rounded-full border ${pillCls(
            meta.status
          )}`}
        >
          {meta.status}
        </span>
      </div>

      {/* Description */}
      <label className="block text-sm text-gray-600 mb-1">Description</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
        placeholder="Describe this step…"
        value={step.description || ""}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Due date */}
      <div className="mt-4">
        <label className="block text-sm text-gray-600 mb-1">Due date</label>
        <input
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
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-2 transition-[width] ${
              meta.status === "Completed"
                ? "bg-green-500"
                : meta.status === "In Progress"
                ? "bg-orange-500"
                : meta.status === "Overdue"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
            style={{ width: `${meta.progress}%` }}
          />
        </div>
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
