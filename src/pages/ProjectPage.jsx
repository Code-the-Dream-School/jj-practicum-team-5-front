import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
        <div className="max-w-2xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            {isProjectNotFound ? (
                <div className="p-4">
                    Project not found. <Link to="/project">Back</Link>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-2">
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

                        {/* Project deadline + Overdue badge */}
                        <div className="ml-4 flex items-center gap-2">
                            <label htmlFor="project-due" className="text-xs text-gray-500">
                                Project due
                            </label>
                            <input
                                id="project-due"
                                type="date"
                                value={current.dueDate || ""}
                                onChange={(e) => onChangeProjectDue(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs"
                            />
                            {projectOverdue && <Badge status="error">Overdue</Badge>}
                        </div>
                    </div>

                    {/* Project <24h warning */}
                    <DueBanner
                        dueInfo={projectDueInfo}
                        text="less than 24 hours to the project deadline"
                    />

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
                            onClick={() => setShowNewStep(true)}
                            className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                        >
                            + Add Step
                        </button>
                    </div>

                    <div className="mt-2 space-y-3">
                        {(current.steps || []).map((s) => {
                            const meta = derive(s);
                            const variant = toVariant(meta.status);
                            return (
                                <Link
                                    to={`/project/${current.id}/step/${s.id}`}
                                    key={s.id}
                                    className="block p-3 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{s.title}</div>

                                            {/* Inline step due date */}
                                            <div className="mt-2 flex items-center gap-2">
                                                <label
                                                    className="text-xs text-gray-500"
                                                    htmlFor={`due-${current.id}-${s.id}`}
                                                >
                                                    Due date
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

                    {/* Modal to create a new step */}
                    <NewStepModal
                        open={showNewStep}
                        onClose={() => setShowNewStep(false)}
                        onCreate={createStepFromModal}
                    />
                </>
            )}
        </div>
    );
}
