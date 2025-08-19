const variants = {
  success: "border-green-500 text-green-600 bg-green-100",
  warning: "border-orange-500 text-orange-600 bg-orange-100",
  error: "border-red-500 text-red-600 bg-red-100",
  neutral: "border-gray-400 text-gray-600 bg-white",
};

const cx = (...a) => a.filter(Boolean).join(" ");

export default function Badge({ status = "neutral", className, children }) {
  const v = variants[status] ?? variants.neutral;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md border text-sm",
        v,
        className
      )}
    >
      {children}
    </span>
  );
}
