import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { projectsStore } from "../utils/projectsStore";

const genId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function ProjectFormPage() {
  const navigate = useNavigate();

  // required
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // 'YYYY-MM-DD'

  // optional
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([{ id: 1, title: "" }]);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const canSubmit = useMemo(() => title.trim() && dueDate, [title, dueDate]);

  const onAddStep = () => {
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([...steps, { id: nextId, title: "" }]);
  };

  const onRemoveStep = (id) => setSteps(steps.filter((s) => s.id !== id));
  const onChangeStep = (id, value) =>
    setSteps(steps.map((s) => (s.id === id ? { ...s, title: value } : s)));

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const all = projectsStore.load();
    const newId = genId();

    const initialSteps = steps
      .filter((s) => s.title.trim())
      .map((s, idx) => ({
        id: idx + 1,
        title: s.title.trim(),
        description: "",
        dueDate: null,
        subtasks: [],
      }));

    const newProject = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      dueDate, // 'YYYY-MM-DD'
      image: imageDataUrl || null,
      steps: initialSteps,
    };

    projectsStore.save([...(all || []), newProject]);
    navigate(`/project/${newId}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
        <Link
          to="/project"
          className="text-sm px-2 py-1 rounded hover:bg-gray-100"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-semibold">Create Project</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title (required) */}
        <div>
          <label htmlFor="p-title" className="block text-sm text-gray-600 mb-1">
            Project title <span className="text-red-500">*</span>
          </label>
          <input
            id="p-title"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My awesome project"
            required
          />
        </div>

        {/* Due date (required) */}
        <div>
          <label htmlFor="p-due" className="block text-sm text-gray-600 mb-1">
            Project deadline <span className="text-red-500">*</span>
          </label>
          <input
            id="p-due"
            type="date"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        {/* Description (optional) */}
        <div>
          <label htmlFor="p-desc" className="block text-sm text-gray-600 mb-1">
            Description (optional)
          </label>
          <textarea
            id="p-desc"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            rows={3}
            placeholder="Briefly describe the project…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Initial steps (optional) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">
              Initial steps (optional)
            </label>
            <button
              type="button"
              onClick={onAddStep}
              className="border border-gray-300 px-3 py-1.5 rounded text-xs hover:bg-gray-100"
            >
              + Add Step
            </button>
          </div>

          <div className="space-y-2">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder={`Step ${s.id} title`}
                  value={s.title}
                  onChange={(e) => onChangeStep(s.id, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => onRemoveStep(s.id)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image (optional) */}
        <div>
          <label htmlFor="p-image" className="block text-sm text-gray-600 mb-1">
            Project image (optional)
          </label>
          <input
            id="p-image"
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="text-sm"
          />
          {imageDataUrl && (
            <div className="mt-3">
              <img
                src={imageDataUrl}
                alt="Preview"
                className="max-h-40 rounded border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            Create project
          </button>
        </div>
      </form>
    </div>
  );
}
