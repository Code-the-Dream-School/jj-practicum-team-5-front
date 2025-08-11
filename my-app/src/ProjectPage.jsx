import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  // Badge and progress bar colors
  const badge = (status) =>
    status === "Completed"
      ? "border-green-500 text-green-700 bg-green-100"
      : status === "In Progress"
      ? "border-orange-500 text-orange-700 bg-orange-100"
      : status === "Overdue"
      ? "border-red-500 text-red-700 bg-red-100"
      : "border-gray-400 text-gray-600 bg-white";

  const bar = (status) =>
    status === "Completed"
      ? "bg-green-500"
      : status === "In Progress"
      ? "bg-orange-500"
      : status === "Overdue"
      ? "bg-red-500"
      : "bg-white border border-gray-400";

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h1 className="text-2xl font-bold">Project</h1>
      </div>

      {/* Project description */}
      <label className="block text-sm text-gray-500 mb-1">Description</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
        placeholder="Project description…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {/* Steps */}
      <h2 className="mt-6 mb-3 text-lg font-semibold">Key Steps</h2>
      <button
        onClick={addStep}
        className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
      >
        + Add Step
      </button>

      <div className="mt-4 space-y-3">
        {steps.map((s) => {
          const meta = derive(s);
          return (
            <Link
              to={`/step/${s.id}`}
              key={s.id}
              className="block p-3 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition"
            >
              <div className="text-sm font-medium">{s.title}</div>

              {/* Progress bar + badge */}
              <div className="mt-3 flex items-center gap-3">
                {/* Progress bar */}
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 transition-[width] ${bar(meta.status)} ${
                      meta.progress > 0 ? "min-w-[4px]" : ""
                    }`}
                    style={{ width: `${meta.progress}%` }}
                  />
                </div>

                {/* Badge + percent */}
                <div className="flex items-center gap-10">
                  <span
                    className={`px-7 py-3 text-sm font-medium rounded-full border shadow-sm ${badge(
                      meta.status
                    )}`}
                  >
                    {meta.status}
                  </span>
                  <span className="text-sm text-gray-600">
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
