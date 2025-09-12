import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";
import NewStepModal from "../components/NewStepModal";

import { getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";
import {
    projectsStore,
    loadLegacySteps,
    removeLegacySteps,
    createProject,
} from "../utils/projectsStore";

export default function ProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Load all projects (with migration)
    const [projects, setProjects] = useState(() => projectsStore.load());

    // Persist on change
    useEffect(() => {
        projectsStore.save(projects);
    }, [projects]);

    // Migrate legacy steps
    useEffect(() => {
        const legacy = loadLegacySteps();
        if (!legacy) return;
        setProjects((prev) => {
            if (prev.length === 0) {
                const seeded = createProject(projectId, legacy);
                return [seeded];
            }
            return prev;
        });
        removeLegacySteps();
    }, [projectId]);

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

    // Current project
    const current = useMemo(() => {
        if (projectId) return projects.find((p) => p.id === projectId) || null;
        return projects[0] || null;
    }, [projects, projectId]);

    // Update current by id
    const updateCurrentProject = (updater) => {
        if (!current) return;
        setProjects((prev) =>
            prev.map((p) => (p.id === current.id ? updater(p) : p))
        );
    };

    // Handlers
    const onChangeDescription = (e) =>
        updateCurrentProject((p) => ({ ...p, description: e.target.value }));

    const onChangeProjectDue = (value) =>
        updateCurrentProject((p) => ({ ...p, dueDate: value || null }));

    const setStepDueDate = (stepId, value) =>
        updateCurrentProject((p) => ({
            ...p,
            steps: (p.steps || []).map((s) =>
                s.id === stepId ? { ...s, dueDate: value || null } : s
            ),
        }));

    // Modal state & create handler
    const [showNewStep, setShowNewStep] = useState(false);

    const createStepFromModal = ({ title, description, dueDate }) => {
        if (!current) return;
        const steps = current.steps || [];
        const nextId = steps.length
            ? Math.max(...steps.map((s) => Number(s.id) || 0)) + 1
            : 1;

        const newStep = {
            id: nextId,
            title: title || `New Step ${nextId}`,
            description: description || "",
            dueDate: dueDate || null,
            subtasks: [],
        };

        updateCurrentProject((p) => ({ ...p, steps: [...steps, newStep] }));
    };

    // Handle back navigation
    const handleBackToProjects = () => {
        navigate('/dashboard');
    };

    // Project-level flags
    const allStepsDone = useMemo(
        () => (current?.steps || []).every((s) => derive(s).progress === 100),
        [current?.steps]
    );
    const projectDueInfo = useMemo(
        () => getDueInfo(current?.dueDate, allStepsDone),
        [current?.dueDate, allStepsDone]
    );
    const projectOverdue = projectDueInfo?.overdue;

    const isProjectNotFound = !current;

    return (
        <div className="min-h-screen relative flex flex-col items-center p-6 bg-gray-100">
            {/* Gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        linear-gradient(to bottom,
                        rgba(171, 212, 246, 1) 0%,
                        rgba(171, 212, 246, 0.9) 60%,
                        rgba(171, 212, 246, 0.5) 80%,
                        rgba(171, 212, 246, 0) 100%
                        )
                    `,
                }}
            />

            <section className="relative w-full max-w-4xl z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleBackToProjects}
                        className="px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ background: "linear-gradient(to right, #008096, #96007E)" }}
                    >
                        ← Back to Projects
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
                        Project Details
                    </h1>
                    <div className="w-24" /> {/* Empty block for symmetry */}
                </div>

                {/* Main content container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 bg-opacity-95 p-6 space-y-6">
                    {isProjectNotFound ? (
                        <div className="p-4 text-center">
                            <h2 className="text-xl font-semibold mb-4">Project not found</h2>
                            <button
                                onClick={handleBackToProjects}
                                className="px-4 py-2 text-white font-semibold rounded-lg transition-all duration-200"
                                style={{ background: "linear-gradient(to right, #008096, #96007E)" }}
                            >
                                Back to Projects
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Project Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold">
                                        {current.title?.trim() || "Untitled project"}
                                    </h1>
                                    {current.createdAt && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            Created {new Date(current.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {/* Project deadline + Overdue badge */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="project-due" className="text-sm font-semibold">
                                            Project Deadline
                                        </label>
                                        <input
                                            id="project-due"
                                            type="date"
                                            value={current.dueDate || ""}
                                            onChange={(e) => onChangeProjectDue(e.target.value)}
                                            className="border border-gray-300 rounded-xl px-3 py-2"
                                        />
                                    </div>
                                    {projectOverdue && (
                                        <Badge status="error" className="text-sm">
                                            Overdue
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Project <24h warning */}
                            <DueBanner
                                dueInfo={projectDueInfo}
                                text="less than 24 hours to the project deadline"
                            />

                            {/* Description */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-xl text-sm"
                                    placeholder="Project description…"
                                    value={current.description || ""}
                                    onChange={onChangeDescription}
                                    rows={3}
                                />
                            </div>

                            {/* Steps Section */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Key Steps</h2>
                                    <button
                                        onClick={() => setShowNewStep(true)}
                                        className="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:shadow-lg"
                                        style={{ background: "linear-gradient(to right, #96007E, #809600)" }}
                                    >
                                        + Add Step
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(current.steps || []).map((s) => {
                                        const meta = derive(s);
                                        const variant = toVariant(meta.status);
                                        return (
                                            <Link
                                                to={`/project/${current.id}/step/${s.id}`}
                                                key={s.id}
                                                className="block p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="text-lg font-medium mb-2">{s.title}</div>

                                                        {/* Inline step due date */}
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <label
                                                                className="text-sm text-gray-600 font-medium"
                                                                htmlFor={`due-${current.id}-${s.id}`}
                                                            >
                                                                Due date:
                                                            </label>
                                                            <input
                                                                id={`due-${current.id}-${s.id}`}
                                                                type="date"
                                                                value={s.dueDate || ""}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    setStepDueDate(s.id, e.target.value);
                                                                }}
                                                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                                                            />
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div className="mt-3">
                                                            <ProgressBar status={variant} value={meta.progress} />
                                                        </div>
                                                    </div>

                                                    {/* Badge + percent */}
                                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                                        <Badge status={variant} className="text-sm">
                                                            {meta.status}
                                                        </Badge>
                                                        <span className="text-lg font-semibold text-gray-700">
                                                            {meta.progress}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}

                                    {(current.steps || []).length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No steps yet. Click "Add Step" to get started.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal to create a new step */}
                            <NewStepModal
                                open={showNewStep}
                                onClose={() => setShowNewStep(false)}
                                onCreate={createStepFromModal}
                            />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}