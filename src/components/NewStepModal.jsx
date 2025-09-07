import React, { useEffect, useRef, useState } from "react";

export default function NewStepModal({ open = false, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // 'YYYY-MM-DD'

  const firstFieldRef = useRef(null);
  const panelRef = useRef(null);

  // Prevent background scroll and focus the first field when opening
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Defer to ensure element is mounted
    const t = setTimeout(() => firstFieldRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open]);

  // Close on ESC, add a minimal focus trap on Tab
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }

      if (e.key === "Tab") {
        // Minimal focus trap: cycle focus inside the panel
        const focusables = panelRef.current?.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;

        const list = Array.from(focusables).filter(
          (el) =>
            !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
        );
        const first = list[0];
        const last = list[list.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Submit handler: validate, emit, reset local state
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onCreate?.({
      title: trimmed,
      description: description.trim(),
      dueDate: dueDate || null,
    });

    // Reset only after successful create
    setTitle("");
    setDescription("");
    setDueDate("");
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-step-title"
      // Close when clicking the dark overlay (but not when clicking inside the panel)
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200"
        // Stop mousedown bubbling so clicks inside don't trigger overlay close
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="new-step-title" className="text-lg font-semibold">
            Create a new step
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title (required) */}
          <div>
            <label
              htmlFor="step-title"
              className="block text-sm text-gray-600 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="step-title"
              ref={firstFieldRef}
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Research requirements"
              required
            />
          </div>

          {/* Description (optional) */}
          <div>
            <label
              htmlFor="step-desc"
              className="block text-sm text-gray-600 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="step-desc"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={3}
              placeholder="What needs to be done?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Due date (optional) */}
          <div>
            <label
              htmlFor="step-due"
              className="block text-sm text-gray-600 mb-1"
            >
              Due date (optional)
            </label>
            <input
              id="step-due"
              type="date"
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="pt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm font-medium rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
            >
              Create step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
