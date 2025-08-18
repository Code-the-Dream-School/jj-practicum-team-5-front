import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";

import { toDateOnly, getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";
import { createJSONStore } from "../utils/storage";

// --- storage stores ---
const stepsStore = createJSONStore("steps_v1", [], {
  migrate: (arr) =>
    (arr || []).map((s) => ({ ...s, dueDate: toDateOnly(s.dueDate) })),
});

const projectStore = createJSONStore(
  "project_meta_v1",
  { description: "", dueDate: null },
  {
    migrate: (p = {}) => ({
      description: p.description || "",
      dueDate: toDateOnly(p.dueDate),
    }),
  }
);

export default function ProjectPage() {
  // Steps (with seeding if empty)
  const initialSteps = (() => {
    const fromLS = stepsStore.load();
    if (fromLS && fromLS.length) return fromLS;

    const seed = [
      {
        id: 1,
        title: "Define scope",
        description: "Agree on goals and constraints.",
        dueDate: null, // 'YYYY-MM-DD'
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
    stepsStore.save(seed);
    return seed;
  })();

  const [steps, setSteps] = useState(initialSteps);

  // Project meta
  const initialProject = projectStore.load();
  const [description, setDescription] = useState(initialProject.description);
  const [projectDue, setProjectDue] = useState(initialProject.dueDate); // 'YYYY-MM-DD' or null

  // Persist
  useEffect(() => {
    stepsStore.save(steps);
  }, [steps]);
  useEffect(() => {
    projectStore.save({ description, dueDate: projectDue });
  }, [description, projectDue]);

  // Actions
  const addStep = () => {
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([
      ...steps,
      {
        id: nextId,
        title: `New Step ${nextId}`,
        description: "",
        dueDate: null,
        subtasks: [],
      },
    ]);
  };

  const setStepDueDate = (stepId, value) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, dueDate: value || null } : s))
    );
  };

  // Project deadline flags
  const projectDueInfo = useMemo(() => {
    const allDone = steps.every((s) => derive(s).progress === 100);
    return getDueInfo(projectDue, allDone);
  }, [projectDue, steps]);

  const projectOverdue = projectDueInfo.overdue;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 pb-3 mb-2 gap-3">
        <h1 className="text-2xl font-bold">Project</h1>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="project-due" className="text-xs text-gray-500">
            Project due
          </label>
          <input
            id="project-due"
            type="date"
            value={projectDue || ""}
            onChange={(e) => setProjectDue(e.target.value || null)} // store as 'YYYY-MM-DD'
            className="border border-gray-300 rounded px-2 py-1 text-xs"
          />
          {projectOverdue && <Badge status="error">Overdue</Badge>}
        </div>
      </div>

      {/* <24h project warning */}
      <DueBanner
        dueInfo={projectDueInfo}
        text="less than 24 hours to the project deadline"
      />

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

                  {/* Inline due date for step */}
                  <div className="mt-2 flex items-center gap-2">
                    <label
                      className="text-xs text-gray-500"
                      htmlFor={`due-${s.id}`}
                    >
                      Due date
                    </label>
                    <input
                      id={`due-${s.id}`}
                      type="date"
                      value={s.dueDate || ""}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        setStepDueDate(s.id, e.target.value);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>

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
