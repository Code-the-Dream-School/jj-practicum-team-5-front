import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";

/* Storage (projects_v1)  */
const PROJECTS_KEY = "projects_v1";
const loadProjects = () => {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveProjects = (projects) =>
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

/* Progress & status  */
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

/*  Page  */
export default function StepPage() {
  // expected route: /project/:projectId/step/:stepId
  const { projectId, stepId } = useParams();
  const location = useLocation();
  const stateStep = location.state?.step || null; // optional fallback when navigating with state

  // keep all projects in state
  const [projects, setProjects] = useState(() => loadProjects());

  // find current project by id
  const project = useMemo(
    () => projects.find((p) => p.id === projectId) || null,
    [projects, projectId]
  );

  // interpret stepId as number if numeric, otherwise keep as string
  const normalizeId = (x) => {
    const n = Number(x);
    return Number.isFinite(n) && String(n) === String(x) ? n : String(x);
  };
  const sid = normalizeId(stepId);

  // find step within the current project
  const findStep = (proj) =>
    proj?.steps?.find((s) => String(s.id) === String(sid)) || null;

  const [step, setStep] = useState(() => findStep(project));

  // if step came only from Link state, insert into project and persist
  useEffect(() => {
    if (!project) return;
    if (!step && stateStep && String(stateStep.id) === String(sid)) {
      const nextProject = {
        ...project,
        steps: [
          ...(project.steps || []),
          { ...stateStep, subtasks: stateStep.subtasks || [] },
        ],
      };
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.id === project.id);
        const copy = [...prev];
        if (idx === -1) copy.unshift(nextProject);
        else copy[idx] = nextProject;
        saveProjects(copy);
        return copy;
      });
      setStep(stateStep);
    }
  }, [project, stateStep, sid]);

  // refresh local step if projects change
  useEffect(() => {
    setStep(findStep(project));
  }, [project]);

  const meta = useMemo(() => derive(step || {}), [step]);
  const variant = toVariant(meta.status);

  // update project in array and persist
  const upsertProject = (nextProject) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === nextProject.id);
      const copy = [...prev];
      if (idx === -1) copy.unshift(nextProject);
      else copy[idx] = nextProject;
      saveProjects(copy);
      return copy;
    });
  };

  // update this step inside its project
  const updateAndPersist = (updatedStep) => {
    if (!project) return;
    const nextSteps = (project.steps || []).some(
      (s) => String(s.id) === String(updatedStep.id)
    )
      ? project.steps.map((s) =>
          String(s.id) === String(updatedStep.id) ? updatedStep : s
        )
      : [...(project.steps || []), updatedStep];

    const nextProject = { ...project, steps: nextSteps };
    setStep(updatedStep);
    upsertProject(nextProject);
  };

  const setDescription = (val) =>
    updateAndPersist({ ...step, description: val });

  const setDueDate = (val) =>
    updateAndPersist({
      ...step,
      // store ISO string or null
      dueDate: val ? new Date(val).toISOString() : null,
    });

  const toggleSubtask = (tid) => {
    const subtasks = (step?.subtasks || []).map((t) =>
      String(t.id) === String(tid) ? { ...t, done: !t.done } : t
    );
    updateAndPersist({ ...step, subtasks });
  };

  const editSubtaskTitle = (tid, title) => {
    const subtasks = (step?.subtasks || []).map((t) =>
      String(t.id) === String(tid) ? { ...t, title } : t
    );
    updateAndPersist({ ...step, subtasks });
  };

  const addSubtask = () => {
    const list = step?.subtasks || [];
    // support numeric IDs if existing, otherwise fallback to string
    const nextNumeric =
      list.length && list.every((t) => Number.isFinite(Number(t.id)))
        ? Math.max(...list.map((t) => Number(t.id))) + 1
        : null;
    const newId =
      nextNumeric ?? `${Date.now()}-${(list.length + 1).toString(36)}`;

    updateAndPersist({
      ...step,
      subtasks: [...list, { id: newId, title: `New item`, done: false }],
    });
  };

  const removeSubtask = (tid) =>
    updateAndPersist({
      ...step,
      subtasks: (step?.subtasks || []).filter(
        (t) => String(t.id) !== String(tid)
      ),
    });

  /*  Guards  */
  if (!project) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="mb-3">Project not found.</p>
        <Link to="/project" className="text-blue-600 underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="mb-3">Step not found.</p>
        <Link to={`/project/${project.id}`} className="text-blue-600 underline">
          ← Back to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
        <Link
          to={`/project/${project.id}`}
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
          value={
            step.dueDate
              ? new Date(step.dueDate).toISOString().slice(0, 10)
              : ""
          }
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
