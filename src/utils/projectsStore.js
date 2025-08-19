import { createJSONStore } from "./storage";
import { toDateOnly } from "./due";

/** reasonably unique id */
const genId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const LEGACY_STEPS_KEY = "steps_v1";

export const loadLegacySteps = () => {
  try {
    const raw = localStorage.getItem(LEGACY_STEPS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const removeLegacySteps = () =>
  localStorage.removeItem(LEGACY_STEPS_KEY);

// default seeded steps for a new project
export const seedSteps = () => [
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

export function createProject(initialId, steps = seedSteps()) {
  return {
    id: initialId || genId(),
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    dueDate: null, // project-level 'YYYY-MM-DD'
    steps,
  };
}

export const projectsStore = createJSONStore("projects_v1", [], {
  migrate: (arr) =>
    (arr || []).map((p) => ({
      id: p.id || genId(),
      title: p.title || "",
      description: p.description || "",
      createdAt: p.createdAt || new Date().toISOString(),
      dueDate: toDateOnly(p.dueDate),
      steps: (p.steps || []).map((s) => ({
        ...s,
        dueDate: toDateOnly(s.dueDate),
        subtasks: (s.subtasks || []).map((t) => ({
          id: t.id,
          title: t.title || "",
          done: !!t.done,
        })),
      })),
    })),
});
