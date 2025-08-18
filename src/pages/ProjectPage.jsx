import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";

/** Generate a reasonably unique id */
const genId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

// Storage keys
const PROJECTS_KEY = "projects_v1";
const LEGACY_STEPS_KEY = "steps_v1";

// storage helpers
const loadProjects = () => {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveProjects = (projects) =>
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

const loadLegacySteps = () => {
  try {
    const raw = localStorage.getItem(LEGACY_STEPS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

//  domain helpers
/** Calculate progress & status from subtasks */
function getStepProgress(step) {
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

/** Map domain status to UI variant */
function mapStatusToVariant(status) {
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
}

// seed data
const seedSteps = () => [
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

function createProject(initialId) {
  const id = initialId || genId();
  const legacy = loadLegacySteps(); // null after migration
  return {
    id,
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    steps: legacy ?? seedSteps(),
  };
}

export default function ProjectPage() {
  const { projectId } = useParams(); // expected route: /project/:projectId

  // Store the full list; derive "current" from it
  const [projects, setProjects] = useState(() => loadProjects());

  // Persist every time projects change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // One-time legacy migration from steps_v1
  useEffect(() => {
    const legacy = loadLegacySteps();
    if (!legacy) return;

    setProjects((prev) => {
      if (prev.length === 0) {
        const seeded = {
          id: projectId || genId(),
          title: "",
          description: "",
          createdAt: new Date().toISOString(),
          steps: legacy,
        };
        return [seeded];
      }
      return prev;
    });

    localStorage.removeItem(LEGACY_STEPS_KEY);
  }, []);

  // Ensure a project exists for current route id (or at least one default)
  useEffect(() => {
    setProjects((prev) => {
      if (projectId) {
        const exists = prev.some((p) => p.id === projectId);
        if (!exists) return [createProject(projectId), ...prev];
        return prev;
      }
      if (prev.length === 0) return [createProject()];
      return prev;
    });
  }, [projectId]);

  // Derived "current" project
  const current = useMemo(() => {
    if (projectId) return projects.find((p) => p.id === projectId) || null;
    return projects[0] || null;
  }, [projects, projectId]);

  // Update current project in-place by id
  const updateCurrentProject = (updater) => {
    if (!current) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === current.id ? updater(p) : p))
    );
  };

  // Handlers
  const onChangeDescription = (e) => {
    const v = e.target.value;
    updateCurrentProject((p) => ({ ...p, description: v }));
  };

  const addStep = () => {
    if (!current) return;
    const steps = current.steps || [];
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    const newStep = {
      id: nextId,
      title: `New Step ${nextId}`,
      description: "",
      dueDate: null,
      subtasks: [],
    };
    updateCurrentProject((p) => ({ ...p, steps: [...steps, newStep] }));
  };

  if (!current) {
    return (
      <div className="p-4">
        Project not found. <Link to="/project">Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {current.title?.trim() || "Untitled project"}
          </h1>
          {current.createdAt && (
            <div className="text-xs text-gray-500 mt-1">
              Created {new Date(current.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="w-16" />
      </div>

      {/* Description */}
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
        value={current.description || ""}
        onChange={onChangeDescription}
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
        {(current.steps || []).map((s) => {
          const meta = getStepProgress(s);
          const variant = mapStatusToVariant(meta.status);
          return (
            <Link
              // keep absolute path as before
              to={`/project/${current.id}/step/${s.id}`}
              key={s.id}
              className="block p-3 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="mt-3">
                    <ProgressBar status={variant} value={meta.progress} />
                  </div>
                </div>
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
