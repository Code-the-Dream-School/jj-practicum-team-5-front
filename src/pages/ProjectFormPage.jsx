import React, { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

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
        completed: false,
      }));

    if (filteredSteps.length) {
      formData.append("steps", JSON.stringify(filteredSteps));
    }

    if (fileInputRef.current?.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("http://localhost:8000/api/v1/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create project");

      const newProject = await res.json();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

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
          <Link
            to="/dashboard"
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
            style={{
              background: "linear-gradient(to right, #008096, #96007E)",
            }}
          >
            ← Back to Projects
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
            Create New Project
          </h1>
          <div className="w-24" /> {/* Empty block for symmetry */}
        </div>

        {/* Form container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 bg-opacity-95 p-6 space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title & Deadline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Project title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-xl px-4 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-4 py-2"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                Description (optional)
              </label>
              <textarea
                className="w-full border rounded-xl px-4 py-2"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Steps (optional)</span>
                <button
                  type="button"
                  onClick={onAddStep}
                  className="px-4 py-2 rounded-lg text-white"
                  style={{
                    background: "linear-gradient(to right, #96007E, #809600)",
                  }}
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-3">
                {steps.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 bg-white border rounded-xl"
                  >
                    <span className="w-6 text-gray-500">#{idx + 1}</span>
                    <input
                      type="text"
                      className="flex-1 border rounded-lg px-3 py-2"
                      value={s.title}
                      onChange={(e) => onChangeStep(s.id, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveStep(s.id)}
                      className="text-red-600 border px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
              <label
                htmlFor="p-image"
                className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#008096] to-[#96007E] text-white font-semibold cursor-pointer shadow-md w-40 text-center"
              >
                {imageDataUrl ? "Change Image" : "Upload"}
              </label>
              <input
                id="p-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onPickImage}
                className="hidden"
              />
              {fileName && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {fileName}
                </div>
              )}
              {imageDataUrl && (
                <>
                  <div className="mt-4 w-40 h-40 rounded-lg overflow-hidden border">
                    <img
                      src={imageDataUrl}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="mt-2 text-red-600 border px-3 py-1 rounded-lg"
                  >
                    Remove image
                  </button>
                </>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!canSubmit}
                className="px-8 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                style={{
                  background: canSubmit
                    ? "linear-gradient(to right, #008096, #96007E)"
                    : "gray",
                }}
              >
                Create project
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
