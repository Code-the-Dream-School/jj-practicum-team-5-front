export default function ConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  projectTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Project</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{projectTitle}"</span>?<br />
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-xl border font-semibold transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl text-white font-semibold shadow-md transition hover:shadow-lg"
            style={{
              background: "linear-gradient(to right, #DC2626, #B91C1C)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
