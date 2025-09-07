import React, { useMemo, useRef, useState } from "react";
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

  // image state
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [fileName, setFileName] = useState(""); // for custom label
  const fileInputRef = useRef(null); // to reset native input

  const canSubmit = useMemo(() => title.trim() && dueDate, [title, dueDate]);

  const onAddStep = () => {
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([...steps, { id: nextId, title: "" }]);
  };

  const onRemoveStep = (id) => setSteps(steps.filter((s) => s.id !== id));
  const onChangeStep = (id, value) =>
      setSteps(steps.map((s) => (s.id === id ? { ...s, title: value } : s)));

  // Custom file picker handler: hide native input, show our UI
  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional sanity check for size (e.g., 3MB)
    const MAX_MB = 3;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`Image is too large (> ${MAX_MB}MB).`);
      // Reset the input
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileName(file.name);

    // Keep data URL in memory
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  // Allow clearing the chosen image entirely
  const onRemoveImage = () => {
    setImageDataUrl(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear native input state
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("dueDate", dueDate);
    formData.append("description", description || "");

    const filteredSteps = steps
        .filter((s) => s.title.trim())
        .map((s, idx) => ({
          id: idx + 1,
          title: s.title.trim(),
          completed: false
        }));

    if (filteredSteps.length) {
      formData.append("steps", JSON.stringify(filteredSteps));
    }

    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/projects", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to create project");

      const newProject = await res.json();
      navigate(`/project/${newProject._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
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

          {/* Image (optional) - custom picker that hides the native input and shows a custom label instead of "No file chosen" */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Project image (optional)
            </label>

            {/* Hidden native input */}
            <input
                id="p-image"
                type="file"
                accept="image/*"
                onChange={onPickImage}
                ref={fileInputRef}
                className="hidden"
            />

            {/* Custom button to open the file dialog */}
            <label
                htmlFor="p-image"
                className="inline-block px-3 py-2 text-sm border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
            >
              Upload image
            </label>

            {/* File name text (instead of the native 'No file chosen') */}
            {fileName && (
                <span className="ml-2 align-middle text-xs text-gray-500">
              Selected: {fileName}
            </span>
            )}

            {/* Allow removing the selected image */}
            {(fileName || imageDataUrl) && (
                <button
                    type="button"
                    onClick={onRemoveImage}
                    className="ml-3 text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Remove image
                </button>
            )}

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