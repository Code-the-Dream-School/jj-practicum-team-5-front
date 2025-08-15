// src/pages/ProjectPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// UI
import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";

// --- Local storage helpers ---
const STORAGE_KEY = "steps_v1";
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const save = (steps) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));

// --- Calculate progress & status from subtasks ---
function derive(step) {
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

// Map domain statuses -> UI variants used by Badge/ProgressBar
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

export default function ProjectPage() {
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState(() => {
    const fromLS = load();
    if (fromLS) return fromLS;

    const seed = [
      {
        id: 1,
        title: "Define scope",
        description: "Agree on goals and constraints.",
        dueDate: null,
        subtasks: [
          { id: 1, title: "Write brief", done: true },
          { id: 2, title: "Approve goals", done: true },
        ],
      },
      {
        id: 2,
        title: "Design UI",
        description: "Wireframes and components.",
        dueDate: null,
        subtasks: [
          { id: 1, title: "Wireframes", done: true },
          { id: 2, title: "Color & type", done: false },
          { id: 3, title: "Components", done: false },
        ],
      },
      {
        id: 3,
        title: "Set up backend",
        description: "API & database",
        dueDate: null,
        subtasks: [],
      },
      {
        id: 4,
        title: "Testing phase",
        description: "Unit/E2E",
        dueDate: null,
        subtasks: [
          { id: 1, title: "Unit tests", done: false },
          { id: 2, title: "E2E smoke", done: false },
        ],
      },
    ];
    save(seed);
    return seed;
  });

  useEffect(() => {
    save(steps);
  }, [steps]);

  const addStep = () => {
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    const newStep = {
      id: nextId,
      title: `New Step ${nextId}`,
      description: "",
      dueDate: null,
      subtasks: [],
    };
    const updated = [...steps, newStep];
    setSteps(updated);
    save(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h1 className="text-2xl font-bold">Project</h1>
      </div>

      {/* Project description */}
      <label
        htmlFor="project-desc"
        className="block text-sm text-gray-500 mb-1"
      >
        Description
      </label>
      <textarea
        id="project-desc"
        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
        placeholder="Project description…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Steps */}
      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Key Steps</h2>
        <button
          onClick={addStep}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          + Add Step
        </button>
      </div>

      <div className="mt-2 space-y-3">
        {steps.map((s) => {
          const meta = derive(s);
          const variant = toVariant(meta.status);

          return (
            <Link
              to={`/step/${s.id}`}
              key={s.id}
              className="block p-3 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.title}</div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <ProgressBar status={variant} value={meta.progress} />
                  </div>
                </div>

                {/* Badge + percent */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <Badge status={variant}>{meta.status}</Badge>
                  <span className="text-sm text-gray-600 w-10 text-right">
                    {meta.progress}%
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
