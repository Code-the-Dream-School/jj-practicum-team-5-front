import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ProgressBar from "../components/ProgressBar";
import DueBanner from "../components/DueBanner";
import NewStepModal from "../components/NewStepModal";

import { getDueInfo } from "../utils/due";
import { derive, toVariant } from "../utils/derive";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ProjectPage() {
  const { projectId } = useParams();

  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewStep, setShowNewStep] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Load project from backend
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/api/v1/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        setCurrent(data.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Helper to update project both locally and on server
  const updateCurrentProject = async (updates) => {
    if (!current) return;
    const token = localStorage.getItem("authToken");

    let updated = { ...current, ...updates };

    if (updated.steps) {
      updated.steps = updated.steps.map((s) => ({
        ...s,
        _id: s._id,
      }));
    }

    setCurrent(updated);

    try {
      const res = await fetch(`${API_URL}/api/v1/projects/${current._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update project");

      const data = await res.json();
      setCurrent(data.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Handle image upload
  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 3;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`Image is too large (> ${MAX_MB}MB).`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onRemoveImage = () => {
    setImageDataUrl(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSaveImage = async () => {
    if (!fileInputRef.current?.files[0] || !current) {
      console.warn("No file selected or project not loaded");
      return;
    }

    console.log("Saving image for project:", current._id);

    const formData = new FormData();
    formData.append("image", fileInputRef.current.files[0]);

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `${API_URL}/api/v1/projects/${current._id}/image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to upload image: ${errText}`);
      }

      const data = await res.json();
      console.log("Upload response:", data);

      const newImage = data.image || data.data?.image;

      if (!newImage) {
        console.error("⚠️ No image path in response:", data);
        return;
      }

      setCurrent((prev) => ({ ...prev, image: newImage }));
      setImageDataUrl(null);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      console.log("✅ Image updated:", newImage);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // Handlers
  const onChangeDescription = (e) =>
    updateCurrentProject({ description: e.target.value });

  const onChangeProjectDue = (value) =>
    updateCurrentProject({ dueDate: value || null });

  const setStepDueDate = (stepId, value) => {
    const steps = (current.steps || []).map((s) =>
      String(s._id || s.id) === String(stepId)
        ? { ...s, dueDate: value || null }
        : s
    );
    updateCurrentProject({ steps });
  };

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
      completed: false,
      subtasks: [],
    };

    updateCurrentProject({ steps: [...steps, newStep] });
  };

  // Derived flags
  const allStepsDone = useMemo(
    () => (current?.steps || []).every((s) => derive(s).progress === 100),
    [current?.steps]
  );
  const projectDueInfo = useMemo(
    () => getDueInfo(current?.dueDate, allStepsDone),
    [current?.dueDate, allStepsDone]
  );
  const projectOverdue = projectDueInfo?.overdue;

  // UI states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ABD4F6] to-[#ABD4F650]">
        <div className="text-center p-8 rounded-2xl bg-white bg-opacity-90 shadow-xl">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ABD4F6] to-[#ABD4F650]">
        <div className="text-center p-8 rounded-2xl bg-white bg-opacity-90 shadow-xl max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {error || "Project not found"}
          </h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-2 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ABD4F6] via-[#ABD4F690] to-transparent">
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-4 flex justify-center">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            ← Back to Projects
          </Link>
        </div>

        {/* Info + Image side by side */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Info block centered */}
          <div className="flex-1 max-w-3xl bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 backdrop-blur-sm mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-200 pb-4 mb-4">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {current.title?.trim() || "Untitled project"}
                </h1>
                {current.createdAt && (
                  <div className="text-sm text-gray-600">
                    Created {new Date(current.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                <label
                  htmlFor="project-due"
                  className="text-sm font-medium text-gray-700"
                >
                  Project due
                </label>
                <input
                  id="project-due"
                  type="date"
                  value={
                    current.dueDate ? current.dueDate.substring(0, 10) : ""
                  }
                  onChange={(e) => onChangeProjectDue(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition"
                />
                {projectOverdue && (
                  <div className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                    Overdue
                  </div>
                )}
              </div>
            </div>

            <DueBanner
              dueInfo={projectDueInfo}
              text="less than 24 hours to the project deadline"
            />

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-xl text-sm italic bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Project description…"
                value={current.description || ""}
                onChange={onChangeDescription}
                rows={4}
              />
            </div>

            {/* Steps Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Key Steps</h2>
                <button
                  onClick={() => setShowNewStep(true)}
                  className="inline-flex items-center px-6 py-2 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 text-white"
                  style={{
                    background: "linear-gradient(to right, #96007E, #809600)",
                  }}
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-4">
                {(current.steps || []).map((s) => {
                  const meta = derive(s);
                  const variant = toVariant(meta.status);
                  const hasSubtasks = (s.subtasks || []).length > 0;

                  return (
                    <Link
                      to={`/project/${current._id}/step/${s._id || s.id}`}
                      key={s._id || s.id}
                      className="block p-6 border border-gray-200 rounded-2xl bg-white bg-opacity-70 hover:bg-opacity-90 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Checkbox + header */}

                          <div className="relative flex items-baseline gap-3 mb-3 group">
                            {/* Checkbox for marking step as completed */}
                            <input
                              type="checkbox"
                              checked={s.completed}
                              disabled={hasSubtasks}
                              onClick={(e) => e.stopPropagation()} // prevent navigation when clicking
                              onChange={(e) => {
                                if (hasSubtasks) return; // block if subtasks exist
                                const steps = (
                                  current.steps || []
                                ).map((step) =>
                                  String(step._id || step.id) ===
                                  String(s._id || s.id)
                                    ? { ...step, completed: e.target.checked }
                                    : step
                                );
                                updateCurrentProject({ steps });
                              }}
                              className={`w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 ${
                                hasSubtasks
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            />

                            {/* Tooltip if subtasks exist */}
                            {hasSubtasks && (
                              <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                You must complete all subtasks first
                              </div>
                            )}

                            {/* Step title */}
                            <span className="text-lg font-semibold text-gray-900">
                              {s.title}
                            </span>

                            {/* Hint next to the title */}
                            <span className="text-sm italic text-gray-400 ml-2 hover:text-gray-600">
                              You can add subtasks inside
                            </span>
                          </div>

                          {/* Due date */}
                          <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded-lg p-3">
                            <label className="text-sm font-medium text-gray-700">
                              Due date
                            </label>
                            <input
                              type="date"
                              value={
                                s.dueDate ? s.dueDate.substring(0, 10) : ""
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                setStepDueDate(s._id || s.id, e.target.value);
                              }}
                              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 transition"
                            />
                          </div>

                          {/* Progress bar with color */}
                          <ProgressBar progress={meta.progress} />
                        </div>

                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <Badge status={variant}>{meta.status}</Badge>
                          <div
                            className="text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
                            style={{
                              backgroundColor:
                                variant === "success"
                                  ? "#4C5A00"
                                  : variant === "warning"
                                  ? "#5A004C"
                                  : "#004C5A",
                            }}
                          >
                            {meta.progress}%
                          </div>

                          {/* Button: Step Details */}
                          <Link
                            to={`/project/${current._id}/step/${s._id || s.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="ml-2 px-3 py-1.5 text-white font-medium rounded-lg text-xs transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5"
                            style={{
                              background:
                                "linear-gradient(to right, #008096, #96007E)",
                            }}
                          >
                            Step Details
                          </Link>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Image block */}
          <div className="w-full lg:w-1/3 flex flex-col items-center bg-white bg-opacity-90 p-4 rounded-2xl shadow-md">
            {/* Current image */}
            {current.image && !imageDataUrl && (
              <img
                src={`${API_URL}${current.image}?t=${Date.now()}`}
                alt={current.title}
                className="w-full h-auto object-contain max-h-64 rounded-xl border"
              />
            )}

            {/* Preview of selected image */}
            {imageDataUrl && (
              <div className="mt-2 w-40 h-40 rounded-lg overflow-hidden border">
                <img
                  src={imageDataUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Selected file name */}
            {fileName && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {fileName}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              <label
                htmlFor="project-image"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#008096] to-[#96007E] text-white rounded-lg shadow cursor-pointer hover:opacity-90"
              >
                {imageDataUrl
                  ? "Change Image"
                  : current.image
                  ? "Replace Image"
                  : "Add Image"}
              </label>
              <input
                id="project-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onPickImage}
                className="hidden"
              />

              {imageDataUrl && (
                <>
                  <button
                    type="button"
                    onClick={onSaveImage}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={onRemoveImage}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-2">JPEG, PNG up to 5MB</p>
          </div>
        </div>

        <NewStepModal
          open={showNewStep}
          onClose={() => setShowNewStep(false)}
          onCreate={createStepFromModal}
        />
      </div>
    </div>
  );
}
